"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { get_owned_rooms, delete_room } from "@/utils/api";
import { toast } from "react-hot-toast";

export default function AdminRoomsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (user && user.role !== 'admin' && user.role !== 'owner') {
            router.push('/unauthorized');
        }
    }, [user, router]);

    const fetchOwnedRooms = async () => {
        setLoading(true);
        try {
            const res = await get_owned_rooms(user.token);
            setRooms(res.data || []);
        } catch (err) {
            console.error("Error fetching owned rooms:", err);
            toast.error("Failed to fetch rooms");
            setRooms([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId, roomName) => {
        if (!confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
            return;
        }

        setDeleting(roomId);
        try {
            await delete_room(roomId, user.token);
            toast.success("Room deleted successfully");
            fetchOwnedRooms();
        } catch (err) {
            console.error("Error deleting room:", err);
            toast.error("Failed to delete room");
        } finally {
            setDeleting(null);
        }
    };

    useEffect(() => {
        if (user?.token) {
            fetchOwnedRooms();
        }
    }, [user?.token]);

    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Manage Rooms</h1>
                        <p className="text-slate-600">View and manage all rooms you own</p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={fetchOwnedRooms}
                            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={() => router.push('/rooms/new')}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                        >
                            Create New Room
                        </button>
                    </div>
                </div>

                {/* Rooms Grid */}
                {rooms.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-12 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6">
                            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No rooms found</h3>
                        <p className="text-slate-600 mb-6">You haven't created any rooms yet.</p>
                        <button
                            onClick={() => router.push('/rooms/new')}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 transition-colors"
                        >
                            Create Your First Room
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div key={room._id} className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden hover:shadow-2xl transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-slate-900 mb-2">{room.name}</h3>
                                            {room.description && (
                                                <p className="text-slate-600 text-sm mb-3">{room.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm text-slate-500">
                                            Queue Count: <span className="font-semibold text-cyan-600">{room.queueCount || 0}</span>
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            Created: {new Date(room.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => router.push(`/rooms/${room._id}`)}
                                            className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors text-sm font-medium"
                                        >
                                            View Room
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRoom(room._id, room.name)}
                                            disabled={deleting === room._id}
                                            className="bg-red-50 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 border border-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {deleting === room._id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}