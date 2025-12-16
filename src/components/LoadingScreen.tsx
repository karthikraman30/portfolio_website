import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { siteContent } from '@/data/content';
import { Progress } from '@/components/ui/progress';

interface LoadingScreenProps {
    isLoading: boolean;
    onLoadingComplete: () => void;
}

export function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
    const messageIndex = useRef(0);
    const messages = siteContent.loading.messages;
    const [progress, setProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState(messages[0]);

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                onLoadingComplete();
            }, 2800);
            return () => clearTimeout(timer);
        }
    }, [isLoading, onLoadingComplete]);

    // Progress animation
    useEffect(() => {
        if (isLoading) {
            const duration = 2500;
            const interval = 16;
            const increment = 100 / (duration / interval);

            const timer = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + increment;
                    return next >= 100 ? 100 : next;
                });
            }, interval);

            return () => clearInterval(timer);
        }
    }, [isLoading]);

    // Message cycling
    useEffect(() => {
        const interval = setInterval(() => {
            messageIndex.current = (messageIndex.current + 1) % messages.length;
            setCurrentMessage(messages[messageIndex.current]);
        }, 400);
        return () => clearInterval(interval);
    }, [messages]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0F]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    {/* Grid background */}
                    <div className="absolute inset-0 grid-bg opacity-30" />

                    {/* Glowing orb */}
                    <motion.div
                        className="absolute w-[400px] h-[400px] rounded-full opacity-20"
                        style={{
                            background: 'radial-gradient(circle, #D2FF00 0%, transparent 70%)',
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Main content */}
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        {/* Logo */}
                        <motion.div
                            className="text-6xl md:text-8xl font-bold"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="chrome-text">KR</span>
                        </motion.div>

                        {/* Loading message */}
                        <motion.p
                            className="text-[#B4B4B4] text-lg font-mono"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {currentMessage}
                        </motion.p>

                        {/* Progress bar using shadcn */}
                        <div className="w-64 md:w-80">
                            <Progress
                                value={progress}
                                className="h-1 bg-white/10 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-[#D2FF00] [&>[data-slot=progress-indicator]]:to-[#00FFFF]"
                            />
                        </div>

                        {/* Counter */}
                        <motion.div
                            className="font-mono text-sm text-[#D2FF00]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {Math.floor(progress)}%
                        </motion.div>
                    </div>

                    {/* Scanlines overlay */}
                    <div className="scanlines absolute inset-0 pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
