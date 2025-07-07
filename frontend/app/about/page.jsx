import Link from "next/link";
import Features from "../components/layout/Features";

export const metadata = {
    title: 'About | Waitless'
};

export default function About() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-cyan-50 flex flex-col items-center">
            <section className="flex flex-col items-center text-center mt-20 mb-16 px-4 max-w-2xl animate-fade-in">
                <div className="relative mb-8">
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-cyan-100 rounded-full blur-2xl opacity-70"></span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2 drop-shadow-lg z-10 relative">
                        About <span className="bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">Waitless</span>
                    </h1>
                    <p className="text-base text-cyan-700 font-semibold tracking-wide uppercase mb-2 z-10 relative">
                        Your time, reimagined.
                    </p>
                </div>
                <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed">
                    <span className="font-semibold text-cyan-600">Waitless</span> is your personal queue companion, designed to help you avoid long waits at your favorite places. Get <span className="font-semibold text-teal-600">real-time updates</span> on queue lengths and wait times, so you can make the most of every moment.
                </p>
                <ul className="text-left text-slate-700 mb-8 space-y-3">
                    <li className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">✓</span>
                        Get live wait time updates for popular venues
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">✓</span>
                        Plan your visits efficiently and skip the hassle
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-gradient-to-br from-cyan-500 to-teal-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">✓</span>
                        Enjoy a smoother, more productive day
                    </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <a
                        href="https://github.com/raghulkannan-s/live-queue-notifier"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-semibold px-8 py-3 rounded-full shadow-xl transition duration-100 transform hover:scale-105"
                    >
                        🚀 View on GitHub
                    </a>
                    <Link
                        href="/"
                        className="bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 font-medium px-8 py-3 rounded-full shadow transition duration-200 flex items-center justify-center"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </section>
            <section className="w-full max-w-4xl px-4 mb-16">
                <div className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-cyan-700 mb-2">Why Waitless?</h2>
                        <p className="text-slate-600 mb-2">
                            We believe your time is precious. Waitless was built to help you reclaim it—whether you’re grabbing coffee, visiting a clinic, or heading to your favorite restaurant.
                        </p>
                        <p className="text-slate-600">
                            Join our community and help shape the future of smarter, queue-free living!
                        </p>
                    </div>
                </div>
            </section>
            <Features />
        </main>
    );
}