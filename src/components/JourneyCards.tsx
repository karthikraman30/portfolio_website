import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Building2, Briefcase } from 'lucide-react';

interface TimelineItem {
    id: string;
    title: string;
    institution: string;
    period: string;
    description: string;
    color: string;
}

interface JourneyCardsProps {
    items: TimelineItem[];
}

const iconMap = {
    school: GraduationCap,
    college: Building2,
    work: Briefcase,
};

export function JourneyCards({ items }: JourneyCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {items.map((item, index) => {
                const Icon = iconMap[item.id as keyof typeof iconMap] || GraduationCap;

                return (
                    <motion.div
                        key={item.id}
                        className="h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 }
                        }}
                    >
                        <Card
                            className="h-full group relative overflow-hidden bg-[#111115] border-0 hover:shadow-2xl transition-all duration-300"
                            style={{
                                boxShadow: `0 0 0 1px ${item.color}20`,
                            }}
                        >
                            {/* Gradient border on hover */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{
                                    background: `linear-gradient(135deg, ${item.color}30, transparent 50%)`,
                                }}
                            />

                            {/* Glow effect */}
                            <div
                                className="absolute -inset-1 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300"
                                style={{ backgroundColor: item.color }}
                            />

                            <CardContent className="relative p-6 text-center space-y-3">
                                {/* Icon */}
                                <div
                                    className="mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: `${item.color}20`,
                                        border: `1px solid ${item.color}40`
                                    }}
                                >
                                    <Icon
                                        className="w-6 h-6 transition-colors duration-300"
                                        style={{ color: item.color }}
                                    />
                                </div>

                                {/* Title */}
                                <h4
                                    className="text-lg font-bold transition-colors duration-300"
                                    style={{ color: item.color }}
                                >
                                    {item.title}
                                </h4>

                                {/* Institution Name */}
                                <p className="text-sm text-white/90 font-medium">
                                    {item.institution}
                                </p>

                                {/* Period */}
                                <p className="text-xs text-[#B4B4B4]">
                                    {item.period}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default JourneyCards;
