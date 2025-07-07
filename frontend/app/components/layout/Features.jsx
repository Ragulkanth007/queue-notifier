


const Features = () => {
    return(
            <section
                id="features"
                className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 mb-24"
            >
                <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center border border-slate-100 hover:shadow-2xl transition-all duration-100 hover:-translate-y-2 group">
                    <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-cyan-600 transition-colors duration-100">
                        <svg className="w-8 h-8 text-cyan-600 group-hover:text-white transition-colors duration-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 17l4 4 4-4m-4-5v9" />
                            <path d="M20.24 12.24A9 9 0 1 0 12 21" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-800 text-xl text-center mb-3">Real-Time Updates</h3>
                    <p className="text-slate-600 text-center">Get instant updates on current wait times at popular venues.</p>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center border border-slate-100 hover:shadow-2xl transition-all duration-100 hover:-translate-y-2 group">
                    <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-cyan-600 transition-colors duration-100">
                        <svg className="w-8 h-8 text-cyan-600 group-hover:text-white transition-colors duration-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3" />
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-800 text-xl mb-3">Save Your Time</h3>
                    <p className="text-slate-600 text-center">Plan your visits efficiently and avoid unnecessary waiting.</p>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center border border-slate-100 hover:shadow-2xl transition-all duration-100 hover:-translate-y-2 group">
                    <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-cyan-600 transition-colors duration-100">
                        <svg className="w-8 h-8 text-cyan-600 group-hover:text-white transition-colors duration-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17 9V7a5 5 0 0 0-10 0v2" />
                            <rect x="5" y="9" width="14" height="10" rx="2" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-800 text-center text-xl mb-3">Smart Alerts</h3>
                    <p className="text-slate-600 text-center">Receive alerts when queues are short or your turn is near.</p>
                </div>
                <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center border border-slate-100 hover:shadow-2xl transition-all duration-100 hover:-translate-y-2 group">
                    <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-cyan-600 transition-colors duration-100">
                        <svg className="w-8 h-8 text-cyan-600 group-hover:text-white transition-colors duration-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-slate-800 text-xl mb-3">Easy to Use</h3>
                    <p className="text-slate-600 text-center">Simple, intuitive interface for a seamless experience.</p>
                </div>
            </section>

    )
}


export default Features;