import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://kanbanboard-mt64.onrender.com/api/auth/register", {
        email,
        password,
      });
      toast.success("✅ Registered! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10 text-center animate-fade-in">
        <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">
          Sign Up
        </h2>
        <p className="text-white/70 mb-8 text-sm">
          🚀 Join the productivity revolution. Let’s build something brilliant.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-5 py-3 rounded-xl bg-white/70 text-gray-800 placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-5 py-3 rounded-xl bg-white/70 text-gray-800 placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            required
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-white/80 text-sm">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-white underline font-semibold hover:text-pink-200 transition duration-300"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
