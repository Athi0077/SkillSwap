
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";

import {
  getMyProfile,
  updateProfile,
} from "../services/userService";
import { skillOptions } from "../constants/skillOptions";

const profileSchema = z.object({
  name: z.string().min(3, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skillsOffered: z.union([z.string(), z.array(z.string())]).optional(),
  skillsWanted: z.union([z.string(), z.array(z.string())]).optional(),
});

function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();

      reset({
        name: res.user.name,
        username: res.user.username || "",
        bio: res.user.bio || "",
        location: res.user.location || "",
        skillsOffered: res.user.skillsOffered || [],
        skillsWanted: res.user.skillsWanted || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      setSaving(true);

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

      await updateProfile(payload);
      toast.success("Profile updated successfully!");

      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen message="Loading profile editor..." />;

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen dark-bento-page">
        <Sidebar />

        <main className="flex-1 p-8">

          <div className="max-w-3xl mx-auto glow-card-wrapper bg-[#120F17] p-8 relative z-10">

            <h1 className="text-3xl font-bold mb-8 text-white">
              Edit Profile
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >

              <div>
                <label className="font-medium text-gray-300">
                  Name
                </label>

                <input
                  {...register("name")}
                  className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />

                <p className="text-red-500 text-sm mt-1">
                  {errors.name?.message}
                </p>
              </div>

              <div>
                <label className="font-medium text-gray-300">
                  Username
                </label>

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
                <label className="font-medium text-gray-300">
                  Bio
                </label>

                <textarea
                  rows={4}
                  {...register("bio")}
                  className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="font-medium text-gray-300">
                  Location
                </label>

                <input
                  {...register("location")}
                  className="w-full mt-2 bg-[#1A1625] border border-[#2F293A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="font-medium text-gray-300">
                  Skills Offered
                </label>

                <div className="mt-2 grid grid-cols-2 gap-2 border border-[#2F293A] rounded-xl p-3 bg-[#1A1625]">
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

              <div>
                <label className="font-medium text-gray-300">
                  Skills Wanted
                </label>

                <div className="mt-2 grid grid-cols-2 gap-2 border border-[#2F293A] rounded-xl p-3 bg-[#1A1625]">
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

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl flex justify-center items-center gap-2 disabled:opacity-60 transition-colors shadow-md mt-4"
              >
                <Save size={20} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

          </div>

        </main>
      </div>
    </>
  );
}

export default EditProfile;
