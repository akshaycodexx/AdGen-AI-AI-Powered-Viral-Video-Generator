import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

const steps = [
    "Analyzing Product Details... 🔍",
    "Brainstorming Viral Angles... 🧠",
    "Writing Hook & Script... ✍️",
    "Designing Visual Scenes... 🎨",
    "Finalizing Magic... ✨"
];

const LoadingOverlay = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-50 rounded-2xl border border-white/10"
        >
            <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-secondary animate-pulse" size={32} />
                </div>
            </div>

            <div className="h-8 relative overflow-hidden flex justify-center items-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center absolute"
                    >
                        {steps[currentStep]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default LoadingOverlay;
