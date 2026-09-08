import { useEffect, useState } from "react";
import api from "../api/client";

const useAuthUser = () => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("currentUser") || localStorage.getItem("alumniUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me");
        if (mounted) {
          const nextUser = response.data;
          setUser(nextUser);
          localStorage.setItem("currentUser", JSON.stringify(nextUser));
          localStorage.setItem("alumniUser", JSON.stringify(nextUser));
          setError("");
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.message || "Unable to load your profile.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading, error };
};

export default useAuthUser;
