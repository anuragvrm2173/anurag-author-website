import { hasSupabase, supabase } from "./supabaseClient";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT || "https://formsubmit.co/ajax/vanuragverma2173@gmail.com";
const ADMIN_NOTIFICATION_ENDPOINT = import.meta.env.VITE_ADMIN_NOTIFICATION_ENDPOINT || CONTACT_ENDPOINT;

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

async function sendAdminContactCopy(payload, deliveryChannel) {
  if (!ADMIN_NOTIFICATION_ENDPOINT) {
    return false;
  }

  const messageBody = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Delivery: ${deliveryChannel}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");

  const response = await fetch(ADMIN_NOTIFICATION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      message: messageBody,
      _subject: "New Contact Message (Website)",
    }),
  });

  if (!response.ok) {
    throw new Error("Admin notification failed");
  }

  return true;
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

async function submitToEndpoint(payload) {
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
      _subject: "Contact Form Submission",
    }),
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }
}

export async function submitContactMessage(payload) {
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
      await submitToEndpoint(normalizedPayload);
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

  let copySent = false;
  try {
    copySent = await sendAdminContactCopy(normalizedPayload, deliveryChannel);
  } catch {
    // The user submission has already succeeded through at least one channel.
  }

  return {
    ok: true,
    deliveryChannel,
    copySent,
    delivered: deliveryChannel !== "local",
  };
}