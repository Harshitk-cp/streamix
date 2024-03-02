"use client";
import loginUser from "@/app/api/auth/login";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const onLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are necessary!");
      return;
    }

    const userData = {
      email: email,
      password: password,
    };

    const res = await loginUser(JSON.stringify(userData));

    if (res.success) {
      console.log("success");
      setError("");

      router.push("/dashboard");

      localStorage.setItem("authToken", res.user.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // const form = e.target;
      // form.reset();
    } else {
      console.log("failure");
      setError(res.error);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="bg-gray-800 shadow-lg p-10 rounded-lg border-t-4 border-purple-400">
        <form className="flex flex-col" onSubmit={onLogin}>
          <h2 className="text-white text-2xl font-semibold mb-6">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400"
            >
              Email
            </label>
            <input
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
            Login
          </button>
          <Link
            className="text-sm mt-3 text-right text-gray-400"
            href={"/register"}
          >
            Don't have an account?
            <span className="underline "> Register</span>
          </Link>
          {error && <div className="text-red-500 ">{error}</div>}
        </form>
      </div>
    </div>
  );
}
