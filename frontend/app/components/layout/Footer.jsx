

const Footer = () => {
  return (
     <footer className="w-full py-8 text-center text-slate-600 bg-white border-t max-h-24 bottom-0 border-slate-200">
        <div className="container mx-auto">
            <div className="flex justify-center mb-4">
                <span className="text-2xl font-bold text-cyan-700">Waitless</span>
            </div>
            <p>
                &copy; {new Date().getFullYear()} Waitless &mdash; 
                <a href="https://waitless.online" className="text-cyan-600 hover:text-cyan-800">
                waitless.online
                </a>
            </p>
        </div>
    </footer>
  );
}

export default Footer;