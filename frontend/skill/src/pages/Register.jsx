
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus, Camera, Plus, Trash2, X, Upload } from "lucide-react";

import Navbar from "../components/Navbar";
import { registerUser } from "../services/authService";
import { uploadProfileImage } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import { skillOptions } from "../constants/skillOptions";

import dp1 from "../assets/dp1.png";
import dp2 from "../assets/dp2.png";
import dp3 from "../assets/dp3.png";
import dp4 from "../assets/dp4.png";
import dp5 from "../assets/dp5.png";
import dp6 from "../assets/dp6.png";

const defaultAvatars = [dp1, dp2, dp3, dp4, dp5, dp6];

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
    gender: z.string().optional(),
    skillsOffered: z.union([z.string(), z.array(z.string())]).optional(),
    skillsWanted: z.union([z.string(), z.array(z.string())]).optional(),
    socialLinks: z.array(
      z.object({
        platform: z.string(),
        url: z.string().url("Must be a valid URL").or(z.literal("")),
      })
    ).optional(),
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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      skillsOffered: [],
      skillsWanted: [],
      socialLinks: [],
    },
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: "socialLinks",
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

  const handleDefaultPicSelect = async (picUrl) => {
    try {
      setImagePreview(picUrl);
      const response = await fetch(picUrl);
      const blob = await response.blob();
      const file = new File([blob], "default_dp.png", { type: "image/png" });
      setProfileImageFile(file);
    } catch (e) {
      console.error("Failed to load default pic", e);
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
        socialLinks: values.socialLinks?.filter((link) => link.url.trim() !== "") || [],
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

      <div className="min-h-screen flex dark-bento-page">
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-12 relative z-10 py-12 lg:py-24 overflow-y-auto">
          <div className="w-full max-w-2xl">

            <div className="mb-10 text-center lg:text-left">
              <Link to="/" className="inline-flex lg:flex items-center gap-2 mb-6 lg:mb-8">
                <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text font-bold text-xl">SkillSwap</span>
              </Link>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">
                Create Account
              </h1>
              <p className="text-gray-400 text-lg">
                Join SkillSwap and start learning today.
              </p>
            </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-5 mt-8"
          >
            <div className="md:col-span-2 flex flex-col items-center gap-4 mb-2">
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#2F293A] bg-[#1A1625] flex-shrink-0 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={32} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={24} className="text-white" />
                </div>
              </button>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="bg-[#2F293A] hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 px-4 py-2 rounded-xl cursor-pointer transition-colors text-sm font-medium"
              >
                Upload Profile Picture (Optional)
              </button>
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
              <label className="font-medium text-gray-300">Gender</label>
              <div className="mt-2 flex flex-wrap gap-4 md:gap-6">
                {["Male", "Female", "Other", "Not Mentioned"].map((g) => (
                  <label
                    key={g}
                    className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-purple-400 transition-colors"
                  >
                    <input
                      type="radio"
                      value={g}
                      {...register("gender")}
                      className="accent-purple-500"
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
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

            <div className="md:col-span-2">
              <label className="font-medium text-gray-300 block mb-2">Social Media Links (Optional)</label>
              <div className="space-y-3">
                {socialFields.map((field, index) => (
                  <div key={field.id} className="flex flex-col md:flex-row gap-3 items-start">
                    <select
                      {...register(`socialLinks.${index}.platform`)}
                      className="w-full md:w-1/3 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="GitHub">GitHub</option>
                    </select>
                    
                    <div className="flex-1 w-full relative">
                      <input
                        {...register(`socialLinks.${index}.url`)}
                        placeholder="https://..."
                        className="w-full bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      {errors.socialLinks?.[index]?.url && (
                        <p className="text-red-500 text-xs mt-1 absolute -bottom-5">
                          {errors.socialLinks[index].url.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSocial(index)}
                      className="p-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors shrink-0"
                      title="Remove Link"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => appendSocial({ platform: "LinkedIn", url: "" })}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  <Plus size={16} /> Add Social Link
                </button>
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
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-300 disabled:opacity-60 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] hover:-translate-y-0.5 mt-8"
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

        {showAvatarModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#120F17] border border-[#2F293A] rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-6">Choose a Profile Picture</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {defaultAvatars.map((pic, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      handleDefaultPicSelect(pic);
                      setShowAvatarModal(false);
                    }}
                    className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] ${imagePreview === pic ? 'border-purple-500 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-[#2F293A]'}`}
                  >
                    <img src={pic} alt={`Default ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2F293A]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#120F17] text-gray-400">or</span>
                </div>
              </div>
              
              <label className="w-full flex items-center justify-center gap-2 bg-[#1A1625] hover:bg-[#2F293A] border border-[#2F293A] text-white py-3 rounded-xl cursor-pointer transition-colors font-medium">
                <Upload size={18} />
                Upload from Device
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleImageChange(e);
                    setShowAvatarModal(false);
                  }}
                />
              </label>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Animated/Graphic Area */}
        <div className="hidden lg:flex w-1/2 fixed right-0 top-0 bottom-0 bg-[#0B090F] overflow-hidden items-center justify-center border-l border-[#2F293A]">
          {/* Abstract glowing blobs */}
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 text-center max-w-lg px-8">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md bg-white/5 relative">
              <div className="absolute -top-6 -right-6 text-6xl opacity-50">🚀</div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Swap Skills. Grow Together.
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                SkillSwap is the ultimate platform for finding mentors, offering your expertise, and leveling up your career.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-[#1A1625]/50 border border-purple-500/30 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl mb-2">🤝</div>
                  <div className="text-white font-medium">Connect</div>
                </div>
                <div className="bg-[#1A1625]/50 border border-pink-500/30 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-white font-medium">Learn</div>
                </div>
                <div className="bg-[#1A1625]/50 border border-indigo-500/30 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl mb-2">🎓</div>
                  <div className="text-white font-medium">Teach</div>
                </div>
                <div className="bg-[#1A1625]/50 border border-blue-500/30 p-4 rounded-xl backdrop-blur-sm">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-white font-medium">Achieve</div>
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

export default Register;
