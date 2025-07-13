import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://kanbanboard-mt64.onrender.com/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-10 text-center animate-fade-in">
        <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">
          Welcome Back
        </h2>
        <p className="text-white/70 mb-8 text-sm">
          🔐 Login to access your productivity dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
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
            Log In
          </button>
        </form>

        <p className="mt-6 text-white/80 text-sm">
          New here?{" "}
          <Link
            to="/register"
            className="text-white underline font-semibold hover:text-pink-200 transition duration-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
