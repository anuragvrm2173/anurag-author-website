const turnstileSiteKey = String(import.meta.env.VITE_TURNSTILE_SITE_KEY || "").trim();

export function getCaptchaSiteKey() {
  return turnstileSiteKey;
}

export function isCaptchaEnabled() {
  return Boolean(turnstileSiteKey);
}

export function normalizeCaptchaToken(token) {
  return String(token || "").trim();
}

export function assertCaptchaToken(token) {
  if (!isCaptchaEnabled()) {
    return;
  }

  if (!normalizeCaptchaToken(token)) {
    throw new Error("Please complete the security check before submitting.");
  }
}

export function getCaptchaHelperText() {
  if (!isCaptchaEnabled()) {
    return "";
  }

  return "Complete the security check to continue.";
}
