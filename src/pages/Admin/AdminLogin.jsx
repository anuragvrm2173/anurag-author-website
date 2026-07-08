import "./Admin.css";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import { adminAllowedEmail, getMissingSupabaseEnvVars, hasSupabase } from "../../services/supabaseClient";
import {
  getCurrentAdminSession,
  requestAdminPasswordOtp,
  signInAdmin,
  verifyAdminOtpAndResetPassword,
} from "../../services/adminService";

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
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const missingEnvVars = getMissingSupabaseEnvVars();
  const supabaseConfigured = hasSupabase();

  useEffect(() => {
    let active = true;
    getCurrentAdminSession().then((session) => {
      if (active && session.authorized) {
        navigate(location.state?.from || "/admin", { replace: true });
      }
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, [location.state?.from, navigate]);

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
              setError(nextError.message || "Unable to sign in.");
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
                if (!otpSent) {
                  await requestAdminPasswordOtp(resetEmail);
                  setOtpSent(true);
                  setResetMessage("OTP sent to your email. Enter OTP and set a new password.");
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
                setShowForgotPassword(false);
                setResetMessage("Password reset successful. Sign in with your new password.");
              } catch (nextError) {
                setError(nextError.message || "Unable to reset password.");
              } finally {
                setResetLoading(false);
              }
            }}
          >
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

            {otpSent ? (
              <>
                <div className="admin-form__field">
                  <label htmlFor="admin-reset-otp">OTP</label>
                  <input
                    id="admin-reset-otp"
                    type="text"
                    inputMode="numeric"
                    value={resetOtp}
                    onChange={(event) => setResetOtp(event.target.value)}
                    placeholder="Enter email OTP"
                    required
                  />
                </div>

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
                {resetLoading ? "Processing…" : otpSent ? "Verify OTP & Reset" : "Send OTP"}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </>
  );
}

export default AdminLogin;