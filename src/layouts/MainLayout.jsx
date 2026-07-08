import { Outlet } from "react-router-dom";
import SiteMetadata from "../components/seo/SiteMetadata";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import ScrollToTop from "../components/common/ScrollToTop/ScrollToTop";

function MainLayout() {
  return (
    <>
      <SiteMetadata />
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
