import "./Admin.css";

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button/Button";
import { adminAllowedEmail } from "../../services/supabaseClient";
import { getCurrentAdminSession, signInAdmin } from "../../services/adminService";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(adminAllowedEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
            <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          {location.state?.reason === "missing-supabase" ? (
            <p className="admin-auth__error">Supabase is not configured yet. Add the Supabase env vars before using admin login.</p>
          ) : null}
          {error ? <p className="admin-auth__error">{error}</p> : null}

          <div className="admin-form__actions">
            <Button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</Button>
            <Link to="/" className="admin-link-button">Back to site</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminLogin;