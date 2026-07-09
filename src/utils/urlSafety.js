const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function sanitizeExternalUrl(rawUrl) {
  const text = String(rawUrl || "").trim();
  if (!text) {
    return "";
  }

  try {
    const parsed = new URL(text, "https://example.invalid");

    if (parsed.origin === "https://example.invalid" && !/^\//.test(text)) {
      return "";
    }

    if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
      return "";
    }

    return text;
  } catch {
    return "";
  }
}

export function isSafeExternalUrl(rawUrl) {
  return Boolean(sanitizeExternalUrl(rawUrl));
}
