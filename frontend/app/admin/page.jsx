"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AdminPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user && user.role !== 'admin') {
            router.push('/unauthorized');
        }
    }, [user, isAuthenticated, router]);
    
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f5faff] via-[#eaf3fb] to-[#f5faff] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return null;
    }
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5faff] via-[#eaf3fb] to-[#f5faff]">
            <div className="w-full max-w-lg bg-white/95 rounded-2xl shadow-2xl border border-slate-100 px-10 py-14 flex flex-col items-center space-y-8">
                <div className="flex items-center space-x-3 mb-2">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="20" fill="#06b6d4" />
                        <path d="M13 25c0-3.866 3.582-7 8-7s8 3.134 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="17" cy="16" r="2" fill="#fff" />
                        <circle cx="23" cy="16" r="2" fill="#fff" />
                    </svg>
                    <span className="text-3xl font-extrabold text-cyan-700 tracking-tight">Admin Portal</span>
                </div>
                <p className="text-slate-600 text-center max-w-md text-lg font-medium">
                    Welcome to your control center. Effortlessly manage users and rooms with a modern, intuitive interface.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 w-full">
                    <button
                        onClick={() => router.push("/admin/users")}
                        className="flex-1 cursor-pointer bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        Manage Users
                    </button>
                    <button
                        onClick={() => router.push("/rooms")}
                        className="flex-1 cursor-pointer bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                        Browse Rooms
                    </button>
                    <button
                        onClick={() => router.push("/admin/rooms")}
                        className="flex-1 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        Manage Rooms
                    </button>
                </div>
                <div className="pt-6 text-xs text-slate-400 tracking-wide">
                    &copy; {new Date().getFullYear()} Live Queue Notifier &mdash; Trusted for 100 years
                </div>
            </div>
        </main>
    );
}