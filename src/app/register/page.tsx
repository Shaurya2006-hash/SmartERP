"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Registration Successful");
        router.push("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="border p-6 rounded w-[400px]">
        <h1 className="text-2xl font-bold mb-4">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="border w-full p-2 mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="bg-green-600 text-white p-2 w-full"
        >
          Register
        </button>
      </div>
    </div>
  );
}