"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import useAuthStore from "@/store/authStore";
import { get_user_queues } from "@/utils/api"; // you should build this API to return queues for a given user
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  async function fetchQueues() {
    try {
      if (!user || !user.id) {
        console.log("User data not available yet");
        setLoading(false);
        return;
      }

      toast.loading("Loading your queues...");
      const res = await get_user_queues(user.id, user.token);
      setQueues(res.queues || []);
      toast.dismiss();
    } catch (err) {
      console.error(err);
      toast.error("Failed to load queues");
    } finally {
      setLoading(false);
    }
  }

  // Initialize socket connection for dashboard updates
  useEffect(() => {
    if (!user?.token || typeof window === 'undefined') return;

    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      auth: {
        token: user.token
      }
    });

    newSocket.on('connect', () => {
      console.log('Dashboard connected to socket server');
    });

    newSocket.on('queue:room:update', (data) => {
      console.log('Dashboard queue update received:', data);
      // Refresh user queues when any queue updates
      fetchQueues();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.token]);

  useEffect(() => {
    fetchQueues();
  }, [user?.id, user?.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-slate-600">Here are your current queue positions</p>
          </div>
          <button
            onClick={() => router.push('/rooms')}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
          >
            Browse Rooms
          </button>
        </div>

        {/* Queue Cards */}
        {queues.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No active queues</h3>
            <p className="text-slate-600 mb-6">You're not currently in any queues. Browse available rooms to join one.</p>
            <button
              onClick={() => router.push('/rooms')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
            >
              Find Rooms
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {queues.map((queue) => (
              <div key={queue._id} className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{queue.roomName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                        <span>Position #{queue.position}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="capitalize">{queue.status}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/rooms/${queue.roomId}`)}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                  >
                    View Queue
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
