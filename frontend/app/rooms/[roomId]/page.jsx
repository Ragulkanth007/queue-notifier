"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { get_room, join_queue, leave_queue, get_queues_by_room, kick_from_queue, cancel_queue } from "@/utils/api";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";
import { connectSocket, getSocket } from "@/utils/socket";

export default function RoomQueuePage() {
    const params = useParams();
    const roomId = params.roomId;

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [userInQueue, setUserInQueue] = useState(false);
    const [Refresh, setRefresh] = useState(false);
    const [queue, setQueue] = useState([]);
    const [socket, setSocket] = useState(null);

    const { user } = useAuthStore();

    async function fetchRoom() {
        setLoading(true);
        try {
            const res = await get_room(roomId, user.token);
            setRoom(res.data);
        } catch (err) {
            setRoom(null);
        } finally {
            setLoading(false);
        }
    }

    const handleJoinQueue = async () => {
        setActionLoading(true);
        toast.loading("Joining queue...");
        try {
            const res = await join_queue(roomId, user.token);
            toast.dismiss();
            if (res.message) {
                toast.success(res.message);
                setUserInQueue(true);
            }
            if (res.error) {
                toast.error(res.error);
                return;
            }
            await fetchQueue();
        } catch (err) {
            console.error("Error joining queue:", err);
            toast.dismiss();
            toast.error("Failed to join queue. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeaveQueue = async () => {
        setActionLoading(true);
        toast.loading("Leaving queue...");
        try {
            const res = await leave_queue(roomId, user.token);
            setUserInQueue(false);
            toast.dismiss();
            if (res.message) {
                toast.success(res.message);
            }
            if (res.error) {
                toast.error(res.error);
            }
            await fetchQueue();
        } catch (err) {
            console.error("Error leaving queue:", err);
            toast.dismiss();
            toast.error("Failed to leave queue. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const fetchQueue = async () => {
        try {
            const res = await get_queues_by_room(roomId, user.token);
            setQueue(res.queue || []);

            if (res.room) {
                setRoom(res.room);
            }

            if (res.queue && res.queue.length > 0 && user?.id) {
                const isInQueue = res.queue.some(q => 
                    q.userId?._id === user.id || q.userId?.id === user.id || q.userId === user.id
                );
                setUserInQueue(isInQueue);
            } else {
                setUserInQueue(false);
            }
        } catch (err) {
            console.error("Error fetching queue:", err);
            setQueue([]);
            setUserInQueue(false);
        }
    };

    const handleKickFromQueue = async (queueId) => {
        if(!confirm("Are you sure you want to kick this user from the queue?")) {
            return;
        }
        try {
            const res = await kick_from_queue(queueId, user.token);
            if (res.message) {
                toast.success(res.message);
            }
            if (res.error) {
                toast.error(res.error);
            }
            await fetchQueue();
        } catch (err) {
            console.error("Error kicking from queue:", err);
            toast.error("Failed to kick from queue. Please try again.");
        }
    }

    const handleCancelQueue = async (queueId) => {
        if(!confirm("Are you sure you want to cancel this queue entry?")) {
            return;
        }
        try {
            const res = await cancel_queue(queueId, user.token);
            if (res.message) {
                toast.success(res.message);
            }
            if (res.error) {
                toast.error(res.error);
            }
            await fetchQueue();
        } catch (err) {
            console.error("Error canceling queue:", err);
            toast.error("Failed to cancel queue. Please try again.");
        }
    }

    // Initialize socket connection
    useEffect(() => {
        if (!user?.token || typeof window === 'undefined') return;

        const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
            auth: {
                token: user.token
            }
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket server');
            // Join room for real-time updates
            newSocket.emit('joinRoom', roomId);
        });

        newSocket.on('queue:update', (data) => {
            console.log('Queue update received:', data);
            if (data.roomId === roomId) {
                setQueue(data.queue || []);
                // Update user queue status
                if (data.queue && data.queue.length > 0 && user?.id) {
                    const isInQueue = data.queue.some(q => 
                        q.userId?._id === user.id || q.userId?.id === user.id || q.userId === user.id
                    );
                    setUserInQueue(isInQueue);
                } else {
                    setUserInQueue(false);
                }
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.emit('leaveRoom', roomId);
            newSocket.disconnect();
        };
    }, [roomId, user?.token, user?.id]);

    useEffect(() => {
        if (roomId && user?.token) {
            fetchRoom();
            fetchQueue();
        }
    }, [roomId, user?.token, user?.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
                                <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
                                <div className="h-4 bg-slate-200 rounded w-2/3 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-slate-200 rounded w-full"></div>
                                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
                <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-12 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Room Not Found</h2>
                            <p className="text-slate-600 mb-8">The queue room you're looking for doesn't exist or has been removed.</p>
                            <button 
                                onClick={() => window.history.back()}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors duration-200"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                        <div className="bg-cyan-600 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{room.name}</h1>
                                    {room.description && (
                                        <p className="text-cyan-100 text-lg">{room.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                        <div className="text-white text-sm font-medium">Queue Status</div>
                                        <div className="text-white text-2xl font-bold">{room.queueCount || 0}</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                        <div className="text-white text-sm font-medium">Current Time</div>
                                        <div className="text-white text-lg font-semibold">
                                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Queue List */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                                <div className="px-8 py-6 border-b border-slate-200/60">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-slate-900">Queue Members</h2>
                                        <div className="flex items-center space-x-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                                            </span>
                                            <span className="text-sm text-slate-600">Live</span>
                                            <span className="text-xs text-slate-400 ml-2">
                                                Updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {queue && queue.length > 0 ? (
                                    <div className="space-y-4 p-4">
                                        {queue.map((queueItem, index) => (
                                            <div
                                                key={queueItem._id}
                                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60 hover:bg-slate-100 transition"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-10 w-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                        #{index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">{queueItem.userId?.name || "Unknown"}</div>
                                                        <div className="text-xs text-slate-500">
                                                            Joined: {queueItem.joinedAt ? new Date(queueItem.joinedAt).toLocaleString() : 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800">
                                                        {queueItem.status || "waiting"}
                                                    </span>
                                                    {(user.role === "admin" || user.role === "owner") && user.id !== queueItem.userId?._id && (
                                                        <div className="flex space-x-2">
                                                            <button 
                                                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 cursor-pointer hover:bg-red-600 hover:text-white text-red-800 transition-colors"
                                                                onClick={() => handleKickFromQueue(queueItem._id)}
                                                            >
                                                                Kick
                                                            </button>
                                                            <button 
                                                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-orange-100 cursor-pointer hover:bg-orange-600 hover:text-white text-orange-800 transition-colors"
                                                                onClick={() => handleCancelQueue(queueItem._id)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    )}
                                                    {queueItem.userId?._id === user.id && (
                                                        <button 
                                                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-yellow-100 cursor-pointer hover:bg-yellow-600 hover:text-white text-yellow-800 transition-colors"
                                                            onClick={() => handleCancelQueue(queueItem._id)}
                                                        >
                                                            Cancel My Queue
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                            <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900 mb-2">No one in queue</h3>
                                        <p className="text-slate-600">Users will appear here when they join.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Actions */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    {!userInQueue ? (
                                        <button
                                            onClick={handleJoinQueue}
                                            disabled={actionLoading}
                                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-3 rounded-lg shadow disabled:opacity-50"
                                        >
                                            {actionLoading ? "Joining..." : "Join Queue"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleLeaveQueue}
                                            disabled={actionLoading}
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-4 py-3 rounded-lg border border-red-300 shadow disabled:opacity-50"
                                        >
                                            {actionLoading ? "Leaving..." : "Leave Queue"}
                                        </button>
                                    )}
                                    <button
                                        onClick={fetchQueue}
                                        className="w-full bg-white hover:bg-slate-50 border border-slate-300 px-4 py-3 rounded-lg text-slate-700 shadow"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Room Information</h3>
                                <div className="space-y-2 text-sm text-slate-700">
                                    <div><strong>Room ID:</strong> {roomId}</div>
                                    <div><strong>Created:</strong> {room.createdAt ? new Date(room.createdAt).toLocaleString() : "N/A"}</div>
                                    <div><strong>Current Date:</strong> {new Date().toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
