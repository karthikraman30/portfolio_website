import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';
import { siteContent, type Project } from '@/data/content';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
    const containerRef = useRef<HTMLElement>(null);
    const { title, subtitle, items } = siteContent.projects;

    useGSAP(
        () => {
            // Animate title with fade effect
            gsap.from('.projects-title', {
                scrollTrigger: {
                    trigger: '.projects-header',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 30,
                duration: 1,
                ease: 'power3.out',
            });

            // Animate subtitle with fade effect (slightly delayed)
            gsap.from('.projects-subtitle', {
                scrollTrigger: {
                    trigger: '.projects-header',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 20,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out',
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            id="projects"
            ref={containerRef}
            className="relative py-16 scroll-mt-20"
        >
            {/* Background */}
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF00FF] rounded-full blur-[300px] opacity-5" />

            {/* Header */}
            <div className="projects-header max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="projects-title section-title">{title}</h2>
                <p className="projects-subtitle section-subtitle mt-4">{subtitle}</p>
            </div>

            {/* Vertical Stack */}
            <div className="max-w-6xl mx-auto px-6 space-y-24">
                {items.map((project, i) => (
                    <ProjectCard
                        key={i}
                        project={project}
                        index={i}
                        isReversed={i % 2 === 1}
                    />
                ))}
            </div>
        </section>
    );
}

interface ProjectCardProps {
    project: Project;
    index: number;
    isReversed: boolean;
}

function ProjectCard({ project, index, isReversed }: ProjectCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Parallax effect for the image
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    return (
        <motion.div
            ref={cardRef}
            className="relative"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
        >
            <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}>
                {/* Image with Parallax */}
                <motion.div
                    className="relative w-full lg:w-3/5 overflow-hidden rounded-2xl group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Gradient Border */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF00FF]/30 via-transparent to-[#00FFFF]/30 p-[1px]">
                        <div className="w-full h-full rounded-2xl bg-[#0A0A0F]" />
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-2xl">
                        <motion.img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            style={{
                                y: imageY,
                                scale: imageScale,
                            }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/80 via-transparent to-transparent" />

                        {/* Scanlines */}
                        <div className="scanlines absolute inset-0 opacity-20" />

                        {/* Hover Glow */}
                        <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                            style={{
                                background: 'radial-gradient(circle at center, #FF00FF 0%, transparent 70%)',
                            }}
                        />

                        {/* Featured Badge on Image */}
                        {project.featured && (
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-[#D2FF00] text-[#0A0A0F] hover:bg-[#D2FF00]/90 font-bold px-3 py-1">
                                    FEATURED
                                </Badge>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Content */}
                <div className="w-full lg:w-2/5 space-y-5">
                    {/* Project Number */}
                    <motion.span
                        className="text-6xl font-bold text-white/5"
                        initial={{ opacity: 0, x: isReversed ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        0{index + 1}
                    </motion.span>

                    {/* Title */}
                    <motion.h3
                        className="text-2xl lg:text-3xl font-bold text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {project.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                        className="text-[#B4B4B4] leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {project.description}
                    </motion.p>

                    {/* Tech Stack */}
                    <motion.div
                        className="flex flex-wrap gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        {project.tech.map((tech, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.1, y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1 text-sm font-medium bg-white/5 text-[#00FFFF] border-[#00FFFF]/30 hover:bg-[#00FFFF]/10 hover:border-[#00FFFF]/50"
                                >
                                    {tech}
                                </Badge>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Links */}
                    <motion.div
                        className="flex gap-6 pt-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        {project.demoUrl && (
                            <Button
                                variant="link"
                                asChild
                                className="p-0 h-auto text-[#D2FF00] hover:text-[#D2FF00]/80 text-base font-medium"
                            >
                                <motion.a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink size={18} />
                                    Live Demo
                                </motion.a>
                            </Button>
                        )}
                        {project.githubUrl && (
                            <Button
                                variant="link"
                                asChild
                                className="p-0 h-auto text-[#B4B4B4] hover:text-white text-base font-medium"
                            >
                                <motion.a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ x: 5 }}
                                    className="flex items-center gap-2"
                                >
                                    <Github size={18} />
                                    Source Code
                                </motion.a>
                            </Button>
                        )}
                        {!project.demoUrl && !project.githubUrl && (
                            <span className="text-sm text-[#6B6B6B] italic">Private project</span>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Decorative Line */}
            {index < 3 && (
                <motion.div
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-[#00FFFF]/30 to-transparent"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                />
            )}
        </motion.div>
    );
}
