
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, Camera } from "lucide-react";

import Navbar from "../components/Navbar";
import { registerUser } from "../services/authService";
import { uploadProfileImage } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { skillOptions } from "../constants/skillOptions";

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    username: z.string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-z0-9]+$/, "Username can only contain lowercase letters and numbers")
      .refine((val) => (val.match(/[0-9]/g) || []).length === 3, "Username must contain exactly 3 numbers"),
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
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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

      if (profileImageFile) {
        try {
          const formData = new FormData();
          formData.append("image", profileImageFile);
          await uploadProfileImage(formData);
        } catch (imgError) {
          console.error("Failed to upload profile picture:", imgError);
        }
      }

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

      <div className="min-h-screen dark-bento-page flex items-center justify-center px-4 py-10">
        <div className="glow-card-wrapper bg-[#120F17] w-full max-w-2xl rounded-2xl shadow-xl p-8 relative z-10">

          <h1 className="text-3xl font-bold text-center text-white">
            Create Account
          </h1>

          <p className="text-center text-gray-400 mt-2">
            Join SkillSwap and start learning today.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-5 mt-8"
          >
            <div className="md:col-span-2 flex flex-col items-center gap-4 mb-2">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#2F293A] bg-[#1A1625] flex-shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-gray-500" />
                )}
              </div>
              <label className="bg-[#2F293A] hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 px-4 py-2 rounded-xl cursor-pointer transition-colors text-sm font-medium">
                Upload Profile Picture (Optional)
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div>
              <label className="font-medium text-gray-300">Name</label>
              <input
                {...register("name")}
                className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Full Name"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-300">Username</label>
              <input
                {...register("username")}
                className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Username"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.username?.message}
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-300">Email</label>
              <input
                {...register("email")}
                className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Email Address"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-300">Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-300">Confirm Password</label>

              <div className="relative mt-2">
                <input
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  {...register("confirmPassword")}
                  className="w-full bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <div>
              <label className="font-medium text-gray-300">Location</label>
              <input
                {...register("location")}
                className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="City, Country"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-medium text-gray-300">Bio</label>
              <textarea
                {...register("bio")}
                rows="3"
                className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Tell us about yourself..."
              />
            </div>


            <div className="md:col-span-2">
              <label className="font-medium text-gray-300">Skills Offered</label>
              <div className="mt-2 grid grid-cols-2 gap-2 border border-[#2F293A] rounded-xl p-3 bg-[#1A1625] max-h-60 overflow-y-auto">
                {skillOptions.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-purple-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOfferedSkills.includes(skill)}
                      onChange={() => toggleSkill("skillsOffered", skill)}
                      className="accent-purple-500"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="font-medium text-gray-300">Skills Wanted</label>
              <div className="mt-2 grid grid-cols-2 gap-2 border border-[#2F293A] rounded-xl p-3 bg-[#1A1625] max-h-60 overflow-y-auto">
                {skillOptions.map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-purple-400 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedWantedSkills.includes(skill)}
                      onChange={() => toggleSkill("skillsWanted", skill)}
                      className="accent-purple-500"
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
            </div>

            {serverError && (
              <div className="md:col-span-2 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 disabled:opacity-60 shadow-md transition-colors mt-2"
            >
              <UserPlus size={20} />
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
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
