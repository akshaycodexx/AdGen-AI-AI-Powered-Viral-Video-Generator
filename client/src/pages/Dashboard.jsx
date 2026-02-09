import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { FileText, Calendar, Trash2, Globe } from 'lucide-react';

const Dashboard = () => {
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) return;
                const userId = JSON.parse(userStr).id;

                const res = await axios.get(`/scripts/user/${userId}`);
                setScripts(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchScripts();
    }, []);

    const togglePublic = async (id, currentStatus) => {
        try {
            await axios.put(`/scripts/${id}/public`);
            setScripts(scripts.map(s => s._id === id ? { ...s, isPublic: !currentStatus } : s));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] pt-32 p-4 md:p-8 max-w-7xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-10 flex items-center gap-3 tracking-tight"
            >
                <span className="bg-gradient-to-t from-primary to-secondary w-2 h-10 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"></span>
                Your Creations
            </motion.h1>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-panel h-64 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : scripts.length === 0 ? (
                <div className="text-center text-gray-500 py-24 glass-panel rounded-3xl border-dashed border-2 border-white/5">
                    <FileText size={64} className="mx-auto mb-6 opacity-20" />
                    <h3 className="text-2xl font-bold text-gray-300 mb-2">No scripts yet</h3>
                    <p className="text-lg mb-6">Start your viral journey today.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {scripts.map((script, index) => (
                        <motion.div
                            key={script._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10 group relative overflow-hidden flex flex-col h-full"
                        >
                            <div className="absolute top-0 right-0 flex">
                                <button
                                    onClick={() => togglePublic(script._id, script.isPublic)}
                                    className={`text-xs px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 border-b border-l border-white/5 transition-colors ${script.isPublic ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                                >
                                    <Globe size={12} />
                                    {script.isPublic ? 'Public' : 'Private'}
                                </button>
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-white line-clamp-1 group-hover:text-primary transition-colors mt-2">{script.productName}</h3>
                            <p className="text-sm text-gray-400 mb-5 line-clamp-2 min-h-[40px]">{script.description}</p>

                            <div className="bg-black/30 p-4 rounded-xl text-xs text-gray-300 font-mono h-40 overflow-hidden relative mb-5 border border-white/5 group-hover:border-white/10 transition-colors">
                                {script.generatedScript}
                                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/90 to-transparent"></div>
                            </div>

                            <div className="flex gap-2 mt-auto">
                                <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full border border-primary/20 font-medium">{script.tone}</span>
                                <span className="bg-accent/10 text-accent text-xs px-3 py-1 rounded-full border border-accent/20 font-medium">{script.targetAudience}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
