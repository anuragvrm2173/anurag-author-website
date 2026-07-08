import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getCurrentAdminSession, subscribeToAdminAuth } from "../../services/adminService";

function AdminRoute() {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, authorized: false });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const next = await getCurrentAdminSession();
        if (active) {
          setState({ loading: false, ...next });
        }
      } catch (error) {
        if (active) {
          setState({ loading: false, authorized: false, error: error.message });
        }
      }
    }

    load();
    const unsubscribe = subscribeToAdminAuth(load);

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (state.loading) {
    return <div className="admin-auth">Loading admin…</div>;
  }

  if (!state.authorized) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname, reason: state.reason || state.error }} />;
  }

  return <Outlet />;
}

export default AdminRoute;