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
import useSignup from "@/hooks/useSignup";

function Signup({ switchToLogin }) {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { signup } = useSignup();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardDescription className="text-center">
          Create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Input
          type="text"
          name="fullName"
          required
          value={form.fullName}
          onChange={handleInputChange}
          placeholder="Full Name"
        />
        <Input
          type="text"
          name="username"
          required
          value={form.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
        <Input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleInputChange}
          placeholder="email@domain.com"
        />
        <Input
          type="password"
          name="password"
          required
          value={form.password}
          onChange={handleInputChange}
          placeholder="Password"
        />
        <Input
          type="password"
          name="confirmPassword"
          required
          value={form.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm Password"
        />
        <div className="flex gap-4 mt-4 mx-auto">
          <label className="flex items-center px-4 py-2 border-2 rounded-xl cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleInputChange}
              className="mr-2"
            />
            Male
          </label>
          <label className="flex items-center px-4 py-2 border-2 rounded-xl cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleInputChange}
              className="mr-2"
            />
            Female
          </label>
        </div>
        <div>
          <h1 className="text-xs opacity-60 mt-4">
            Already have an account?
            <span
              onClick={switchToLogin}
              className="ml-1 hover:text-blue-400 cursor-pointer"
            >
              Login
            </span>
          </h1>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          className="w-[40%] mx-auto"
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Signup;
