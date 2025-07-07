import Link from "next/link";

export const metadata = {
    title: "Unauthorized | Waitless",
};

export default function Unauthorized() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-cyan-50 flex flex-col items-center justify-center">
            <section className="flex flex-col items-center text-center px-4 max-w-2xl animate-fade-in">
                <div className="relative mb-8">
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-cyan-100 rounded-full blur-2xl opacity-70"></span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-600 mb-2 drop-shadow-lg z-10 relative">
                        403
                    </h1>
                    <p className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 z-10 relative">
                        Unauthorized Access
                    </p>
                </div>
                <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed">
                    Sorry, you do not have permission to view this page.<br />
                    Please login with an account that has the required access.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link
                        href="/"
                        className="bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600 text-white font-semibold px-8 py-3 rounded-full shadow-xl transition duration-100 transform hover:scale-105"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/rooms"
                        className="bg-white border border-cyan-200 text-cyan-700 hover:bg-cyan-50 font-medium px-8 py-3 rounded-full shadow transition duration-200 flex items-center justify-center"
                    >
                        View Queues
                    </Link>
                </div>
                <div className="mt-8">
                    <span className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full font-semibold text-sm">
                        Need help? Contact your admin for access.
                    </span>
                </div>
            </section>
        </main>
    );
}