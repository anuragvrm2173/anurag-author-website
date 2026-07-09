import "./CaptchaChallenge.css";

import { useEffect, useMemo, useRef, useState } from "react";

import { getCaptchaHelperText, getCaptchaSiteKey, isCaptchaEnabled } from "../../../services/captchaService";

const SCRIPT_ID = "cloudflare-turnstile-script";

function loadTurnstileScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.turnstile || null), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load security challenge.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.turnstile || null);
    script.onerror = () => reject(new Error("Could not load security challenge."));
    document.head.appendChild(script);
  });
}

function CaptchaChallenge({ onTokenChange, resetCounter = 0, errorMessage = "" }) {
  const [loadError, setLoadError] = useState("");
  const widgetContainerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const siteKey = getCaptchaSiteKey();
  const helperText = useMemo(() => getCaptchaHelperText(), []);

  useEffect(() => {
    if (!isCaptchaEnabled() || !widgetContainerRef.current) {
      return;
    }

    let active = true;

    loadTurnstileScript()
      .then((turnstile) => {
        if (!active || !turnstile || widgetIdRef.current !== null) {
          return;
        }

        widgetIdRef.current = turnstile.render(widgetContainerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            onTokenChange?.(String(token || "").trim());
          },
          "expired-callback": () => {
            onTokenChange?.("");
          },
          "error-callback": () => {
            onTokenChange?.("");
            setLoadError("Security check failed. Please retry.");
          },
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setLoadError(error.message || "Could not load security challenge.");
      });

    return () => {
      active = false;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onTokenChange, siteKey]);

  useEffect(() => {
    if (!isCaptchaEnabled() || !window.turnstile || widgetIdRef.current === null) {
      return;
    }

    window.turnstile.reset(widgetIdRef.current);
    onTokenChange?.("");
  }, [onTokenChange, resetCounter]);

  if (!isCaptchaEnabled()) {
    return null;
  }

  return (
    <div className="captcha-challenge">
      <div ref={widgetContainerRef} className="captcha-challenge__widget" />
      {helperText ? <p className="captcha-challenge__help">{helperText}</p> : null}
      {loadError ? <p className="captcha-challenge__error" role="alert">{loadError}</p> : null}
      {errorMessage ? <p className="captcha-challenge__error" role="alert">{errorMessage}</p> : null}
    </div>
  );
}

export default CaptchaChallenge;
