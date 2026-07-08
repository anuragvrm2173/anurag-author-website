import "./Admin.css";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import { adminAllowedEmail, getMissingSupabaseEnvVars, hasSupabase } from "../../services/supabaseClient";
import {
  getCurrentAdminSession,
  requestAdminPasswordOtp,
  resetAdminPasswordWithRecoverySession,
  signInAdmin,
  verifyAdminOtpAndResetPassword,
} from "../../services/adminService";

const OTP_COOLDOWN_SECONDS = 60;

function parseWaitSeconds(message) {
  const text = String(message || "");
  const match = text.match(/(\d+)\s*(second|sec|minute|min)/i);
  if (!match) {
    return 0;
  }

  const value = Number(match[1] || 0);
  if (!value) {
    return 0;
  }

  return /minute|min/i.test(match[2]) ? value * 60 : value;
}

function normalizeUiErrorMessage(error, fallback) {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    const text = error.trim();
    return text && text !== "{}" ? text : fallback;
  }

  if (error instanceof Error) {
    const text = String(error.message || "").trim();
    return text && text !== "{}" ? text : fallback;
  }

  const message = String(error.message || error.error_description || error.msg || "").trim();
  if (message && message !== "{}" && message !== "[object Object]") {
    return message;
  }

  return fallback;
}

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(adminAllowedEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState(adminAllowedEmail);
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldownUntil, setOtpCooldownUntil] = useState(0);
  const [otpSecondsLeft, setOtpSecondsLeft] = useState(0);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const missingEnvVars = getMissingSupabaseEnvVars();
  const supabaseConfigured = hasSupabase();
  const searchParams = new URLSearchParams(location.search || "");
  const hashParams = new URLSearchParams((location.hash || "").replace(/^#/, ""));
  const isRecoveryLinkMode = searchParams.get("type") === "recovery" || hashParams.get("type") === "recovery";

  useEffect(() => {
    let active = true;
    getCurrentAdminSession().then((session) => {
      if (active && session.authorized && !isRecoveryLinkMode) {
        navigate(location.state?.from || "/admin", { replace: true });
      }
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, [isRecoveryLinkMode, location.state?.from, navigate]);

  useEffect(() => {
    if (isRecoveryLinkMode) {
      setShowForgotPassword(true);
    }
  }, [isRecoveryLinkMode]);

  useEffect(() => {
    if (!otpCooldownUntil) {
      setOtpSecondsLeft(0);
      return undefined;
    }

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((otpCooldownUntil - Date.now()) / 1000));
      setOtpSecondsLeft(remaining);
      if (remaining <= 0) {
        setOtpCooldownUntil(0);
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [otpCooldownUntil]);

  const sendOtp = async (targetEmail) => {
    if (otpSecondsLeft > 0) {
      throw new Error(`Please wait ${otpSecondsLeft}s before requesting another OTP.`);
    }

    const redirectTo = `${window.location.origin}/admin/login`;
    await requestAdminPasswordOtp(targetEmail, { emailRedirectTo: redirectTo });
    setOtpSent(true);
    setOtpCooldownUntil(Date.now() + OTP_COOLDOWN_SECONDS * 1000);
    setResetMessage("Password reset OTP sent to your email. Enter the code and set a new password.");
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Anurag Verma</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="admin-auth">
        <p className="admin-page__eyebrow">Admin Access</p>
        <h1 className="admin-page__title">Sign in to manage your platform</h1>
        <p className="admin-page__description">
          This area is restricted to approved admin accounts. Sign in with the email that has been granted admin access in Supabase.
        </p>

        <form
          className="admin-form"
          onSubmit={async (event) => {
            event.preventDefault();
            setLoading(true);
            setError("");
            try {
              await signInAdmin(email, password);
              navigate(location.state?.from || "/admin", { replace: true });
            } catch (nextError) {
              setError(normalizeUiErrorMessage(nextError, "Unable to sign in."));
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="admin-form__field">
            <label htmlFor="admin-email">Admin email</label>
            <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div className="admin-form__field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-password-field">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {!supabaseConfigured && location.state?.reason === "missing-supabase" ? (
            <p className="admin-auth__error">
              Supabase is not configured yet. Missing env vars: {missingEnvVars.length ? missingEnvVars.join(", ") : "VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY"}.
            </p>
          ) : null}
          {error ? <p className="admin-auth__error">{error}</p> : null}
          {resetMessage && !showForgotPassword ? <p className="admin-meta-note">{resetMessage}</p> : null}

          <div className="admin-form__actions">
            <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</Button>
            <button
              type="button"
              className="admin-link-button"
              onClick={() => {
                setShowForgotPassword((current) => !current);
                setError("");
                setResetMessage("");
                setResetOtp("");
                setResetPassword("");
                setResetConfirmPassword("");
                setOtpSent(false);
                setOtpCooldownUntil(0);
              }}
            >
              {showForgotPassword ? "Close Reset" : "Forgot Password"}
            </button>
            <Link to="/" className="admin-link-button">Back to site</Link>
          </div>
        </form>

        {showForgotPassword ? (
          <form
            className="admin-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setResetLoading(true);
              setError("");
              setResetMessage("");

              try {
                if (isRecoveryLinkMode) {
                  if (resetPassword.length < 8) {
                    setError("Password must be at least 8 characters.");
                    return;
                  }

                  if (resetPassword !== resetConfirmPassword) {
                    setError("Password confirmation does not match.");
                    return;
                  }

                  await resetAdminPasswordWithRecoverySession(resetPassword);
                  setResetOtp("");
                  setResetPassword("");
                  setResetConfirmPassword("");
                  setPassword("");
                  setOtpSent(false);
                  setOtpCooldownUntil(0);
                  setShowForgotPassword(false);
                  setResetMessage("Password reset successful. Sign in with your new password.");
                  return;
                }

                if (!otpSent) {
                  await sendOtp(resetEmail);
                  return;
                }

                if (resetPassword.length < 8) {
                  setError("Password must be at least 8 characters.");
                  return;
                }

                if (resetPassword !== resetConfirmPassword) {
                  setError("Password confirmation does not match.");
                  return;
                }

                await verifyAdminOtpAndResetPassword(resetEmail, resetOtp, resetPassword);
                setResetOtp("");
                setResetPassword("");
                setResetConfirmPassword("");
                setPassword("");
                setOtpSent(false);
                setOtpCooldownUntil(0);
                setShowForgotPassword(false);
                setResetMessage("Password reset successful. Sign in with your new password.");
              } catch (nextError) {
                const message = normalizeUiErrorMessage(nextError, "Unable to reset password.");
                const waitSeconds = parseWaitSeconds(message);
                if (waitSeconds > 0) {
                  setOtpCooldownUntil(Date.now() + waitSeconds * 1000);
                }
                setError(message);
              } finally {
                setResetLoading(false);
              }
            }}
          >
            {!isRecoveryLinkMode ? (
              <div className="admin-form__field">
                <label htmlFor="admin-reset-email">Admin email</label>
                <input
                  id="admin-reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  required
                />
              </div>
            ) : null}

            {otpSent || isRecoveryLinkMode ? (
              <>
                {!isRecoveryLinkMode ? (
                  <div className="admin-form__field">
                    <label htmlFor="admin-reset-otp">OTP</label>
                    <input
                      id="admin-reset-otp"
                      type="text"
                      inputMode="numeric"
                      value={resetOtp}
                      onChange={(event) => setResetOtp(event.target.value)}
                      placeholder="Enter reset OTP code"
                      required
                    />
                  </div>
                ) : null}

                <div className="admin-form__field">
                  <label htmlFor="admin-reset-password">New Password</label>
                  <div className="admin-password-field">
                    <input
                      id="admin-reset-password"
                      type={showResetPassword ? "text" : "password"}
                      value={resetPassword}
                      onChange={(event) => setResetPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowResetPassword((current) => !current)}
                      aria-label={showResetPassword ? "Hide password" : "Show password"}
                      aria-pressed={showResetPassword}
                    >
                      {showResetPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="admin-form__field">
                  <label htmlFor="admin-reset-confirm-password">Confirm Password</label>
                  <div className="admin-password-field">
                    <input
                      id="admin-reset-confirm-password"
                      type={showResetConfirmPassword ? "text" : "password"}
                      value={resetConfirmPassword}
                      onChange={(event) => setResetConfirmPassword(event.target.value)}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="admin-password-toggle"
                      onClick={() => setShowResetConfirmPassword((current) => !current)}
                      aria-label={showResetConfirmPassword ? "Hide password" : "Show password"}
                      aria-pressed={showResetConfirmPassword}
                    >
                      {showResetConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            {resetMessage ? <p className="admin-meta-note">{resetMessage}</p> : null}

            <div className="admin-form__actions">
              <Button type="submit" disabled={resetLoading}>
                {resetLoading ? "Processing…" : isRecoveryLinkMode ? "Set New Password" : otpSent ? "Verify OTP & Reset" : "Send OTP"}
              </Button>
              {otpSent && !isRecoveryLinkMode ? (
                <button
                  type="button"
                  className="admin-link-button"
                  disabled={resetLoading || otpSecondsLeft > 0}
                  onClick={async () => {
                    setResetLoading(true);
                    setError("");
                    setResetMessage("");

                    try {
                      await sendOtp(resetEmail);
                    } catch (nextError) {
                      const message = normalizeUiErrorMessage(nextError, "Unable to send OTP.");
                      const waitSeconds = parseWaitSeconds(message);
                      if (waitSeconds > 0) {
                        setOtpCooldownUntil(Date.now() + waitSeconds * 1000);
                      }
                      setError(message);
                    } finally {
                      setResetLoading(false);
                    }
                  }}
                >
                  {otpSecondsLeft > 0 ? `Resend in ${otpSecondsLeft}s` : "Resend OTP"}
                </button>
              ) : null}
            </div>

            {isRecoveryLinkMode ? (
              <p className="admin-meta-note">
                Recovery link detected. You can set a new password directly from this screen.
              </p>
            ) : null}
          </form>
        ) : null}
      </div>
    </>
  );
}

export default AdminLogin;