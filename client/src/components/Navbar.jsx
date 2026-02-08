import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LayoutDashboard, LogOut, Globe, Menu, X } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2 group">
                    <div className="relative">
                        <Sparkles className="text-secondary group-hover:text-primary transition-colors" />
                        <div className="absolute inset-0 bg-secondary/50 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-gradient font-extrabold tracking-tight">AdGen AI</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-6 items-center">
                    {token ? (
                        <>
                            <Link to="/community" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 font-medium hover:bg-white/5 px-3 py-1.5 rounded-lg"><Globe size={18} /> Community</Link>
                            <Link to="/generate" className="relative group overflow-hidden bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(112,0,255,0.4)] hover:-translate-y-0.5">
                                <span className="relative z-10 flex items-center gap-2">Create <Sparkles size={16} /></span>
                                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <LayoutDashboard size={20} />
                            </Link>
                            <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/community" className="text-gray-300 hover:text-white transition-colors font-medium hover:bg-white/5 px-4 py-2 rounded-lg">Explore</Link>
                            <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium hover:bg-white/5 px-4 py-2 rounded-lg">Login</Link>
                            <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5">Get Started</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-5">
                    {token ? (
                        <>
                            <Link to="/generate" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-primary to-accent text-white p-3 rounded-xl font-bold text-center flex justify-center items-center gap-2">
                                Create New <Sparkles size={18} />
                            </Link>
                            <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-xl flex items-center gap-3">
                                <Globe size={20} /> Community
                            </Link>
                            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-xl flex items-center gap-3">
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>
                            <button onClick={handleLogout} className="text-red-400 hover:bg-red-500/10 p-3 rounded-xl flex items-center gap-3 text-left">
                                <LogOut size={20} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-xl font-medium">Explore</Link>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-white p-3 hover:bg-white/5 rounded-xl font-medium">Login</Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-black p-3 rounded-xl font-bold text-center">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
