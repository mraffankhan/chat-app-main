import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useLogin from "@/hooks/useLogin";

function Login({ switchToSignup }) {
  const [form, setForm] = useState({
    key: "",
    password: "",
  });

  const { login, loading } = useLogin();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    login(form); // Call the login function with the form data
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-center">
          Login with credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Input
          type="text"
          name="key"
          value={form.key}
          onChange={handleInputChange}
          placeholder="Email or Username"
        />
        <Input
          type="password"
          name="password"
          value={form.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <div>
          <h1 className="text-xs opacity-60 mt-4">
            Don't have an account?
            <span
              onClick={switchToSignup}
              className="ml-1 hover:text-blue-400 cursor-pointer"
            >
              Sign Up
            </span>
          </h1>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          className="w-[40%] mx-auto"
          onClick={handleSubmit}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
