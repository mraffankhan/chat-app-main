import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();
  const signup = async ({
    fullName,
    username,
    email,
    password,
    confirmPassword,
    gender,
  }) => {
    const success = handleSignupError({
      fullName,
      username,
      email,
      password,
      confirmPassword,
      gender,
    });
    if (!success) return;

    setLoading(true);

    // Create a promise to handle the signup process
    const signupPromise = () =>
      new Promise(async (resolve, reject) => {
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fullName,
              username,
              email,
              password,
              confirmPassword,
              gender,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            reject(new Error(errorData.message || "Signup failed"));
          } else {
            const data = await res.json();
            localStorage.setItem("authUser", JSON.stringify(data));
            setAuthUser(data);
            resolve(data);
          }
        } catch (error) {
          reject(new Error(error.message || "An unexpected error occurred"));
        } finally {
          setLoading(false);
        }
      });

    toast.promise(signupPromise, {
      loading: "Signing up...",
      success: (data) => `Signup successful! Welcome, ${data.username}!`,
      error: (error) => error.message,
    });
  };

  return { loading, signup };
};

const handleSignupError = ({
  fullName,
  username,
  email,
  password,
  confirmPassword,
  gender,
}) => {
  if (
    !fullName ||
    !username ||
    !email ||
    !password ||
    !confirmPassword ||
    !gender
  ) {
    toast.error("All fields are required");
    return false;
  }
  if (password !== confirmPassword) {
    toast.error("Password and Confirm Password must be the same");
    return false;
  }
  if (password.length < 8) {
    toast.error("Password must be at least 8 characters long");
    return false;
  }
  return true;
};

export default useSignup;
