import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';
import { siteContent, type Project } from '@/data/content';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
    const containerRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { title, subtitle, items } = siteContent.projects;

    useGSAP(
        () => {
            // Animate title
            gsap.from('.projects-title', {
                scrollTrigger: {
                    trigger: '.projects-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Horizontal scroll animation
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const scrollWidth = scrollContainer.scrollWidth - scrollContainer.offsetWidth;

                gsap.to(scrollContainer, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 20%',
                        end: () => `+=${scrollWidth}`,
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                    },
                    scrollLeft: scrollWidth,
                    ease: 'none',
                });
            }
        },
        { scope: containerRef }
    );

    return (
        <section
            id="projects"
            ref={containerRef}
            className="relative min-h-screen py-20 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF00FF] rounded-full blur-[300px] opacity-5" />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h2 className="projects-title section-title">{title}</h2>
                <p className="projects-title section-subtitle mt-4">{subtitle}</p>
            </div>

            {/* Horizontal Scroll Gallery */}
            <div
                ref={scrollContainerRef}
                className="flex gap-8 px-6 overflow-x-auto scrollbar-hide"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {/* Spacer for centering */}
                <div className="flex-shrink-0 w-[10vw]" />

                {items.map((project, i) => (
                    <ProjectCard key={i} project={project} index={i} />
                ))}

                {/* Spacer for centering */}
                <div className="flex-shrink-0 w-[10vw]" />
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
                <p className="text-sm text-[#6B6B6B] font-mono">← Scroll to explore projects →</p>
            </div>
        </section>
    );
}

interface ProjectCardProps {
    project: Project;
    index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            className="flex-shrink-0 w-[80vw] max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="overflow-hidden h-full bg-transparent border-0 gradient-border">
                    <div className="relative group">
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden">
                            <motion.img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/50 to-transparent" />

                            {/* Scanlines */}
                            <div className="scanlines absolute inset-0 opacity-30" />

                            {/* Glitch effect on hover */}
                            <motion.div
                                className="absolute inset-0 mix-blend-color-dodge opacity-0 group-hover:opacity-20"
                                style={{
                                    background:
                                        'linear-gradient(45deg, #FF00FF 0%, transparent 50%, #00FFFF 100%)',
                                }}
                                animate={{
                                    x: [0, 5, -5, 0],
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>

                        {/* Content */}
                        <CardContent className="p-6 bg-[#111115]">
                            {/* Featured badge */}
                            {project.featured && (
                                <Badge className="mb-3 bg-[#D2FF00] text-[#0A0A0F] hover:bg-[#D2FF00]/90 font-bold">
                                    FEATURED
                                </Badge>
                            )}

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#D2FF00] transition-colors">
                                {project.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[#B4B4B4] mb-4 line-clamp-3">{project.description}</p>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tech.map((tech, i) => (
                                    <motion.div key={i} whileHover={{ scale: 1.1 }}>
                                        <Badge
                                            variant="outline"
                                            className="px-3 py-1 text-xs font-medium bg-white/5 text-[#00FFFF] border-[#00FFFF]/30 hover:bg-[#00FFFF]/10"
                                        >
                                            {tech}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex gap-4">
                                {project.demoUrl && (
                                    <Button
                                        variant="link"
                                        asChild
                                        className="p-0 h-auto text-[#D2FF00] hover:text-[#D2FF00]/80"
                                    >
                                        <motion.a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ x: 5 }}
                                        >
                                            <ExternalLink size={16} className="mr-2" />
                                            Live Demo
                                        </motion.a>
                                    </Button>
                                )}
                                {project.githubUrl && (
                                    <Button
                                        variant="link"
                                        asChild
                                        className="p-0 h-auto text-[#B4B4B4] hover:text-white"
                                    >
                                        <motion.a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ x: 5 }}
                                        >
                                            <Github size={16} className="mr-2" />
                                            Source Code
                                        </motion.a>
                                    </Button>
                                )}
                                {!project.demoUrl && !project.githubUrl && (
                                    <span className="text-sm text-[#6B6B6B] italic">Private project</span>
                                )}
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
