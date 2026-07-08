
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";

import Navbar from "../components/Navbar";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { skillOptions } from "../constants/skillOptions";

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    bio: z.string().optional(),
    location: z.string().optional(),
    skillsOffered: z.union([z.string(), z.array(z.string())]).optional(),
    skillsWanted: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      skillsOffered: [],
      skillsWanted: [],
    },
  });

  const selectedOfferedSkills = watch("skillsOffered") || [];
  const selectedWantedSkills = watch("skillsWanted") || [];

  const toggleSkill = (field, skill) => {
    const currentSkills = watch(field) || [];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter((item) => item !== skill)
      : [...currentSkills, skill];

    setValue(field, updatedSkills, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      setServerError("");

      const normalizeSkills = (value) => {
        if (!value) return [];
        if (Array.isArray(value)) {
          return value.filter(Boolean).map((skill) => skill.trim());
        }
        return value
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      };

      const payload = {
        ...values,
        skillsOffered: normalizeSkills(values.skillsOffered),
        skillsWanted: normalizeSkills(values.skillsWanted),
      };

      delete payload.confirmPassword;

      const data = await registerUser(payload);

      login(data.user, data.token);

      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8">

          <h1 className="text-3xl font-bold text-center">
            Create Account
          </h1>

          <p className="text-center text-gray-500 mt-2">
            Join SkillSwap and start learning today.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-5 mt-8"
          >
            <div>
              <label>Name</label>
              <input
                {...register("name")}
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="Full Name"
              />
              <p className="text-red-500 text-sm">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label>Username</label>
              <input
                {...register("username")}
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="Username"
              />
              <p className="text-red-500 text-sm">
                {errors.username?.message}
              </p>
            </div>

            <div>
              <label>Email</label>
              <input
                {...register("email")}
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="Email Address"
              />
              <p className="text-red-500 text-sm">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label>Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full border rounded-xl px-4 py-3 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.password?.message}
              </p>
            </div>

            <div>
              <label>Confirm Password</label>

              <div className="relative mt-2">
                <input
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  {...register("confirmPassword")}
                  className="w-full border rounded-xl px-4 py-3 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <div className="md:col-span-2">
              <label>Bio</label>
              <textarea
                {...register("bio")}
                rows="3"
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label>Location</label>
              <input
                {...register("location")}
                className="w-full mt-2 border rounded-xl px-4 py-3"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label>Skills Offered</label>
              <div className="mt-2 grid grid-cols-2 gap-2 border rounded-xl p-3">
                {skillOptions.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOfferedSkills.includes(skill)}
                      onChange={() => toggleSkill("skillsOffered", skill)}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label>Skills Wanted</label>
              <div className="mt-2 grid grid-cols-2 gap-2 border rounded-xl p-3">
                {skillOptions.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedWantedSkills.includes(skill)}
                      onChange={() => toggleSkill("skillsWanted", skill)}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {serverError && (
              <div className="md:col-span-2 bg-red-100 text-red-600 p-3 rounded-lg">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60"
            >
              <UserPlus size={20} />
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Register;
