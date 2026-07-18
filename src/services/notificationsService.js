const ADMIN_EMAIL = "vanuragverma2173@gmail.com";
const EDGE_ENDPOINT = import.meta.env.VITE_ADMIN_NOTIFICATION_ENDPOINT || null;
const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/" + ADMIN_EMAIL;

export async function sendAdminNotification({ subject, name, email, message, captchaToken = "" }) {
  // Prefer the Supabase Edge Function if configured
  if (EDGE_ENDPOINT) {
    try {
      const response = await fetch(EDGE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          name,
          email,
          message,
          turnstileToken: captchaToken || "",
          "cf-turnstile-response": captchaToken || "",
        }),
        keepalive: true,
      });
      if (response.ok) return true;
    } catch {
      // fall through to formsubmit
    }
  }

  // Fallback: formsubmit.co (requires one-time email activation)
  try {
    const response = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name || "Website Notification",
        email: email || "no-reply@website.local",
        message,
        _subject: subject,
        _replyto: email || ADMIN_EMAIL,
        _template: "basic",
      }),
      keepalive: true,
    });

    return response.ok;
  } catch (error) {
    console.error("Admin notification failed", error);
    return false;
  }
}

export async function notifyBuyLinkClick({
  bookTitle,
  editionLabel,
  retailer,
  url,
  source,
}) {
  const message = [
    "A buy link was clicked.",
    "",
    `Book: ${bookTitle || "Unknown"}`,
    `Edition: ${editionLabel || "Unknown"}`,
    `Retailer: ${retailer || "Unknown"}`,
    `Source: ${source || "Unknown"}`,
    `URL: ${url || "Unknown"}`,
    `Time: ${new Date().toISOString()}`,
  ].join("\n");

  return sendAdminNotification({
    subject: "Buy Link Clicked (Website)",
    name: "Buy Link Click",
    email: "no-reply@website.local",
    message,
  });
}

export async function notifyReviewSubmission(payload, queued) {
  const message = [
    "A new review was submitted and is waiting for approval.",
    "",
    `Book ID: ${payload.book_id || "Unknown"}`,
    `Name: ${payload.reviewer_name || "Unknown"}`,
    `Email: ${payload.reviewer_email || "Unknown"}`,
    `Rating: ${payload.rating || "Unknown"}`,
    `Source: ${payload.source || "Unknown"}`,
    `Queued locally: ${queued ? "Yes" : "No"}`,
    "",
    "Review:",
    payload.quote || "",
  ].join("\n");

  return sendAdminNotification({
    subject: "New Review Pending Approval",
    name: payload.reviewer_name || "Reader",
    email: payload.reviewer_email || "no-email@example.com",
    message,
  });
}