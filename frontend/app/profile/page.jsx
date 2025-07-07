'use client';

import useAuthStore from "@/store/authStore";

export default function UserPage() {

  const { user } = useAuthStore();

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-cyan-50 flex flex-col items-center">
      <section className="flex flex-col items-center text-center mt-20 mb-16 px-4 w-full max-w-2xl animate-fade-in">
        <div className="relative mb-8">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-cyan-100 rounded-full blur-2xl opacity-70"></span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2 drop-shadow-lg z-10 relative">
            My Profile
          </h1>
           <p className="text-base text-cyan-700 font-semibold tracking-wide uppercase mb-2 z-10 relative">
            Account Overview
          </p>
        </div>
        {user && (
          <div className="w-full bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8 border border-cyan-100">
            <img
              src={user.image}
              alt="profile"
              className="w-24 h-24 rounded-full shadow object-cover mb-4 border border-cyan-100"
            />
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-cyan-700 font-semibold w-24">Name:</span>
                <span className="text-slate-800">{user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-700 font-semibold w-24">Email:</span>
                <span className="text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-cyan-700 font-semibold w-24">Role:</span>
                <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-medium text-sm shadow">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
