
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

      <div className="min-h-[90vh] flex items-center justify-center dark-bento-page px-4">

        <div className="glow-card-wrapper bg-[#120F17] w-full max-w-md rounded-2xl shadow-xl p-8 relative z-10">

          <h1 className="text-3xl font-bold text-center text-white">
            Welcome Back
          </h1>

          <p className="text-center text-gray-400 mt-2">
            Login to your SkillSwap account
          </p>

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
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition disabled:opacity-60 shadow-md"
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
    </>
  );
}

export default Login;
