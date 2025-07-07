'use client';

import Link from 'next/link';
import { logout, login } from '@/lib/actions/auth';
import useAuthStore from '@/store/authStore';
import { useEffect, useState } from 'react';

const Header = () => {
    const { fetchSession, isAuthenticated, user, clearUser } = useAuthStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        fetchSession();
        if(isAuthenticated){
            window.location.href = '/dashboard';
        }
    },[])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.dropdown')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        logout();
        clearUser();
        setIsDropdownOpen(false);
    };

    return (
        <nav className="w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">
                            Waitless
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/dashboard"
                            className="relative text-slate-700 hover:text-cyan-600 font-medium text-sm transition-all duration-200 group"
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-600 to-cyan-700 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link
                            href="/about"
                            className="relative text-slate-700 hover:text-cyan-600 font-medium text-sm transition-all duration-200 group"
                        >
                            About
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-600 to-cyan-700 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/rooms"
                                className="relative text-slate-700 hover:text-cyan-600 font-medium text-sm transition-all duration-200 group"
                            >
                                Rooms
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-600 to-cyan-700 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        )}
                        { isAuthenticated && user?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="relative text-slate-700 hover:text-cyan-600 font-medium text-sm transition-all duration-200 group"
                                >
                                    Admin
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-600 to-cyan-700 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            )}
                    </div>

                    {/* Auth Section */}
                    <div className="relative">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-3 p-1.5 rounded-full hover:bg-slate-50 transition-all duration-200 group"
                                >
                                    <div className="relative">
                                        <img
                                            src={user.image}
                                            alt="Profile"
                                            className="w-9 h-9 rounded-full border-2 border-slate-200 group-hover:border-cyan-300 transition-all duration-200 shadow-sm"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-500">Online</p>
                                    </div>
                                    <svg 
                                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                                        </div>

                                        <div className="py-2">
                                            <Link 
                                                href="/profile"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile
                                            </Link>
                                            
                                            <div className="md:hidden">
                                                <Link 
                                                    href="/rooms"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    Rooms
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-2 mt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center cursor-pointer w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={login}
                                className="relative cursor-pointer bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-medium px-6 py-2.5 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 group overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Sign In
                                </span>
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
