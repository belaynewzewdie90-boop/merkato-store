import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiUser, FiShield, FiMapPin, FiSettings, FiShoppingBag, FiLock, FiTrash2,
  FiMail, FiPhone, FiCamera, FiSave, FiPlus, FiEdit2, FiX, FiCheck,
  FiChevronRight, FiChevronDown, FiLogOut, FiDownload, FiEye, FiEyeOff,
  FiAlertTriangle, FiCheckCircle, FiClock, FiGlobe, FiSun, FiMoon, FiMonitor,
  FiHome, FiBriefcase, FiTruck, FiCreditCard, FiMenu,
} from "react-icons/fi";
import {
  getProfile, updatePersonalInfo, changeEmail, changeUsername, changePassword,
  deactivateAccount, deleteAccount, addAddress, updateAddress, deleteAddress,
  updatePreferences, updatePrivacy, getLoginHistory, getUserOrders,
  downloadMyData, logoutAllDevices,
} from "../api/api";

const API = import.meta.env.VITE_API_URL || "";

const TABS = [
  { id: "personal", label: "Personal Info", icon: FiUser },
  { id: "account", label: "Account", icon: FiSettings },
  { id: "security", label: "Security", icon: FiShield },
  { id: "addresses", label: "Addresses", icon: FiMapPin },
  { id: "preferences", label: "Preferences", icon: FiGlobe },
  { id: "orders", label: "Order History", icon: FiShoppingBag },
  { id: "privacy", label: "Privacy", icon: FiLock },
];

export default function Settings() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(() => {
    const urlTab = searchParams.get("tab");
    return TABS.find((t) => t.id === urlTab) ? urlTab : "personal";
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setUser(data);
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem("merkato_access_token")) { navigate("/login"); return; }
    loadProfile();
  }, [loadProfile, navigate]);

  const updateUser = (patch) => {
    setUser((prev) => ({ ...prev, ...patch }));
    const stored = JSON.parse(localStorage.getItem("merkato_current_user") || "{}");
    localStorage.setItem("merkato_current_user", JSON.stringify({ ...stored, ...patch }));
    window.dispatchEvent(new Event("user-updated"));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[85vh]">
      <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex items-center justify-between md:hidden">
        <div>
          <span className="text-orange-500 font-bold tracking-wider text-xs uppercase bg-orange-50 px-3 py-1 rounded-full">Settings</span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-2">Account Settings</h2>
        </div>
        <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer">
          <FiMenu size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <aside className={`${mobileNavOpen ? "block" : "hidden"} md:block`}>
          <div className="sticky top-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-4">
              <div className="flex items-center gap-3 mb-4">
                {user?.avatar ? (
                  <img src={`${API}${user.avatar}`} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-orange-500" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg">{(user?.firstName || "U")[0].toUpperCase()}</div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => { setTab(t.id); setSearchParams({ tab: t.id }); setMobileNavOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${tab === t.id ? "bg-orange-50 text-orange-600 border-l-3 border-orange-500" : "text-gray-600 hover:bg-gray-50 border-l-3 border-transparent"}`}>
                  <t.icon size={16} />
                  <span className="hidden md:inline">{t.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main>
          {tab === "personal" && <PersonalInfo user={user} onUpdate={updateUser} onReload={loadProfile} />}
          {tab === "account" && <AccountSettings user={user} onUpdate={updateUser} onNavigate={navigate} onReload={loadProfile} />}
          {tab === "security" && <SecuritySettings user={user} onNavigate={navigate} />}
          {tab === "addresses" && <AddressSettings user={user} onReload={loadProfile} />}
          {tab === "preferences" && <PreferencesSettings user={user} onReload={loadProfile} />}
          {tab === "orders" && <OrderHistory user={user} />}
          {tab === "privacy" && <PrivacySettings user={user} onReload={loadProfile} />}
        </main>
      </div>
    </div>
  );
}

function Toast({ type, message }) {
  if (!message) return null;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold border mb-4 ${type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
      {type === "success" ? <FiCheckCircle size={16} /> : <FiAlertTriangle size={16} />}
      {message}
    </div>
  );
}

function SectionHeader({ title, desc }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
      {desc && <p className="text-sm text-gray-500 mt-1">{desc}</p>}
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50";
const selectCls = "w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50/50 cursor-pointer";
const btnPrimary = "bg-gray-900 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all cursor-pointer inline-flex items-center gap-2";
const btnDanger = "bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all cursor-pointer inline-flex items-center gap-2";

function PersonalInfo({ user, onUpdate, onReload }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", phone: "", dateOfBirth: "", gender: "", bio: "", country: "", city: "", preferredContactMethod: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });

  useEffect(() => {
    if (user) setForm({
      firstName: user.firstName || "", lastName: user.lastName || "", username: user.username || "",
      phone: user.phone || "", dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
      gender: user.gender || "", bio: user.bio || "", country: user.country || "",
      city: user.city || "", preferredContactMethod: user.preferredContactMethod || "email",
    });
  }, [user]);

  const handleAvatar = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) { setToast({ type: "error", msg: "Image must be under 3MB" }); return; }
    setAvatarFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToast({ type: "", msg: "" });
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
      if (avatarFile) fd.append("avatar", avatarFile);
      const res = await updatePersonalInfo(fd);
      onUpdate(res.data);
      setAvatarFile(null);
      setPreview("");
      setToast({ type: "success", msg: "Profile updated successfully" });
    } catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <SectionHeader title="Personal Information" desc="Manage your profile details and public information" />
      <Toast type={toast.type} message={toast.msg} />

      <div className="flex flex-col items-center gap-3 mb-6">
        <label htmlFor="avatarInput" className="cursor-pointer group relative">
          {preview ? <img src={preview} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 group-hover:opacity-80 transition-opacity" />
            : user?.avatar ? <img src={`${API}${user.avatar}`} alt="" className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 group-hover:opacity-80 transition-opacity" />
            : <div className="w-24 h-24 rounded-full bg-orange-500 text-white text-3xl font-bold flex items-center justify-center border-4 border-orange-500 group-hover:opacity-80 transition-opacity">{(form.firstName || "U")[0].toUpperCase()}</div>}
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><FiCamera className="text-white" size={20} /></div>
        </label>
        <input id="avatarInput" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatar} className="hidden" />
        <span className="text-xs text-gray-400">JPG, PNG or WebP. Max 3MB.</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" required><input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputCls} /></Field>
          <Field label="Last Name" required><input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputCls} /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Username"><input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className={inputCls} placeholder="your_username" /></Field>
          <Field label="Phone"><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+251 9XX XXX XXX" /></Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date of Birth"><input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className={inputCls} /></Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={selectCls}>
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Country"><input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} placeholder="Ethiopia" /></Field>
          <Field label="City"><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} placeholder="Addis Ababa" /></Field>
        </div>
        <Field label="Preferred Contact Method">
          <select value={form.preferredContactMethod} onChange={(e) => setForm({ ...form, preferredContactMethod: e.target.value })} className={selectCls}>
            <option value="email">Email</option>
            <option value="phone">Phone Call</option>
            <option value="sms">SMS</option>
          </select>
        </Field>
        <Field label="Bio / About Me">
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={500} className={inputCls} placeholder="Tell us about yourself..." />
          <span className="text-xs text-gray-400 mt-1 block">{form.bio.length}/500</span>
        </Field>
        <div className="pt-2">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave size={16} /> Save Changes</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function AccountSettings({ user, onUpdate, onNavigate, onReload }) {
  const [emailForm, setEmailForm] = useState({ newEmail: "", password: "" });
  const [usernameForm, setUsernameForm] = useState({ username: "" });
  const [deactivatePass, setDeactivatePass] = useState("");
  const [deletePass, setDeletePass] = useState("");
  const [showSections, setShowSections] = useState({ email: false, username: false, deactivate: false, delete: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });

  useEffect(() => { if (user) setUsernameForm({ username: user.username || "" }); }, [user]);

  const toggle = (k) => setShowSections((p) => ({ ...p, [k]: !p[k] }));

  const handleChangeEmail = async (e) => {
    e.preventDefault(); setSaving(true); setToast({ type: "", msg: "" });
    try {
      await changeEmail(emailForm.newEmail, emailForm.password);
      onUpdate({ email: emailForm.newEmail });
      setToast({ type: "success", msg: "Email changed successfully" });
      setEmailForm({ newEmail: "", password: "" });
      setShowSections((p) => ({ ...p, email: false }));
    } catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleChangeUsername = async (e) => {
    e.preventDefault(); setSaving(true); setToast({ type: "", msg: "" });
    try {
      await changeUsername(usernameForm.username);
      onUpdate({ username: usernameForm.username });
      setToast({ type: "success", msg: "Username updated" });
    } catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleDeactivate = async (e) => {
    e.preventDefault(); setSaving(true); setToast({ type: "", msg: "" });
    try {
      await deactivateAccount(deactivatePass);
      localStorage.removeItem("merkato_access_token");
      localStorage.removeItem("merkato_current_user");
      onNavigate("/login");
    } catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm("This will permanently delete your account and all data. Are you sure?")) return;
    setSaving(true); setToast({ type: "", msg: "" });
    try {
      await deleteAccount(deletePass);
      localStorage.clear();
      onNavigate("/");
      window.location.reload();
    } catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleLogoutAll = async () => {
    if (!confirm("This will log you out from all devices. Continue?")) return;
    try {
      await logoutAllDevices();
      localStorage.removeItem("merkato_access_token");
      localStorage.removeItem("merkato_current_user");
      onNavigate("/login");
    } catch (err) { setToast({ type: "error", msg: err.message }); }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <SectionHeader title="Account Settings" desc="Manage your account ID, email, username, and status" />
      <Toast type={toast.type} message={toast.msg} />

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div><span className="text-xs text-gray-400 font-bold uppercase">Account ID</span><p className="text-sm font-bold text-gray-900 font-mono">{user?._id || "N/A"}</p></div>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div><span className="text-xs text-gray-400 font-bold uppercase">Account Type</span><p className="text-sm font-bold text-gray-900 capitalize">{user?.role || "customer"}</p></div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${user?.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{user?.isActive ? "Active" : "Inactive"}</span>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div><span className="text-xs text-gray-400 font-bold uppercase">Email Verification</span><p className="text-sm font-bold text-gray-900">{user?.isVerified ? "Verified" : "Not Verified"}</p></div>
          <FiCheckCircle className={user?.isVerified ? "text-green-500" : "text-gray-300"} size={18} />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div><span className="text-xs text-gray-400 font-bold uppercase">Member Since</span><p className="text-sm font-bold text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}</p></div>
        </div>
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
        <button onClick={() => toggle("email")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FiMail size={16} /> Change Email</span>
          {showSections.email ? <FiChevronDown size={16} className="text-gray-400" /> : <FiChevronRight size={16} className="text-gray-400" />}
        </button>
        {showSections.email && (
          <form onSubmit={handleChangeEmail} className="p-4 pt-0 space-y-3 border-t border-gray-100">
            <div className="pt-3"><Field label="Current Password" required><input type="password" required value={emailForm.password} onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })} className={inputCls} /></Field></div>
            <Field label="New Email" required><input type="email" required value={emailForm.newEmail} onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })} className={inputCls} /></Field>
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving..." : "Update Email"}</button>
          </form>
        )}
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
        <button onClick={() => toggle("username")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer">
          <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FiUser size={16} /> Change Username</span>
          {showSections.username ? <FiChevronDown size={16} className="text-gray-400" /> : <FiChevronRight size={16} className="text-gray-400" />}
        </button>
        {showSections.username && (
          <form onSubmit={handleChangeUsername} className="p-4 pt-0 space-y-3 border-t border-gray-100">
            <div className="pt-3"><Field label="Username" required><input type="text" required value={usernameForm.username} onChange={(e) => setUsernameForm({ ...usernameForm, username: e.target.value })} className={inputCls} minLength={3} maxLength={30} /></Field></div>
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving..." : "Update Username"}</button>
          </form>
        )}
      </div>

      <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
        <button onClick={handleLogoutAll} className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer">
          <FiLogOut size={16} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-800">Logout from All Devices</span>
        </button>
      </div>

      <div className="border border-red-100 rounded-xl overflow-hidden mb-3">
        <button onClick={() => toggle("deactivate")} className="w-full flex items-center justify-between p-4 hover:bg-red-50/50 transition-colors cursor-pointer">
          <span className="text-sm font-bold text-red-600 flex items-center gap-2"><FiAlertTriangle size={16} /> Deactivate Account</span>
          {showSections.deactivate ? <FiChevronDown size={16} className="text-red-400" /> : <FiChevronRight size={16} className="text-red-400" />}
        </button>
        {showSections.deactivate && (
          <form onSubmit={handleDeactivate} className="p-4 pt-0 space-y-3 border-t border-red-100">
            <p className="text-xs text-red-500">Your account will be deactivated. You can reactivate by logging in again.</p>
            <Field label="Confirm Password" required><input type="password" required value={deactivatePass} onChange={(e) => setDeactivatePass(e.target.value)} className={inputCls} /></Field>
            <button type="submit" disabled={saving} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all cursor-pointer">{saving ? "Processing..." : "Deactivate Account"}</button>
          </form>
        )}
      </div>

      <div className="border border-red-200 rounded-xl overflow-hidden bg-red-50/30">
        <button onClick={() => toggle("delete")} className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors cursor-pointer">
          <span className="text-sm font-bold text-red-700 flex items-center gap-2"><FiTrash2 size={16} /> Delete Account Permanently</span>
          {showSections.delete ? <FiChevronDown size={16} className="text-red-400" /> : <FiChevronRight size={16} className="text-red-400" />}
        </button>
        {showSections.delete && (
          <form onSubmit={handleDelete} className="p-4 pt-0 space-y-3 border-t border-red-200">
            <p className="text-xs text-red-600 font-semibold">This action is irreversible. All your data, orders, and account will be permanently deleted.</p>
            <Field label="Type your password to confirm" required><input type="password" required value={deletePass} onChange={(e) => setDeletePass(e.target.value)} className={inputCls} /></Field>
            <button type="submit" disabled={saving} className={btnDanger}>{saving ? "Deleting..." : "Delete Account Forever"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function SecuritySettings({ user, onNavigate }) {
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false });

  useEffect(() => {
    getLoginHistory().then((d) => setHistory(d)).catch(() => {}).finally(() => setLoadingHistory(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { setToast({ type: "error", msg: "Passwords do not match" }); return; }
    if (pwForm.newPassword.length < 6) { setToast({ type: "error", msg: "Password must be at least 6 characters" }); return; }
    setSaving(true); setToast({ type: "", msg: "" });
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setToast({ type: "success", msg: "Password changed successfully" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleDownloadData = async () => {
    try { await downloadMyData(); setToast({ type: "success", msg: "Data download started" }); }
    catch (err) { setToast({ type: "error", msg: err.message }); }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <SectionHeader title="Security" desc="Manage your password, login history, and account security" />
      <Toast type={toast.type} message={toast.msg} />

      <div className="mb-8">
        <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><FiLock size={16} /> Change Password</h4>
        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <Field label="Current Password" required>
            <div className="relative">
              <input type={showPw.current ? "text" : "password"} required value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className={inputCls} />
              <button type="button" onClick={() => setShowPw((p) => ({ ...p, current: !p.current }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"><FiEye size={16} /></button>
            </div>
          </Field>
          <Field label="New Password" required>
            <div className="relative">
              <input type={showPw.new ? "text" : "password"} required value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className={inputCls} minLength={6} />
              <button type="button" onClick={() => setShowPw((p) => ({ ...p, new: !p.new }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"><FiEye size={16} /></button>
            </div>
          </Field>
          <Field label="Confirm New Password" required><input type="password" required value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} className={inputCls} /></Field>
          <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Changing..." : "Change Password"}</button>
        </form>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><FiDownload size={16} /> Data Management</h4>
        <button onClick={handleDownloadData} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl text-sm inline-flex items-center gap-2 cursor-pointer"><FiDownload size={14} /> Download My Data</button>
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2"><FiClock size={16} /> Login History</h4>
        {loadingHistory ? <p className="text-sm text-gray-400">Loading...</p> : history.length === 0 ? <p className="text-sm text-gray-400">No login history yet</p> : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {history.map((log) => (
              <div key={log._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-gray-800">{log.action.replace(/_/g, " ")}</p>
                  <p className="text-gray-400 mt-0.5">{log.ipAddress} | {log.userAgent?.slice(0, 50)}...</p>
                </div>
                <span className="text-gray-400 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddressSettings({ user, onReload }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ label: "", type: "home", fullName: "", phone: "", street: "", city: "", region: "", country: "", zipCode: "", isDefault: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });

  useEffect(() => { if (user) setAddresses(user.addresses || []); }, [user]);

  const openAdd = () => { setEditId(null); setForm({ label: "", type: "home", fullName: "", phone: "", street: "", city: "", region: "", country: "", zipCode: "", isDefault: false }); setShowForm(true); };
  const openEdit = (a) => { setEditId(a._id); setForm({ label: a.label, type: a.type, fullName: a.fullName, phone: a.phone, street: a.street, city: a.city, region: a.region, country: a.country, zipCode: a.zipCode, isDefault: a.isDefault }); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setToast({ type: "", msg: "" });
    try {
      if (editId) { await updateAddress(editId, form); }
      else { await addAddress(form); }
      await onReload();
      setShowForm(false);
      setToast({ type: "success", msg: editId ? "Address updated" : "Address added" });
    } catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this address?")) return;
    try { await deleteAddress(id); await onReload(); setToast({ type: "success", msg: "Address deleted" }); }
    catch (err) { setToast({ type: "error", msg: err.message }); }
  };

  const handleSetDefault = async (id) => {
    try { await updateAddress(id, { isDefault: true }); await onReload(); }
    catch (err) { setToast({ type: "error", msg: err.message }); }
  };

  const typeIcons = { home: FiHome, work: FiBriefcase, shipping: FiTruck, billing: FiCreditCard };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <SectionHeader title="Addresses" desc="Manage your shipping and billing addresses" />
        <button onClick={openAdd} className={btnPrimary}><FiPlus size={16} /> Add</button>
      </div>
      <Toast type={toast.type} message={toast.msg} />

      {addresses.length === 0 ? (
        <div className="text-center py-10"><FiMapPin className="mx-auto text-gray-300 mb-3" size={40} /><p className="text-gray-500 text-sm">No addresses saved yet</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((a) => {
            const Icon = typeIcons[a.type] || FiHome;
            return (
              <div key={a._id} className={`border rounded-xl p-4 relative ${a.isDefault ? "border-orange-500 bg-orange-50/30" : "border-gray-100"}`}>
                {a.isDefault && <span className="absolute top-3 right-3 text-[9px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">Default</span>}
                <div className="flex items-center gap-2 mb-2"><Icon size={16} className="text-gray-500" /><span className="font-bold text-sm text-gray-800">{a.label}</span></div>
                {a.fullName && <p className="text-xs text-gray-600">{a.fullName}</p>}
                <p className="text-xs text-gray-500">{[a.street, a.city, a.region, a.country].filter(Boolean).join(", ")}</p>
                {a.phone && <p className="text-xs text-gray-400 mt-1">{a.phone}</p>}
                <div className="flex gap-2 mt-3">
                  {!a.isDefault && <button onClick={() => handleSetDefault(a._id)} className="text-[10px] font-bold text-orange-600 hover:underline cursor-pointer">Set Default</button>}
                  <button onClick={() => openEdit(a)} className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"><FiEdit2 size={10} className="inline" /> Edit</button>
                  <button onClick={() => handleDelete(a._id)} className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"><FiTrash2 size={10} className="inline" /> Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="text-lg font-black text-gray-900">{editId ? "Edit Address" : "Add Address"}</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Label" required><input type="text" required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={inputCls} placeholder="Home, Work..." /></Field>
                <Field label="Type">
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectCls}>
                    <option value="home">Home</option><option value="work">Work</option><option value="shipping">Shipping</option><option value="billing">Billing</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Full Name"><input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputCls} /></Field>
                <Field label="Phone"><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></Field>
              </div>
              <Field label="Street Address"><input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className={inputCls} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City"><input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} /></Field>
                <Field label="Region/State"><input type="text" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Country"><input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} /></Field>
                <Field label="Zip Code"><input type="text" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className={inputCls} /></Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                <span className="text-sm font-medium text-gray-700">Set as default address</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-gray-900 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer">{saving ? "Saving..." : "Save Address"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PreferencesSettings({ user, onReload }) {
  const [prefs, setPrefs] = useState({ language: "en", theme: "light", timezone: "Africa/Addis_Ababa", dateFormat: "MMM DD, YYYY", currency: "ETB", defaultHomepage: "/products", emailNotifications: true, smsNotifications: false, orderUpdates: true, marketingEmails: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });

  useEffect(() => { if (user?.preferences) setPrefs((p) => ({ ...p, ...user.preferences })); }, [user]);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setToast({ type: "", msg: "" });
    try { await updatePreferences(prefs); await onReload(); setToast({ type: "success", msg: "Preferences saved" }); }
    catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const Toggle = ({ label, field }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <button onClick={() => setPrefs((p) => ({ ...p, [field]: !p[field] }))} className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${prefs[field] ? "bg-orange-500" : "bg-gray-300"}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${prefs[field] ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <SectionHeader title="Preferences" desc="Customize your experience" />
      <Toast type={toast.type} message={toast.msg} />
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Display</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Language">
              <select value={prefs.language} onChange={(e) => setPrefs({ ...prefs, language: e.target.value })} className={selectCls}>
                <option value="en">English</option><option value="am">Amharic</option><option value="fr">French</option><option value="ar">Arabic</option>
              </select>
            </Field>
            <Field label="Theme">
              <div className="flex gap-2">
                {[{ v: "light", icon: FiSun, l: "Light" }, { v: "dark", icon: FiMoon, l: "Dark" }, { v: "system", icon: FiMonitor, l: "System" }].map((t) => (
                  <button key={t.v} type="button" onClick={() => setPrefs({ ...prefs, theme: t.v })}
                    className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${prefs.theme === t.v ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                    <t.icon size={18} />{t.l}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Regional</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Timezone">
              <select value={prefs.timezone} onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })} className={selectCls}>
                <option value="Africa/Addis_Ababa">Addis Ababa (EAT)</option><option value="Africa/Nairobi">Nairobi (EAT)</option><option value="Europe/London">London (GMT)</option><option value="America/New_York">New York (EST)</option><option value="Asia/Dubai">Dubai (GST)</option>
              </select>
            </Field>
            <Field label="Date Format">
              <select value={prefs.dateFormat} onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })} className={selectCls}>
                <option value="MMM DD, YYYY">MMM DD, YYYY</option><option value="DD/MM/YYYY">DD/MM/YYYY</option><option value="MM/DD/YYYY">MM/DD/YYYY</option><option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </Field>
            <Field label="Currency">
              <select value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })} className={selectCls}>
                <option value="ETB">ETB (Birr)</option><option value="USD">USD ($)</option><option value="EUR">EUR</option>
              </select>
            </Field>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Notifications</h4>
          <Toggle label="Email Notifications" field="emailNotifications" />
          <Toggle label="SMS Notifications" field="smsNotifications" />
          <Toggle label="Order Updates" field="orderUpdates" />
          <Toggle label="Marketing Emails" field="marketingEmails" />
        </div>
        <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving..." : <><FiSave size={16} /> Save Preferences</>}</button>
      </form>
    </div>
  );
}

function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { getUserOrders().then((d) => setOrders(d)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const statusColors = { Placed: "bg-blue-50 text-blue-700", Processing: "bg-yellow-50 text-yellow-700", Shipped: "bg-purple-50 text-purple-700", Delivered: "bg-green-50 text-green-700", Canceled: "bg-red-50 text-red-700" };
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <SectionHeader title="Order History" desc="View and manage your orders" />
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "Placed", "Processing", "Shipped", "Delivered", "Canceled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${filter === f ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f === "all" ? `All (${orders.length})` : `${f} (${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>
      {loading ? <p className="text-sm text-gray-400 py-8 text-center">Loading orders...</p> : filtered.length === 0 ? (
        <div className="text-center py-10"><FiShoppingBag className="mx-auto text-gray-300 mb-3" size={40} /><p className="text-gray-500 text-sm">No orders found</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o._id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-gray-900">#{o._id?.slice(-6).toUpperCase()}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[o.status] || "bg-gray-100 text-gray-600"}`}>{o.status}</span>
                </div>
                <span className="text-xs text-gray-400">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{o.items?.map((i) => `${i.name} x${i.qty}`).join(", ") || "—"}</p>
                <span className="font-bold text-sm text-gray-900">{(o.totalPaid || 0).toLocaleString()} <span className="text-xs text-orange-600">ETB</span></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PrivacySettings({ user, onReload }) {
  const [priv, setPriv] = useState({ profileVisibility: "public", whoCanContact: "everyone", showEmail: false, showPhone: false, showOrders: false, dataSharing: true, marketingConsent: false, cookiePreferences: "all" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });

  useEffect(() => { if (user?.privacy) setPriv((p) => ({ ...p, ...user.privacy })); }, [user]);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setToast({ type: "", msg: "" });
    try { await updatePrivacy(priv); await onReload(); setToast({ type: "success", msg: "Privacy settings saved" }); }
    catch (err) { setToast({ type: "error", msg: err.message }); }
    finally { setSaving(false); }
  };

  const Toggle = ({ label, field, desc }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div><span className="text-sm text-gray-700 block">{label}</span>{desc && <span className="text-xs text-gray-400">{desc}</span>}</div>
      <button type="button" onClick={() => setPriv((p) => ({ ...p, [field]: !p[field] }))} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${priv[field] ? "bg-orange-500" : "bg-gray-300"}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${priv[field] ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <SectionHeader title="Privacy" desc="Control who can see your information and how your data is used" />
      <Toast type={toast.type} message={toast.msg} />
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Visibility</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Profile Visibility">
              <select value={priv.profileVisibility} onChange={(e) => setPriv({ ...priv, profileVisibility: e.target.value })} className={selectCls}>
                <option value="public">Public</option><option value="private">Private</option><option value="contacts">Contacts Only</option>
              </select>
            </Field>
            <Field label="Who Can Contact Me">
              <select value={priv.whoCanContact} onChange={(e) => setPriv({ ...priv, whoCanContact: e.target.value })} className={selectCls}>
                <option value="everyone">Everyone</option><option value="contacts">Contacts Only</option><option value="nobody">Nobody</option>
              </select>
            </Field>
          </div>
          <Toggle label="Show Email Address" field="showEmail" desc="Allow others to see your email" />
          <Toggle label="Show Phone Number" field="showPhone" desc="Allow others to see your phone" />
          <Toggle label="Show Order History" field="showOrders" desc="Display your orders publicly" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-3">Data & Consent</h4>
          <Toggle label="Data Sharing" field="dataSharing" desc="Help improve our service by sharing anonymized usage data" />
          <Toggle label="Marketing Consent" field="marketingConsent" desc="Receive marketing and promotional communications" />
          <Field label="Cookie Preferences" >
            <select value={priv.cookiePreferences} onChange={(e) => setPriv({ ...priv, cookiePreferences: e.target.value })} className={selectCls}>
              <option value="all">Accept All Cookies</option><option value="essential">Essential Only</option><option value="none">No Cookies</option>
            </select>
          </Field>
        </div>
        <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving..." : <><FiSave size={16} /> Save Privacy Settings</>}</button>
      </form>
    </div>
  );
}
