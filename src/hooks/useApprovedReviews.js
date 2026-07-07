import { useEffect, useState } from "react";
import { fetchApprovedReviews } from "../services/reviewsService";

function useApprovedReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const items = await fetchApprovedReviews();
      setReviews(items);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadInitialReviews = async () => {
      try {
        const items = await fetchApprovedReviews();
        if (!isActive) {
          return;
        }
        setReviews(items);
        setError(null);
      } catch (err) {
        if (!isActive) {
          return;
        }
        setError(err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadInitialReviews();

    return () => {
      isActive = false;
    };
  }, []);

  return { reviews, loading, error, refresh };
}

export default useApprovedReviews;
