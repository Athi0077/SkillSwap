
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

      <div className="min-h-[90vh] flex items-center justify-center bg-slate-100 px-4">

        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

          <h1 className="text-3xl font-bold text-center">
            Welcome Back
          </h1>

          <p className="text-center text-gray-500 mt-2">
            Login to your SkillSwap account
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            <div>
              <label className="font-medium">Email</label>

              <input
                type="email"
                {...register("email")}
                className="w-full mt-2 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium">Password</label>

              <div className="relative mt-2">

                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
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
              <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                {serverError}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition disabled:opacity-60"
            >
              <LogIn size={20} />

              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold"
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
