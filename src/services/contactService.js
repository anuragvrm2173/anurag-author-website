import { hasSupabase, supabase } from "./supabaseClient";
import { assertCaptchaToken, normalizeCaptchaToken } from "./captchaService";
import { sendAdminNotification } from "./notificationsService";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || "https://formsubmit.co/ajax/vanuragverma2173@gmail.com";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function storeMessageLocally(payload) {
  if (!canUseLocalStorage()) {
    throw new Error("Local storage is unavailable");
  }

  const messages = JSON.parse(window.localStorage.getItem("admin_messages") || "[]");
  messages.unshift({
    id: `${Date.now()}`,
    ...payload,
    status: "unread",
    created_at: new Date().toISOString(),
  });
  window.localStorage.setItem("admin_messages", JSON.stringify(messages));
}

async function submitToSupabase(payload) {
  const { error } = await supabase.from("messages").insert([
    {
      name: payload.name,
      email: payload.email,
      message: payload.message,
      status: "unread",
    },
  ]);

  if (error) {
    throw error;
  }
}

async function submitToEndpoint(payload, subject = "Contact Form Submission", captchaToken = "") {
  if (!CONTACT_ENDPOINT) {
    throw new Error("Contact endpoint is not configured");
  }

  const response = await fetch(CONTACT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...payload,
      _subject: subject,
      turnstileToken: captchaToken,
      "cf-turnstile-response": captchaToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }
}

export async function submitContactMessage(payload, options = {}) {
  const subject = String(options?.subject || "Contact Form Submission").trim() || "Contact Form Submission";
  const captchaToken = normalizeCaptchaToken(options?.captchaToken);

  assertCaptchaToken(captchaToken);

  const normalizedPayload = {
    name: String(payload?.name || "").trim(),
    email: String(payload?.email || "").trim(),
    message: String(payload?.message || "").trim(),
  };

  if (!normalizedPayload.name || !normalizedPayload.email || !normalizedPayload.message) {
    throw new Error("Please complete all fields before sending your message.");
  }

  let deliveryChannel = "none";

  if (hasSupabase()) {
    try {
      await submitToSupabase(normalizedPayload);
      deliveryChannel = "supabase";
    } catch {
      // Continue to endpoint/local fallback when Supabase is unavailable or table is not ready.
    }
  }

  if (deliveryChannel === "none") {
    try {
      await submitToEndpoint(normalizedPayload, subject, captchaToken);
      deliveryChannel = "endpoint";
    } catch {
      // Continue to local fallback when endpoint is temporarily unavailable.
    }
  }

  if (deliveryChannel === "none") {
    try {
      storeMessageLocally(normalizedPayload);
      deliveryChannel = "local";
    } catch {
      throw new Error("We could not send your message right now. Please try again in a moment.");
    }
  }

  // Send admin notification via Edge Function (with FormSubmit fallback)
  try {
    await sendAdminNotification({
      subject,
      name: normalizedPayload.name,
      email: normalizedPayload.email,
      message: normalizedPayload.message,
      captchaToken,
    });
  } catch {
    // Notification failure must not fail the user's message submission
  }

  return {
    ok: true,
    deliveryChannel,
    copySent: true,
    delivered: deliveryChannel !== "local",
  };
}

export async function submitBuyNowLead(payload) {
  const normalizedName = String(payload?.name || "").trim() || "Website Reader";
  const normalizedEmail = String(payload?.email || "").trim() || "not-provided@no-email.local";

  const leadPayload = {
    name: normalizedName,
    email: normalizedEmail,
    message: [
      "[BUY_NOW_LEAD]",
      "Book purchase intent",
      `Reader Contact Email: ${String(payload?.email || "").trim() || "Not provided"}`,
      `Book: ${String(payload?.bookTitle || "Unknown").trim() || "Unknown"}`,
      `Edition: ${String(payload?.editionLabel || "Unknown").trim() || "Unknown"}`,
      `Retailer: ${String(payload?.retailerName || "Unknown").trim() || "Unknown"}`,
      `Buy URL: ${String(payload?.buyUrl || "").trim()}`,
    ].join("\n"),
  };

  return submitContactMessage(leadPayload, {
    subject: "New Buy Now Lead (Website)",
    captchaToken: payload?.captchaToken,
  });
}