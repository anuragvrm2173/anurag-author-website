import { useEffect, useState } from "react";

import {
  fetchPublicBlogPosts,
  fetchPublicBooks,
  getFallbackBlogPosts,
  getFallbackBooks,
} from "../services/publicContentService";
import { hasSupabase } from "../services/supabaseClient";

function usePublicContent({ includeBooks = true, includeBlogPosts = true } = {}) {
  const [books, setBooks] = useState(() => (includeBooks ? getFallbackBooks() : []));
  const [blogPosts, setBlogPosts] = useState(() => (includeBlogPosts ? getFallbackBlogPosts() : []));
  const [loading, setLoading] = useState(() => hasSupabase());
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function load() {
      if (!hasSupabase()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [nextBooks, nextBlogPosts] = await Promise.all([
          includeBooks ? fetchPublicBooks() : Promise.resolve([]),
          includeBlogPosts ? fetchPublicBlogPosts() : Promise.resolve([]),
        ]);

        if (!isActive) {
          return;
        }

        if (includeBooks) {
          setBooks(nextBooks);
        }
        if (includeBlogPosts) {
          setBlogPosts(nextBlogPosts);
        }
        setError(null);
      } catch (nextError) {
        if (!isActive) {
          return;
        }

        setError(nextError);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [includeBlogPosts, includeBooks]);

  return { books, blogPosts, loading, error };
}

export default usePublicContent;