
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Camera, Trash2, Plus } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-hot-toast";

import {
  getMyProfile,
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
} from "../services/userService";
import { skillOptions } from "../constants/skillOptions";

const profileSchema = z.object({
  name: z.string().min(3, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skillsOffered: z.union([z.string(), z.array(z.string())]).optional(),
  skillsWanted: z.union([z.string(), z.array(z.string())]).optional(),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string().url("Must be a valid URL").or(z.literal("")),
    })
  ).optional(),
});

function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfileImage(res.user.profileImage || "");

      reset({
        name: res.user.name,
        username: res.user.username || "",
        bio: res.user.bio || "",
        location: res.user.location || "",
        skillsOffered: res.user.skillsOffered || [],
        skillsWanted: res.user.skillsWanted || [],
        socialLinks: res.user.socialLinks || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadProfileImage(formData);
      if (res.success) {
        setProfileImage(res.user.profileImage);
        toast.success("Profile image updated");
      }
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async () => {
    try {
      setUploadingImage(true);
      await deleteProfileImage();
      setProfileImage("");
      toast.success("Profile image removed");
    } catch (error) {
      toast.error(error.message || "Failed to remove image");
    } finally {
      setUploadingImage(false);
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
        socialLinks: values.socialLinks?.filter((link) => link.url.trim() !== "") || [],
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

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 bg-[#1A1625] p-6 rounded-2xl border border-[#2F293A]">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#2F293A] flex-shrink-0 bg-[#120F17]">
                {uploadingImage ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <img
                    src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(watch("name") || "User")}&background=3B82F6&color=fff`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-2 font-medium">
                  <Camera size={18} />
                  <span>Upload New Picture</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
                
                {profileImage && (
                  <button
                    type="button"
                    onClick={handleImageDelete}
                    disabled={uploadingImage}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Trash2 size={18} />
                    <span>Remove Picture</span>
                  </button>
                )}
              </div>
            </div>

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

              <div>
                <label className="font-medium text-gray-300">
                  Skills Wanted
                </label>

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

              <div>
                <label className="font-medium text-gray-300 block mb-2">
                  Social Media Links
                </label>
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
