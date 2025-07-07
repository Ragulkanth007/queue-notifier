"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { create_room } from "@/utils/api";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";

export default function CreateRoomPage() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (user && user.role !== "owner" && user.role !== "admin") {
            router.push('/unauthorized');
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await create_room({
                name: name.trim(),
                description: description.trim()
            }, user.token);
            setSuccess(true);
            setName("");
            setDescription("");

            setTimeout(() => {
                router.push(`/rooms/${res.data._id}`);
            }, 2000);

        } catch (error) {
            console.error('Error creating room:', error);
            setError(error.message || 'Failed to create room. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-8">
                    <button
                        onClick={() => router.push('/rooms')}
                        className="hover:text-cyan-600 transition-colors duration-200 flex items-center space-x-1 group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Rooms</span>
                    </button>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-900 font-medium">Create New Room</span>
                </nav>

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl shadow-lg mb-6 group hover:scale-105 transition-transform duration-200">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Create New <span className="bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">Room</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Set up a new queue room for your business or event. Make it easy for customers to join and wait virtually.
                    </p>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-green-800 font-semibold">Room Created Successfully!</h3>
                                    <p className="text-green-700 text-sm mt-1">Redirecting you to your new room...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
                        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-red-800 font-semibold">Error Creating Room</h3>
                                    <p className="text-red-700 text-sm mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Form Card */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Room Name Input */}
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>Room Name</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-lg group-hover:border-slate-300"
                                        placeholder="e.g., Downtown Dental Clinic, Barber Shop Queue..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={loading}
                                        maxLength={50}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <span className="text-slate-400 text-sm">{name.length}/50</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 flex items-center space-x-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Choose a clear, descriptive name that customers will easily recognize</span>
                                </p>
                            </div>

                            {/* Description Input */}
                            <div className="space-y-3">
                                <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700">
                                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    <span>Description</span>
                                    <span className="text-slate-400 text-xs">(Optional)</span>
                                </label>
                                <div className="relative group">
                                    <textarea
                                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-lg resize-none group-hover:border-slate-300"
                                        placeholder="Describe your service, location, or any special instructions for customers..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        disabled={loading}
                                        maxLength={200}
                                    />
                                    <div className="absolute bottom-3 right-3">
                                        <span className="text-slate-400 text-sm">{description.length}/200</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading || !name.trim()}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed text-lg flex items-center justify-center space-x-3 group"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Creating Room...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span>Create Room</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Feature Highlights */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-t border-cyan-100 p-6 md:p-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm">Real-time Updates</h4>
                                    <p className="text-xs text-slate-600 mt-1">Customers see live queue positions</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm">Easy Management</h4>
                                    <p className="text-xs text-slate-600 mt-1">Simple tools to manage your queue</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm">Instant Setup</h4>
                                    <p className="text-xs text-slate-600 mt-1">Ready to use in seconds</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
