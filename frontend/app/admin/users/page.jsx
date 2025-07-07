"use client";

import { useEffect, useState } from "react";
import { get_users } from "@/utils/api";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState(""); // new filter
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchUsers() {
      try {
        toast.loading("Fetching users...");
        const res = await get_users(user.token);
        setUsers(res.users);
        toast.dismiss();
        toast.success("Users fetched successfully");
      } catch (err) {
        setUsers([]);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = roleFilter
    ? users.filter(u => u.role === roleFilter)
    : users;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-700">User Management</h1>
        <div>

        </div>
          <select
            className="border border-cyan-300 rounded px-4 py-2"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center text-cyan-600">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-slate-500">No users found.</div>
      ) : (
        <div className="grid gap-6">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              className="flex items-center bg-white rounded-xl shadow p-4 gap-4 hover:shadow-lg transition"
            >
              <img
                src={
                  user.profileImage
                }
                alt={user.name}
                className="w-14 h-14 rounded-full border-2 border-cyan-200 object-cover"
              />
              <div className="flex-1">
                <div className="font-semibold text-lg text-slate-800">{user.name}</div>
                <div className="text-slate-500 text-sm">{user.email}</div>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-cyan-100 text-cyan-700 font-medium">
                  {user.role}
                </span>
              </div>
              <button
                className="bg-cyan-600 hover:bg-cyan-700 cursor-pointer text-white font-semibold px-5 py-2 rounded-full shadow transition duration-100"
                onClick={() => router.push(`/admin/user/${user._id}`)}
              >
                View details
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
