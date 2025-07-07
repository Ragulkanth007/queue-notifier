"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { get_users, promote_user, demote_user, get_user_by_id } from "@/utils/api";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const { userId } = useParams();
  const { user } = useAuthStore();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const roles = ["user", "manager", "owner", "admin"];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        toast.loading("Loading user details...");
        const res = await get_user_by_id(userId, user.token);
        setUserData(res.user || null);
        if (!res.user) toast.error("User not found");
        toast.dismiss();
      } catch (err) {
        toast.error("Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId, user.token]);

  const handlePromote = async () => {
    if (!selectedRole) return;
    setActionLoading(true);
    try {
      const res = await promote_user(userData._id, selectedRole, user.token);
      toast.success(res.message || "User promoted successfully");
      setUserData({ ...userData, role: selectedRole });
      setSelectedRole("");
    } catch (err) {
      console.error("Promotion failed:", err);
      toast.error("Promotion failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDemote = async () => {
    if (!selectedRole) return;
    setActionLoading(true);
    try {
      const res = await demote_user(userData._id, selectedRole, user.token);
      toast.success(res.message || "User demoted successfully");
      setUserData({ ...userData, role: selectedRole });
      setSelectedRole("");
    } catch (err) {
      toast.error("Demotion failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      toast.loading("Refreshing user details...");
      const res = await get_user_by_id(userId, user.token);
      setUserData(res.user || null);
      if (!res.user) toast.error("User not found");
      toast.dismiss();
      toast.success("User details refreshed");
    } catch (err) {
      toast.error("Failed to refresh user data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-white">
        <div className="text-cyan-600 text-xl font-semibold animate-pulse">
          Loading user details...
        </div>
      </main>
    );
  }

  if (!userData) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-white">
        <div className="text-slate-500 text-lg mb-4">User not found.</div>
        <button
          onClick={() => router.push("/admin/users")}
          className="px-6 py-2 rounded-full bg-cyan-600 text-white shadow hover:bg-cyan-700 transition"
        >
          Back to Users
        </button>
      </main>
    );
  }

  const currentRoleIndex = roles.indexOf(userData.role);
  const selectedRoleIndex = roles.indexOf(selectedRole);

  let actionSection = (
    <div className="flex flex-col sm:flex-row gap-4 mt-6">
      <select
        className="px-4 py-2 rounded border border-cyan-200"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option value="">Select role</option>
        {roles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
      {selectedRole &&
        selectedRole !== userData.role &&
        (selectedRoleIndex > currentRoleIndex ? (
          <button
            onClick={handlePromote}
            disabled={actionLoading}
            className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition cursor-pointer disabled:opacity-50"
          >
            Promote
          </button>
        ) : selectedRoleIndex < currentRoleIndex ? (
          <button
            onClick={handleDemote}
            disabled={actionLoading}
            className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition cursor-pointer disabled:opacity-50"
          >
            Demote
          </button>
        ) : null)}
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto py-12 px-6 bg-gradient-to-br from-cyan-50 to-white min-h-screen">
      <div className="flex items-center gap-6 mb-10">
        <div className="flex items-center gap-4">
           <img
            src={userData.profileImage}
            alt={userData.name}
            className="w-16 h-16 rounded-full border-2 border-cyan-200 shadow-sm"
          />
          <div>
            <h2 className="text-3xl font-bold text-cyan-800">{userData.name}</h2>
            <div className="text-slate-500 text-base">{userData.email}</div>
            <span className="inline-block mt-2 px-3 py-1 text-xs rounded bg-cyan-100 text-cyan-700 font-semibold uppercase tracking-wide">
              {userData.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="ml-auto px-4 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <section className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-cyan-700 mb-4">User Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 text-xs uppercase font-medium mb-1">
              Name
            </div>
            <div className="text-slate-800 font-semibold">{userData.name}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase font-medium mb-1">
              Email
            </div>
            <div className="text-slate-800 font-semibold">{userData.email}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase font-medium mb-1">
              Role
            </div>
            <div className="text-cyan-700 font-semibold">{userData.role}</div>
          </div>
          <div>
            <div className="text-slate-400 text-xs uppercase font-medium mb-1">
              User ID
            </div>
            <div className="text-slate-800 font-mono">{userData._id}</div>
          </div>
        </div>
        {actionSection}
      </section>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => router.push("/admin/users")}
          className="px-6 py-2 rounded-full bg-cyan-600 text-white font-semibold shadow hover:bg-cyan-700 transition"
        >
          Back to Users
        </button>
      </div>
    </main>
  );
}
