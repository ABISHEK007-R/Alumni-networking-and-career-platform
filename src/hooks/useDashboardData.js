import { useEffect, useState } from "react";
import api from "../api/client";

const defaultSummary = { alumniCount: 0, mentorCount: 0, internshipCount: 0, referralCount: 0 };

const useDashboardData = () => {
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadSummary = async () => {
      try {
        const response = await api.get("/dashboard");
        if (mounted) {
          setSummary(response.data || defaultSummary);
          setError("");
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.message || "Unable to load dashboard data.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const refreshOnReturn = () => {
      if (document.visibilityState === "visible") {
        loadSummary();
      }
    };

    loadSummary();
    window.addEventListener("focus", refreshOnReturn);
    document.addEventListener("visibilitychange", refreshOnReturn);

    return () => {
      mounted = false;
      window.removeEventListener("focus", refreshOnReturn);
      document.removeEventListener("visibilitychange", refreshOnReturn);
    };
  }, []);

  return { summary, loading, error };
};

export default useDashboardData;
