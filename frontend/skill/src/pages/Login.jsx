
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";

import Navbar from "../components/Navbar";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setServerError("");

      const data = await loginUser(values);

      login(data.user, data.token);

      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[90vh] flex dark-bento-page">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 relative z-10 py-12">
          <div className="w-full max-w-md">
            
            <div className="mb-10">
              <Link to="/" className="flex items-center gap-2 mb-8">
                <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text font-bold text-xl">SkillSwap</span>
              </Link>
              <h1 className="text-4xl font-extrabold text-white mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-lg">
                Log in to continue swapping skills.
              </p>
            </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="font-medium text-gray-300">Email</label>

              <input
                type="email"
                {...register("email")}
                className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium text-gray-300">Password</label>

              <div className="relative mt-2">

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg">
                {serverError}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-300 disabled:opacity-60 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 mt-8"
            >
              <LogIn size={20} />

              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Register
            </Link>
          </p>

          </div>
        </div>

        {/* Right Side: Animated/Graphic Area */}
        <div className="hidden lg:flex w-1/2 relative bg-[#0B090F] overflow-hidden items-center justify-center border-l border-[#2F293A]">
          {/* Abstract glowing blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 text-center max-w-lg px-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md bg-white/5 relative">
              <div className="absolute -top-6 -left-6 text-6xl opacity-50">✨</div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Unlock Your Potential Through Connection
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Join a community of passionate learners and experts. Teach what you know, learn what you don't.
              </p>
              
              <div className="mt-8 flex justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <span className="text-xl">💻</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                  <span className="text-xl">🎸</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <span className="text-xl">🎨</span>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                  <span className="text-xl">🌍</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjMjkyOTM1IiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMSI+PHBhdGggZD0iTTAgNjBoNjBNNjAgMGwwIDYwIi8+PC9nPjwvc3ZnPg==')] pointer-events-none"></div>
        </div>

      </div>
    </>
  );
}

export default Login;
