type NotifyPayload = {
  name?: string;
  email?: string;
  message?: string;
  subject?: string;
  _subject?: string;
  turnstileToken?: string;
  "cf-turnstile-response"?: string;
};

const BASE_HEADERS = {
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  Vary: "Origin",
};

function getAllowedOrigins(): string[] {
  const configured = String(Deno.env.get("ADMIN_NOTIFY_ALLOWED_ORIGINS") || "").trim();
  if (!configured) {
    return [];
  }

  return configured.split(",").map((item) => item.trim()).filter(Boolean);
}

function resolveCorsOrigin(origin: string | null): string {
  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.length === 0) {
    return origin || "*";
  }

  if (origin && allowedOrigins.includes(origin)) {
    return origin;
  }

  return "";
}

function jsonResponse(status: number, body: Record<string, unknown>, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...BASE_HEADERS,
      "Access-Control-Allow-Origin": origin,
      "Content-Type": "application/json",
    },
  });
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

async function verifyTurnstileToken(token: string, remoteIp: string) {
  const secret = normalizeText(Deno.env.get("TURNSTILE_SECRET_KEY"));
  if (!secret) {
    return;
  }

  const formData = new URLSearchParams();
  formData.set("secret", secret);
  formData.set("response", token);
  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Turnstile verification request failed");
  }

  const verification = await response.json();
  if (!verification?.success) {
    throw new Error("Turnstile verification failed");
  }
}

async function sendAdminEmail(payload: NotifyPayload) {
  const resendApiKey = normalizeText(Deno.env.get("RESEND_API_KEY"));
  const toEmail = normalizeText(Deno.env.get("ADMIN_NOTIFY_TO_EMAIL"));
  const fromEmail = normalizeText(Deno.env.get("ADMIN_NOTIFY_FROM_EMAIL"))
    || "Website Notifications <onboarding@resend.dev>";

  if (!resendApiKey || !toEmail) {
    throw new Error("RESEND_API_KEY and ADMIN_NOTIFY_TO_EMAIL are required");
  }

  const subject = normalizeText(payload._subject || payload.subject) || "Website Notification";
  const name = normalizeText(payload.name) || "Website Visitor";
  const email = normalizeText(payload.email) || "no-reply@website.local";
  const message = normalizeText(payload.message);

  if (!message) {
    throw new Error("Message is required");
  }

  const textBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text: textBody,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend request failed: ${details}`);
  }

  return response.json();
}

Deno.serve(async (request) => {
  const origin = resolveCorsOrigin(request.headers.get("origin"));

  if (!origin) {
    return jsonResponse(403, { ok: false, error: "Origin not allowed" }, "null");
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        ...BASE_HEADERS,
        "Access-Control-Allow-Origin": origin,
      },
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed" }, origin);
  }

  try {
    const payload = await request.json() as NotifyPayload;
    const turnstileToken = normalizeText(payload.turnstileToken || payload["cf-turnstile-response"]);
    const turnstileSecretConfigured = Boolean(normalizeText(Deno.env.get("TURNSTILE_SECRET_KEY")));

    if (turnstileSecretConfigured && !turnstileToken) {
      return jsonResponse(400, { ok: false, error: "Missing Turnstile token" }, origin);
    }

    if (turnstileToken) {
      const remoteIp = normalizeText(request.headers.get("x-forwarded-for")).split(",")[0]?.trim() || "";
      await verifyTurnstileToken(turnstileToken, remoteIp);
    }

    const sendResult = await sendAdminEmail(payload);

    return jsonResponse(200, {
      ok: true,
      provider: "resend",
      id: sendResult?.id || null,
    }, origin);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Notification failed";
    return jsonResponse(500, { ok: false, error: message }, origin);
  }
});