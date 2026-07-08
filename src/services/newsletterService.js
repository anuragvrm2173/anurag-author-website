import { hasSupabase, supabase } from "./supabaseClient";

const PROVIDER = (import.meta.env.VITE_NEWSLETTER_PROVIDER || "").toLowerCase();
const PROXY_ENDPOINT = import.meta.env.VITE_NEWSLETTER_PROXY_ENDPOINT;
const ADMIN_NOTIFICATION_ENDPOINT = import.meta.env.VITE_ADMIN_NOTIFICATION_ENDPOINT
  || import.meta.env.VITE_CONTACT_FORM_ENDPOINT
  || "https://formsubmit.co/ajax/vanuragverma2173@gmail.com";

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

async function sendAdminNewsletterCopy(email, source, deliveryChannel) {
  if (!ADMIN_NOTIFICATION_ENDPOINT) {
    return false;
  }

  const response = await fetch(ADMIN_NOTIFICATION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: "Newsletter Signup",
      email,
      message: `A new newsletter subscription was received.\n\nEmail: ${email}\nSource: ${source || "unknown"}\nDelivery: ${deliveryChannel}`,
      _subject: "New Newsletter Signup (Website)",
    }),
  });

  if (!response.ok) {
    throw new Error("Newsletter admin notification failed");
  }

  return true;
}

async function subscribeThroughProxy(email, source) {
  const response = await fetch(PROXY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, source, provider: PROVIDER || "none", subscribedAt: new Date().toISOString() }),
  });

  if (!response.ok) {
    throw new Error("Newsletter proxy request failed");
  }
}

async function subscribeConvertKit(email, source) {
  const endpoint = import.meta.env.VITE_CONVERTKIT_ENDPOINT;
  const apiKey = import.meta.env.VITE_CONVERTKIT_API_KEY;
  const formId = import.meta.env.VITE_CONVERTKIT_FORM_ID;

  if (!endpoint || !apiKey || !formId) {
    throw new Error("ConvertKit is not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, email, form_id: formId, fields: { source } }),
  });

  if (!response.ok) {
    throw new Error("ConvertKit subscribe failed");
  }
}

async function subscribeMailerLite(email, source) {
  const endpoint = import.meta.env.VITE_MAILERLITE_ENDPOINT;
  const apiKey = import.meta.env.VITE_MAILERLITE_API_KEY;

  if (!endpoint || !apiKey) {
    throw new Error("MailerLite is not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email, fields: { source, signup_date: new Date().toISOString() } }),
  });

  if (!response.ok) {
    throw new Error("MailerLite subscribe failed");
  }
}

async function subscribeBrevo(email, source) {
  const endpoint = import.meta.env.VITE_BREVO_ENDPOINT;
  const apiKey = import.meta.env.VITE_BREVO_API_KEY;
  const listId = Number(import.meta.env.VITE_BREVO_LIST_ID || 0);

  if (!endpoint || !apiKey || !listId) {
    throw new Error("Brevo is not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      attributes: { SOURCE: source, SIGNUP_DATE: new Date().toISOString() },
      updateEnabled: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Brevo subscribe failed");
  }
}

function storeSignupLocally(email, source) {
  if (!canUseLocalStorage()) {
    throw new Error("Local storage is unavailable");
  }

  const list = JSON.parse(window.localStorage.getItem("newsletter_signups") || "[]");
  list.push({ email, source, provider: PROVIDER || "local", signupDate: new Date().toISOString() });
  window.localStorage.setItem("newsletter_signups", JSON.stringify(list));
}

async function storeSignupInSupabase(email, source) {
  const { error } = await supabase.from("newsletter_subscribers").upsert([
    {
      email,
      source,
      provider: PROVIDER || (PROXY_ENDPOINT ? "proxy" : "supabase"),
      subscribed_at: new Date().toISOString(),
      status: "active",
    },
  ], {
    onConflict: "email",
  });

  if (error) {
    throw error;
  }
}

async function syncWithExternalProvider(email, source) {
  if (PROXY_ENDPOINT) {
    await subscribeThroughProxy(email, source);
    return true;
  }

  if (PROVIDER === "convertkit") {
    await subscribeConvertKit(email, source);
    return true;
  }

  if (PROVIDER === "mailerlite") {
    await subscribeMailerLite(email, source);
    return true;
  }

  if (PROVIDER === "brevo") {
    await subscribeBrevo(email, source);
    return true;
  }

  return false;
}

export async function subscribeToNewsletter(email, source) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedSource = String(source || "Website").trim();

  if (!normalizedEmail) {
    throw new Error("Please enter your email address.");
  }

  let deliveryChannel = "none";

  if (hasSupabase()) {
    try {
      await storeSignupInSupabase(normalizedEmail, normalizedSource);
      deliveryChannel = "supabase";
    } catch {
      // Continue with provider/local fallback when Supabase table is missing or unavailable.
    }

    try {
      const synced = await syncWithExternalProvider(normalizedEmail, normalizedSource);
      if (synced) {
        deliveryChannel = deliveryChannel === "none" ? "provider" : `${deliveryChannel}+provider`;
      }
    } catch (error) {
      console.error("Newsletter provider sync failed", error);
    }
  }

  if (deliveryChannel === "none") {
    try {
      const synced = await syncWithExternalProvider(normalizedEmail, normalizedSource);
      if (synced) {
        deliveryChannel = "provider";
      }
    } catch (error) {
      console.error("Newsletter fallback provider sync failed", error);
    }
  }

  if (deliveryChannel === "none") {
    try {
      storeSignupLocally(normalizedEmail, normalizedSource);
      deliveryChannel = "local";
    } catch {
      throw new Error("We could not complete your subscription right now. Please try again.");
    }
  }

  let copySent = false;
  try {
    copySent = await sendAdminNewsletterCopy(normalizedEmail, normalizedSource, deliveryChannel);
  } catch {
    // Subscription already succeeded through at least one channel.
  }

  return {
    ok: true,
    deliveryChannel,
    copySent,
    delivered: deliveryChannel !== "local",
  };
}
