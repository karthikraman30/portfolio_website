import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Code2,
    Wrench,
    Cpu,
    Database,
    Users,
    Rocket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { siteContent, type SkillCategory } from '@/data/content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, LucideIcon> = {
    Code2,
    Wrench,
    Cpu,
    Database,
    Users,
    Rocket,
};

export function Skills() {
    const containerRef = useRef<HTMLElement>(null);
    const { title, subtitle, categories } = siteContent.skills;

    useGSAP(
        () => {
            // Animate title
            gsap.from('.skills-title', {
                scrollTrigger: {
                    trigger: '.skills-title',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Animate cards with stagger
            gsap.from('.skill-card', {
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 80,
                scale: 0.9,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power3.out',
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            id="skills"
            ref={containerRef}
            className="section relative overflow-hidden"
        >
            {/* Background gradients */}
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-[#FF00FF] rounded-full blur-[200px] opacity-5" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#D2FF00] rounded-full blur-[200px] opacity-5" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="skills-title section-title">{title}</h2>
                    <p className="skills-title section-subtitle mx-auto mt-4">{subtitle}</p>
                </div>

                {/* Skills Grid */}
                <div className="skills-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category, i) => (
                        <SkillCard key={i} category={category} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface SkillCardProps {
    category: SkillCategory;
    index: number;
}

function SkillCard({ category, index }: SkillCardProps) {
    const Icon = iconMap[category.iconName] || Code2;

    // Different gradient for each card
    const gradients = [
        'from-cyan-400/20 to-blue-500/20',
        'from-purple-500/20 to-indigo-500/20',
        'from-pink-500/20 to-rose-500/20',
        'from-amber-400/20 to-orange-500/20',
        'from-emerald-400/20 to-teal-500/20',
        'from-blue-400/20 to-cyan-500/20',
    ];

    const borderColors = [
        'hover:border-cyan-400/50',
        'hover:border-purple-500/50',
        'hover:border-pink-500/50',
        'hover:border-amber-400/50',
        'hover:border-emerald-400/50',
        'hover:border-blue-400/50',
    ];

    return (
        <motion.div
            className="skill-card"
            whileHover={{
                y: -8,
                transition: { duration: 0.3 },
            }}
        >
            <Card className={`bg-white/5 backdrop-blur-xl border-white/10 ${borderColors[index % 6]} transition-all duration-300 h-full relative overflow-hidden`}>
                <CardHeader className="pb-2">
                    {/* Icon */}
                    <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[index % 6]} flex items-center justify-center mb-2`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                        <Icon
                            className="w-7 h-7"
                            style={{ color: getIconColor(index) }}
                        />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-white">{category.title}</CardTitle>
                    <CardDescription className="text-[#B4B4B4] line-clamp-2">
                        {category.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2">
                        {category.items.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{
                                    scale: 1.05,
                                }}
                            >
                                <Badge
                                    variant="outline"
                                    className="px-3 py-1 text-xs font-medium bg-white/5 text-[#B4B4B4] border-white/10 hover:bg-[#D2FF00]/10 hover:text-[#D2FF00] hover:border-[#D2FF00]/30 transition-colors"
                                >
                                    {item}
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>

                {/* Hover shine effect */}
                <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
                    }}
                    whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
                    transition={{ duration: 0.6 }}
                />
            </Card>
        </motion.div>
    );
}

function getIconColor(index: number): string {
    const colors = ['#00FFFF', '#A855F7', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
    return colors[index % colors.length];
}
