"use client";

import registerUser from "@/app/api/auth/register";
import Link from "next/link";
import { useState } from "react";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !userName || !email || !password) {
      setError("All fields are necessary!");
      return;
    }

    const userData = {
      userName: userName,
      email: email,
      password: password,
      profile: {
        firstName: firstName,
        lastName: lastName,
      },
    };

    const res = await registerUser(JSON.stringify(userData));

    if (res.success) {
      setError("");

      const form = e.target;
      form.reset();
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="bg-gray-800 shadow-lg p-10 rounded-lg border-t-4 border-purple-400">
        <form className="flex flex-col" onSubmit={onRegister}>
          <h2 className="text-white text-2xl font-semibold mb-6">Register</h2>
          <div className="mb-4 flex gap-5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-400"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-400"
              >
                Last Name
              </label>
              <input
                type="text"
                name="latName"
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-400"
            >
              Username
            </label>
            <input
              className="w-full"
              type="text"
              name="username"
              required
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400"
            >
              Email
            </label>
            <input
              className="w-full"
              type="email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400"
            >
              Password
            </label>
            <input
              className="w-full"
              type="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-purple-400 text-white px-6 py-2 rounded-md hover:bg-purple-500 transition duration-300 font-bold"
          >
            Create Account
          </button>
          <Link className="text-sm mt-3 text-right text-gray-400" href={"/"}>
            Already have an account?
            <span className="underline ">Login</span>
          </Link>
          {error && <div className="text-red-500 ">{error}</div>}
        </form>
      </div>
    </div>
  );
}
