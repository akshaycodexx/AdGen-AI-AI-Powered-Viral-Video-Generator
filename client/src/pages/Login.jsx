import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10"></div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                <h2 className="text-4xl font-bold mb-6 text-center text-white font-sans tracking-tight">Welcome Back</h2>
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 mb-1.5 text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition text-white placeholder-gray-500 hover:bg-black/40"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1.5 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition text-white placeholder-gray-500 hover:bg-black/40"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-3.5 rounded-xl transition-all duration-300 mt-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5">
                        Log In
                    </button>
                </form>
                <p className="mt-8 text-center text-gray-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-secondary hover:text-white transition-colors font-medium hover:underline">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
