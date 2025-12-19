import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Wrench, Cpu, Database, Users, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { siteContent } from '@/data/content';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Code2,
    Wrench,
    Cpu,
    Database,
    Users,
    Rocket,
};

export function Skills() {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
            },
        },
    };

    return (
        <section
            ref={ref}
            id="skills"
            className="relative pt-12 pb-24 px-4 md:px-8 overflow-hidden scroll-mt-20"
        >
            {/* Section Header */}
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-4"
                >
                    What I Bring to the Table
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="section-title mb-4"
                >
                    {siteContent.skills.title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-gray-400 text-lg max-w-2xl mx-auto"
                >
                    {siteContent.skills.subtitle}
                </motion.p>
            </div>

            {/* Skills Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {siteContent.skills.categories.map((category, index) => {
                    const IconComponent = iconMap[category.iconName] || Code2;

                    return (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

                                {/* Icon */}
                                <div className={`relative z-10 w-12 h-12 rounded-xl bg-gradient-to-br ${category.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent className="w-6 h-6 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="relative z-10 text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                                    {category.title}
                                </h3>

                                {/* Description */}
                                <p className="relative z-10 text-gray-400 text-sm mb-4 leading-relaxed">
                                    {category.description}
                                </p>

                                {/* Skills Tags */}
                                <div className="relative z-10 flex flex-wrap gap-2">
                                    {category.items.map((item, itemIndex) => (
                                        <span
                                            key={itemIndex}
                                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-200"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>

                                {/* Corner accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        </section>
    );
}
