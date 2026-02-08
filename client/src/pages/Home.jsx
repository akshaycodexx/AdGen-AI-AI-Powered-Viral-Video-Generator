import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video, Zap, TrendingUp, Sparkles, Wand2, Smartphone, Globe, Layers, ArrowRight, BarChart3, Bot, Fingerprint } from 'lucide-react';

const Home = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <div className="relative min-h-screen pt-20 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none"></div>

            {/* HERO SECTION */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">

                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 text-center lg:text-left"
                >
                    <div className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-secondary animate-float-slow shadow-[0_0_20px_rgba(0,194,255,0.15)] hover:bg-white/10 transition-colors cursor-default">
                        <Sparkles size={16} className="text-secondary animate-pulse" />
                        <span className="tracking-wide uppercase text-xs font-bold">The Future of Content Creation</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1]">
                        <span className="block text-white mb-2">Create Viral</span>
                        <span className="text-gradient-primary">Masterpieces</span>
                    </h1>

                    <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Stop guessing. Start dominating. Our AI engineer scripts, visuals, and hooks tailored for <span className="text-white font-medium">maximum retention</span> on TikTok & Reels.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                        <Link to="/generate" className="relative group px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg overflow-hidden transition-transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                            <span className="relative z-10 flex items-center gap-2">Start Creating <ArrowRight size={20} /></span>
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </Link>
                        <Link to="/community" className="px-8 py-4 glass-panel rounded-2xl font-bold text-lg text-white hover:bg-white/5 transition-colors border border-white/10 flex items-center gap-2 justify-center">
                            <Globe size={20} /> Explore Community
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Trusted by creators on</span>
                        <div className="flex gap-6">
                            <div className="h-6 w-6 bg-white rounded-full"></div>
                            <div className="h-6 w-6 bg-gray-400 rounded-lg"></div>
                            <div className="h-6 w-8 bg-gray-500 rounded-md"></div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Content - HOLOGRAPHIC INTERFACE */}
                <motion.div
                    style={{ y: y1 }}
                    className="flex-1 relative w-full max-w-[500px] lg:max-w-none perspective-1000"
                >
                    <div className="relative z-10 transform rotate-y-[-10deg] rotate-x-6 transition-transform duration-700 ease-out hover:rotate-0">
                        {/* Main Glass Card - The AI Interface */}
                        <div className="relative mx-auto w-full aspect-[4/5] max-w-[420px] glass-panel rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,194,255,0.1)] overflow-hidden flex flex-col">

                            {/* Interface Header */}
                            <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <Bot size={20} className="text-primary" />
                                    <span className="font-mono text-xs text-primary tracking-widest uppercase">AdGen Core v2.0</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                            </div>

                            {/* Interface Body - Typing Animation */}
                            <div className="flex-1 p-8 font-mono text-sm leading-relaxed text-gray-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>

                                <div className="mb-6 opacity-50">
                                    <span className="text-blue-400">user@adgen:~$</span> generate viral_script --topic "AI productivity"
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    <p className="mb-4"><span className="text-green-400">✔</span> Analysis Complete (Trend #429)</p>
                                    <p className="mb-4"><span className="text-green-400">✔</span> Hook Identified: "Stop Wasting Time"</p>

                                    <div className="pl-4 border-l-2 border-white/10 my-6">
                                        <p className="text-white mb-2 font-bold">Scene 1 [0:00-0:05]</p>
                                        <p className="italic text-gray-400">"If you're still writing emails manually in 2026, you're literally losing money. Here's why..."</p>
                                    </div>

                                    <div className="pl-4 border-l-2 border-white/10">
                                        <p className="text-white mb-2 font-bold">Visual Cue</p>
                                        <p className="italic text-gray-400">Fast paced screen recording of AI tool automating inbox zero.</p>
                                    </div>
                                </motion.div>

                                {/* Cursor Blinking */}
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="inline-block w-2.5 h-4 bg-primary ml-1 align-middle mt-4"
                                ></motion.div>
                            </div>

                            {/* Interface Footer */}
                            <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Viral Probability Score</span>
                                    <span className="text-2xl font-bold text-white">98<span className="text-sm text-gray-500">/100</span></span>
                                </div>
                                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "98%" }}
                                        transition={{ delay: 0.5, duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-gradient-to-r from-primary to-accent"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Floating 3D Elements */}
                        <motion.div
                            animate={{ y: [-20, 20, -20] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-12 glass-card p-4 rounded-xl flex items-center gap-3 z-20 border-l-4 border-l-green-500"
                        >
                            <div className="text-xs font-bold uppercase text-gray-400">ROI Forecast</div>
                            <div className="text-lg font-bold text-white font-mono">+12.4k Views</div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [15, -15, 15] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-8 bottom-20 glass-card p-4 rounded-xl flex items-center gap-3 z-20 border-l-4 border-l-purple-500"
                        >
                            <Fingerprint size={20} className="text-purple-400" />
                            <div className="text-sm font-bold text-white">Digital Fingerprint Verified</div>
                        </motion.div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
                </motion.div>
            </div>

            {/* BENTO GRID FEATURES SECTION */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Designed for <span className="text-gradient-primary">Virality</span></h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to create high-performing short-form content, packed into one powerful AI dashboard.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                    {/* Large Card - Left */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="md:col-span-2 glass-card rounded-3xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <div className="bg-primary/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <Wand2 size={28} />
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Instant Script Generation</h3>
                            <p className="text-gray-400 text-lg max-w-md">Our specialized LLM generates scene-by-scene breakdowns, visual cues, and voiceover scripts perfectly timed for 15-60s videos.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-all duration-500 transform translate-x-1/4 translate-y-1/4">
                            <Wand2 size={400} />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </motion.div>

                    {/* Tall Card - Right (REPLACED MOBILE CARD WITH GROWTH ENGINE) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="md:row-span-2 glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden group"
                    >
                        <div className="bg-green-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-green-400">
                            <BarChart3 size={28} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Growth Engine</h3>
                        <p className="text-gray-400 mb-8">Data-backed insights to maximize retention and click-through rates.</p>

                        <div className="mt-auto relative h-64 w-full bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-end justify-between p-6 gap-2">
                            {/* Animated Bar Chart */}
                            {[40, 70, 50, 90, 60, 85, 100].map((height, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${height}%` }}
                                    transition={{ delay: i * 0.1, duration: 1, ease: "easeOut" }}
                                    className="w-full bg-gradient-to-t from-green-900 to-green-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                ></motion.div>
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none"></div>
                    </motion.div>

                    {/* Small Card - Bottom Left 1 */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="bg-yellow-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-yellow-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Trend Analysis</h3>
                        <p className="text-gray-400 text-sm">Real-time hook suggestions based on current trends.</p>
                    </motion.div>

                    {/* Small Card - Bottom Left 2 */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="glass-card rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="bg-pink-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-pink-400">
                            <Layers size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Multi-Format</h3>
                        <p className="text-gray-400 text-sm">Export to PDF, Text, or direct Video render.</p>
                    </motion.div>
                </div>
            </div>

            {/* MARQUEE SECTION */}
            <div className="py-20 bg-black/20 border-y border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Powering Next-Gen Creators</p>
                </div>
                <div className="flex gap-20 items-center justify-center opacity-40 grayscale animate-float-slow">
                    {/* Placeholder Logos for "God Level" aesthetic */}
                    <h3 className="text-3xl font-serif italic text-white/50">Vogue</h3>
                    <h3 className="text-3xl font-serif text-white/50 font-bold">WIRED</h3>
                    <h3 className="text-3xl font-sans text-white/50 font-black">THE VERGE</h3>
                    <h3 className="text-3xl font-mono text-white/50">Vice</h3>
                    <h3 className="text-3xl font-serif italic text-white/50">Vogue</h3>
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="py-32 text-center relative max-w-4xl mx-auto px-4">
                <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
                <h2 className="text-5xl md:text-7xl font-bold mb-8">Ready to go <br /><span className="text-gradient-primary">Viral?</span></h2>
                <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                    Get Started Now <Sparkles size={24} />
                </Link>
            </div>
        </div>
    );
};

export default Home;
