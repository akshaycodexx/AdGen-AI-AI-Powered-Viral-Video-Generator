import { useState } from 'react';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import { Loader2, Copy, Check, Video, FileText, Sparkles } from 'lucide-react';
import LoadingOverlay from '../components/LoadingOverlay';

const Generator = () => {
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        targetAudience: '',
        tone: 'Professional',
        customPrompt: ''
    });
    const [useCustomPrompt, setUseCustomPrompt] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [generatingVideo, setGeneratingVideo] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setResult(null);
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : null;

            const res = await axios.post('/gemini/generate', {
                ...formData,
                userId
            });
            setResult(res.data.script);
        } catch (error) {
            console.error(error);
            alert('Failed to generate script');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const text = `Hook: ${result.hook}\n\nScenes:\n${result.scenes.map((s, i) => `Scene ${i + 1}: ${s.visual} (Audio: ${s.audio})`).join('\n')}\n\nCTA: ${result.cta}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateImageValues = (description) => {
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(description)}?width=1080&height=1920&nologo=true`;
    };

    const handleDownloadPDF = () => {
        if (!result) return;

        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.setTextColor(99, 102, 241); // Primary Color
        doc.text("Video Ad Concept", 20, 20);

        // Product Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Product: ${formData.productName || 'Custom'}`, 20, 35);
        doc.text(`Target Audience: ${formData.targetAudience || 'General'}`, 20, 42);
        doc.text(`Tone: ${formData.tone}`, 20, 49);

        // Hook
        doc.setFillColor(240, 240, 255);
        doc.roundedRect(20, 55, 170, 25, 3, 3, 'F');
        doc.setFontSize(14);
        doc.setTextColor(168, 85, 247); // Secondary Color
        doc.text("Viral Hook:", 25, 65);
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        const hookLines = doc.splitTextToSize(result.hook, 160);
        doc.text(hookLines, 25, 72);

        let yPos = 90;

        // Scenes
        result.scenes.forEach((scene, index) => {
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(`Scene ${index + 1} (${scene.seconds}s)`, 20, yPos);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const visualLines = doc.splitTextToSize(`Visual: ${scene.visual}`, 170);
            doc.text(visualLines, 20, yPos + 7);

            const audioLines = doc.splitTextToSize(`Audio: "${scene.audio}"`, 170);
            doc.text(audioLines, 20, yPos + 7 + (visualLines.length * 5));

            yPos += 15 + ((visualLines.length + audioLines.length) * 5);
        });

        // CTA
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFillColor(224, 242, 254); // Light Blue
        doc.roundedRect(20, yPos, 170, 20, 3, 3, 'F');
        doc.setFontSize(12);
        doc.setTextColor(34, 211, 238); // Accent Color
        doc.text("Call to Action:", 25, yPos + 8);
        doc.setTextColor(0, 0, 0);
        doc.text(result.cta, 25, yPos + 15);

        doc.save(`${formData.productName || 'ad_concept'}_script.pdf`);
    };

    const generateVideo = async () => {
        if (!result) return;
        setGeneratingVideo(true);

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1920;
            const ctx = canvas.getContext('2d');
            const stream = canvas.captureStream(30);
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                setGeneratingVideo(false);
            };

            mediaRecorder.start();

            for (const scene of result.scenes) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = generateImageValues(scene.visual);
                await new Promise(r => img.onload = r);

                // Speak Audio
                if (window.speechSynthesis) {
                    const utterance = new SpeechSynthesisUtterance(scene.audio);
                    window.speechSynthesis.speak(utterance);
                }

                const duration = scene.seconds * 1000;
                const startTime = Date.now();

                while (Date.now() - startTime < duration) {
                    ctx.drawImage(img, 0, 0, 1080, 1920);

                    ctx.font = 'bold 60px Arial';
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 4;
                    ctx.textAlign = 'center';
                    wrapText(ctx, scene.audio, 540, 1500, 900, 70);

                    await new Promise(r => requestAnimationFrame(r));
                }
            }

            mediaRecorder.stop();
        } catch (e) {
            console.error(e);
            alert("Could not generate video preview");
            setGeneratingVideo(false);
        }
    };

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.strokeText(line, x, y);
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.strokeText(line, x, y);
        context.fillText(line, x, y);
    }

    return (
        <div className="min-h-[calc(100vh-64px)] pt-32 p-4 md:p-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto relative mt-15">
            <AnimatePresence>
                {loading && <LoadingOverlay />}
            </AnimatePresence>

            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full md:w-1/3 space-y-6"
            >
                <div className="glass-panel p-6 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2"><span className="bg-primary w-2 h-8 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></span> Ad Details</span>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setUseCustomPrompt(false)} className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${!useCustomPrompt ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Guided</button>
                            <button type="button" onClick={() => setUseCustomPrompt(true)} className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${useCustomPrompt ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Custom Prompt</button>
                        </div>
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {useCustomPrompt ? (
                            <div>
                                <label className="block text-gray-300 mb-1 text-sm font-medium">Your Vision</label>
                                <textarea
                                    name="customPrompt"
                                    required
                                    rows="6"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-300 text-white resize-none placeholder-gray-500 hover:bg-black/30 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                    value={formData.customPrompt}
                                    onChange={handleChange}
                                    placeholder="Make a high energy TikTok style video for a new energy drink..."
                                />
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-gray-300 mb-1 text-sm font-medium">Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        required={!useCustomPrompt}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-300 text-white placeholder-gray-500 hover:bg-black/30 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                        value={formData.productName}
                                        onChange={handleChange}
                                        placeholder="e.g. SmartFit Watch"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1 text-sm font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        required={!useCustomPrompt}
                                        rows="3"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-300 text-white resize-none placeholder-gray-500 hover:bg-black/30 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe your product's key features..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1 text-sm font-medium">Target Audience</label>
                                    <input
                                        type="text"
                                        name="targetAudience"
                                        required={!useCustomPrompt}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-300 text-white placeholder-gray-500 hover:bg-black/30 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                        value={formData.targetAudience}
                                        onChange={handleChange}
                                        placeholder="e.g. Fitness enthusiasts, Gen Z"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-1 text-sm font-medium">Tone</label>
                                    <div className="relative">
                                        <select
                                            name="tone"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all duration-300 text-white appearance-none hover:bg-black/30 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] cursor-pointer"
                                            value={formData.tone}
                                            onChange={handleChange}
                                        >
                                            <option className="bg-background text-white">Professional</option>
                                            <option className="bg-background text-white">Funny</option>
                                            <option className="bg-background text-white">Emotional</option>
                                            <option className="bg-background text-white">Hype / Energetic</option>
                                            <option className="bg-background text-white">Educational</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}
                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 rounded-xl transition-all duration-300 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate Magic ✨'}
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Output Section */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full md:w-2/3"
            >
                <div className="glass-panel p-6 rounded-2xl h-full min-h-[600px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span className="bg-accent w-2 h-8 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"></span>
                            Generated Result
                        </h2>
                        {result && (
                            <div className="flex gap-2">
                                <button
                                    onClick={generateVideo}
                                    disabled={generatingVideo}
                                    className="bg-green-600/20 border border-green-500/50 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-50"
                                >
                                    {generatingVideo ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />}
                                    {generatingVideo ? 'Rendering...' : 'Make Video'}
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/30 text-purple-400 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
                                >
                                    <FileText size={16} />
                                    PDF
                                </button>
                                <button
                                    onClick={handleCopy}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
                                >
                                    {copied ? <><Check size={16} className="text-green-400" /> Copied</> : <><Copy size={16} /> Copy</>}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-black/30 rounded-xl p-6 flex-grow overflow-auto border border-white/5 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-6">
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                <p className="animate-pulse text-lg font-medium text-gray-400">Crafting your viral masterpiece...</p>
                            </div>
                        ) : result ? (
                            <div className="space-y-8">
                                {videoUrl && (
                                    <div className="mb-8 p-4 glass-panel rounded-xl border-green-500/20">
                                        <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">🎬 Generated Video</h3>
                                        <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-green-900/20 aspect-[9/16] w-full max-w-xs mx-auto">
                                            <video src={videoUrl} controls className="w-full h-full object-cover" autoPlay></video>
                                        </div>
                                        <a href={videoUrl} download="ad_video.webm" className="block text-center mt-4 text-sm font-medium text-green-400 hover:text-green-300 transition-colors">Download Video ⬇️</a>
                                    </div>
                                )}

                                <div className="glass-purple p-5 rounded-xl border border-secondary/30">
                                    <h3 className="text-secondary font-bold mb-2 text-sm uppercase tracking-wider">🔥 Viral Hook</h3>
                                    <p className="text-xl text-white font-medium leading-relaxed">{result.hook}</p>
                                </div>

                                <div className="space-y-6">
                                    {result.scenes.map((scene, index) => (
                                        <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-6 hover:bg-white/10 transition-colors">
                                            <div className="w-full md:w-1/3 aspect-[9/16] md:aspect-video bg-black/50 rounded-lg overflow-hidden relative group shadow-lg">
                                                <img
                                                    src={generateImageValues(scene.visual)}
                                                    alt={`Scene ${index + 1}`}
                                                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                                    <span className="text-xs text-white font-medium">Generated Scene {index + 1}</span>
                                                </div>
                                            </div>
                                            <div className="w-full md:w-2/3 flex flex-col justify-center gap-2">
                                                <h4 className="text-blue-400 text-xs font-bold uppercase tracking-widest bg-blue-500/10 self-start px-2 py-1 rounded">Scene {index + 1} • {scene.seconds}s</h4>
                                                <p className="text-gray-200 font-medium text-lg">{scene.visual}</p>
                                                <div className="flex items-start gap-2 text-gray-400 text-sm mt-1 bg-black/20 p-2 rounded-lg">
                                                    <span className="mt-1">🎙️</span>
                                                    <span className="italic">"{scene.audio}"</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="glass-blue p-5 rounded-xl border border-blue-500/30">
                                    <h3 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider">📢 Call to Action</h3>
                                    <p className="text-xl text-white font-medium">{result.cta}</p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {result.hashtags.map((tag, i) => (
                                        <span key={i} className="text-gray-300 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10 hover:border-primary/50 hover:text-primary transition-colors cursor-default">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <span className="text-2xl">✨</span>
                                </div>
                                <p>Fill out the details and hit generate!</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Generator;
