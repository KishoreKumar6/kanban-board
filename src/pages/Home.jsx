import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-10 text-center max-w-lg border border-white/20 animate-fade-in">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Kanban Board
        </h1>
        <p className="text-lg text-white/80 mb-8">
          ✨ Organize creatively, work efficiently, and design your
          productivity.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white"
        >
          🚀 Let’s Get Started
        </button>
      </div>
    </div>
  );
}
