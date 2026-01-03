import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({ key, password }) => {
    if (!key || !password) {
      toast.error("Please provide both username/email and password.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to log in");
      }

      const data = await res.json();
      localStorage.setItem("authUser", JSON.stringify(data));
      setAuthUser(data);
      toast.success(`Welcome back, ${data.username || data.email}!`);
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;
