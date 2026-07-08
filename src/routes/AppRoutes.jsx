import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import BookDetails from "../pages/BookDetails/BookDetails";
import Library from "../pages/Library/Library";
import Reviews from "../pages/Reviews/Reviews";
import Blog from "../pages/Blog/Blog";
import BlogPost from "../pages/BlogPost/BlogPost";
import Contact from "../pages/Contact/Contact";
import Search from "../pages/Search/Search";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";
import NotFound from "../pages/NotFound/NotFound";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "../pages/Admin/AdminRoute";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminBooks from "../pages/Admin/AdminBooks";
import AdminBlog from "../pages/Admin/AdminBlog";
import AdminReviews from "../pages/Admin/AdminReviews";
import AdminMessages from "../pages/Admin/AdminMessages";
import AdminNewsletter from "../pages/Admin/AdminNewsletter";
import AdminMedia from "../pages/Admin/AdminMedia";
import AdminSettings from "../pages/Admin/AdminSettings";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/:bookId" element={<BookDetails />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:postId" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="books">
            <Route index element={<AdminBooks />} />
            <Route path="new" element={<AdminBooks />} />
            <Route path=":bookId" element={<AdminBooks />} />
          </Route>
          <Route path="blog">
            <Route index element={<AdminBlog />} />
            <Route path="new" element={<AdminBlog />} />
            <Route path=":postId" element={<AdminBlog />} />
          </Route>
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
