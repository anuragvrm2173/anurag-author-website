const PROVIDER = (import.meta.env.VITE_NEWSLETTER_PROVIDER || "").toLowerCase();
const PROXY_ENDPOINT = import.meta.env.VITE_NEWSLETTER_PROXY_ENDPOINT;

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
  const list = JSON.parse(window.localStorage.getItem("newsletter_signups") || "[]");
  list.push({ email, source, signupDate: new Date().toISOString() });
  window.localStorage.setItem("newsletter_signups", JSON.stringify(list));
}

export async function subscribeToNewsletter(email, source) {
  if (PROXY_ENDPOINT) {
    await subscribeThroughProxy(email, source);
    return;
  }

  if (PROVIDER === "convertkit") {
    await subscribeConvertKit(email, source);
    return;
  }

  if (PROVIDER === "mailerlite") {
    await subscribeMailerLite(email, source);
    return;
  }

  if (PROVIDER === "brevo") {
    await subscribeBrevo(email, source);
    return;
  }

  storeSignupLocally(email, source);
}
