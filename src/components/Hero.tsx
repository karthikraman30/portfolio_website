import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteContent } from '@/data/content';

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const { greeting, name, tagline, subtitle, cta } = siteContent.hero;

    useGSAP(
        () => {
            const tl = gsap.timeline({ delay: 2.8 });

            // Animate greeting
            tl.from('.hero-greeting', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Animate name with stagger
            tl.from(
                '.hero-name .char',
                {
                    opacity: 0,
                    y: 50,
                    rotateX: -90,
                    stagger: 0.04,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                },
                '-=0.4'
            );

            // Animate subtitle
            tl.from(
                '.hero-subtitle',
                {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    ease: 'power3.out',
                },
                '-=0.2'
            );

            // Animate tagline
            tl.from(
                '.hero-tagline',
                {
                    opacity: 0,
                    y: 20,
                    filter: 'blur(10px)',
                    duration: 0.8,
                    ease: 'power3.out',
                },
                '-=0.3'
            );

            // Animate buttons
            tl.from(
                '.hero-cta',
                {
                    opacity: 0,
                    y: 30,
                    stagger: 0.15,
                    duration: 0.6,
                    ease: 'power3.out',
                },
                '-=0.4'
            );

            // Animate scroll indicator
            tl.from(
                '.scroll-indicator',
                {
                    opacity: 0,
                    y: -20,
                    duration: 0.6,
                    ease: 'power3.out',
                },
                '-=0.2'
            );
        },
        { scope: containerRef }
    );

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Split name into characters for stagger animation
    const nameChars = name.split('').map((char, i) => (
        <span key={i} className="char inline-block">
            {char === ' ' ? '\u00A0' : char}
        </span>
    ));

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden border-0"
        >
            {/* Grid background */}
            <div className="absolute inset-0 grid-bg opacity-30" />

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D2FF00] rounded-full blur-[150px] opacity-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF00FF] rounded-full blur-[150px] opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FFFF] rounded-full blur-[200px] opacity-5" />

            {/* Main content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Greeting */}
                <p className="hero-greeting text-lg md:text-xl text-[#B4B4B4] mb-4 font-mono">
                    {greeting}
                </p>

                {/* Name with glitch effect */}
                <h1
                    ref={titleRef}
                    className="hero-name text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
                >
                    <span
                        className="glitch inline-block"
                        data-text={name}
                        style={{ color: '#D2FF00' }}
                    >
                        {nameChars}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="hero-subtitle text-lg md:text-xl text-[#00FFFF] mb-6 font-medium">
                    {subtitle}
                </p>

                {/* Tagline */}
                <p className="hero-tagline text-lg md:text-xl text-[#B4B4B4] max-w-2xl mx-auto mb-10 leading-relaxed">
                    {tagline}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.div
                        className="hero-cta"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            size="lg"
                            className="bg-[#D2FF00] text-[#0A0A0F] hover:bg-[#D2FF00]/90 font-semibold px-8 py-6 text-base"
                            onClick={() => scrollToSection(cta.primary.scrollTo)}
                        >
                            {cta.primary.text}
                        </Button>
                    </motion.div>
                    <motion.div
                        className="hero-cta"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-[#D2FF00] hover:text-white font-semibold px-8 py-6 text-base"
                            onClick={() => scrollToSection(cta.secondary.scrollTo)}
                        >
                            {cta.secondary.text}
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="scroll-indicator absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => scrollToSection('about')}
                whileHover={{ y: 5 }}
            >
                <span className="text-sm text-[#6B6B6B] font-mono">Scroll to explore</span>
                <ChevronDown className="text-[#D2FF00] animate-bounce" size={24} />
            </motion.div>
        </section>
    );
}
