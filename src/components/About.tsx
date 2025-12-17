import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '@/data/content';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timeline3D } from '@/components/Timeline3D';

gsap.registerPlugin(ScrollTrigger);

export function About() {
    const containerRef = useRef<HTMLElement>(null);
    const { title, paragraphs, technologiesLabel, technologies, stats, timeline } = siteContent.about;

    useGSAP(
        () => {
            // Animate title
            gsap.from('.about-title', {
                scrollTrigger: {
                    trigger: '.about-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Animate paragraphs with stagger
            gsap.from('.about-paragraph', {
                scrollTrigger: {
                    trigger: '.about-content',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Animate stats
            gsap.from('.about-stat', {
                scrollTrigger: {
                    trigger: '.about-stats',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                scale: 0.8,
                stagger: 0.1,
                duration: 0.6,
                ease: 'back.out(1.7)',
            });

            // Animate technologies
            gsap.from('.tech-badge', {
                scrollTrigger: {
                    trigger: '.tech-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                scale: 0.5,
                stagger: 0.05,
                duration: 0.4,
                ease: 'back.out(1.7)',
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            id="about"
            ref={containerRef}
            className="section relative overflow-hidden"
        >
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FFFF] rounded-full blur-[200px] opacity-5" />

            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <h2 className="about-title section-title mb-16">{title}</h2>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column - Bio */}
                    <div className="about-content space-y-6">
                        {paragraphs.map((paragraph, i) => (
                            <p
                                key={i}
                                className="about-paragraph text-lg text-[#B4B4B4] leading-relaxed"
                            >
                                {paragraph}
                            </p>
                        ))}

                        {/* Stats Grid */}
                        <div className="about-stats grid grid-cols-2 gap-4 pt-8">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="about-stat"
                                    whileHover={{ scale: 1.05, rotate: 1 }}
                                >
                                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                                        <CardContent className="p-6 text-center">
                                            <div className="text-3xl md:text-4xl font-bold text-[#D2FF00] mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-[#B4B4B4]">{stat.label}</div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Technologies */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-white">
                            {technologiesLabel}
                        </h3>

                        <div className="tech-grid flex flex-wrap gap-3">
                            {technologies.map((tech, i) => (
                                <motion.div
                                    key={i}
                                    className="tech-badge"
                                    whileHover={{
                                        scale: 1.1,
                                        boxShadow: '0 0 20px rgba(210, 255, 0, 0.3)',
                                    }}
                                >
                                    <Badge
                                        variant="outline"
                                        className="px-4 py-2 text-sm font-medium text-[#D2FF00] border-[#D2FF00]/30 bg-transparent hover:bg-[#D2FF00]/10"
                                    >
                                        {tech}
                                    </Badge>
                                </motion.div>
                            ))}
                        </div>

                        {/* 3D Timeline */}
                        <div className="mt-12 relative">
                            <h3 className="text-xl font-semibold mb-4 text-white">My Journey</h3>
                            <Card className="bg-[#111115] border-0 p-4 gradient-border overflow-hidden">
                                <Timeline3D items={timeline} />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
