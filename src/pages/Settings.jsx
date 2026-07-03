import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("merkato_access_token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setFirstName(data.user.firstName || "");
          setLastName(data.user.lastName || "");
        } else {
          navigate("/login");
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError("Image must be under 3MB");
      return;
    }

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      if (firstName) formData.append("firstName", firstName);
      if (lastName) formData.append("lastName", lastName);
      if (avatar) formData.append("avatar", avatar);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/profile`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setLoading(false);
        return;
      }

      const currentUser = JSON.parse(
        localStorage.getItem("merkato_current_user"),
      );
      localStorage.setItem(
        "merkato_current_user",
        JSON.stringify({ ...currentUser, ...data.user }),
      );

      setUser(data.user);
      setSuccess(data.message);
      setAvatar(null);
      setPreview("");
      window.dispatchEvent(new Event("user-updated"));
      setTimeout(() => navigate("/"), 1500);
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[85vh]">
        <span className="w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const avatarSrc = preview
    ? preview
    : user?.avatar
      ? `${import.meta.env.VITE_API_URL}${user.avatar}`
      : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-100/70">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black tracking-tight text-gray-900">
            Profile Settings
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Update your personal information and photo
          </p>
        </div>

        {error && (
          <div className="p-4 mb-5 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-2xl">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-5 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-2xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <label
              htmlFor="avatarInput"
              className="cursor-pointer group relative"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-orange-500 text-white text-3xl font-bold flex items-center justify-center border-4 border-orange-500 group-hover:opacity-80 transition-opacity">
                  {(firstName || "U")[0].toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">Change</span>
              </div>
            </label>
            <input
              id="avatarInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <span className="text-xs text-gray-400">
              JPG, PNG or WebP. Max 3MB.
            </span>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (error) setError("");
              }}
              className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50"
              placeholder="Last Name"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-3 text-sm text-gray-400 border border-gray-200 rounded-2xl bg-gray-100 cursor-not-allowed"
            />
            <span className="text-xs text-gray-400 mt-1 block">
              Email cannot be changed
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 text-sm font-bold text-white bg-orange-500 rounded-2xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex justify-center items-center"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
