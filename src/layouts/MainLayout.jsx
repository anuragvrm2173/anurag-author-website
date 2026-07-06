import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>

      <footer>Footer</footer>
    </>
  );
}

export default MainLayout;