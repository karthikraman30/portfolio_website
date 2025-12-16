import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter, Mail, Heart, Coffee } from 'lucide-react';
import { siteContent } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function Footer() {
    const { footer, social } = siteContent.contact;

    const socialLinks = [
        { icon: Mail, href: `mailto:${social.email}` },
        { icon: Linkedin, href: social.linkedin },
        { icon: Github, href: social.github },
        { icon: Twitter, href: social.twitter },
    ];

    return (
        <footer className="relative py-12 border-t border-white/5">
            {/* Background */}
            <div className="absolute inset-0 grid-bg opacity-10" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo & Tagline */}
                    <div className="text-center md:text-left">
                        <motion.div
                            className="text-3xl font-bold chrome-text mb-2"
                            whileHover={{ scale: 1.05 }}
                        >
                            KR
                        </motion.div>
                        <p className="text-sm text-[#6B6B6B] flex items-center gap-1 justify-center md:justify-start">
                            Crafted with <Heart size={14} className="text-[#FF0080] fill-[#FF0080]" /> and{' '}
                            <Coffee size={14} className="text-[#D2FF00]" />
                        </p>
                    </div>

                    {/* 3D Rotating Element */}
                    <motion.div
                        className="w-20 h-20 relative"
                        animate={{ rotateY: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        style={{ perspective: 200 }}
                    >
                        <div
                            className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#D2FF00] to-[#00FFFF] opacity-20"
                            style={{ transform: 'rotateY(0deg) translateZ(10px)' }}
                        />
                        <div
                            className="absolute inset-0 rounded-lg border-2 border-[#D2FF00]/30"
                            style={{ transform: 'rotateY(45deg)' }}
                        />
                        <div
                            className="absolute inset-0 rounded-lg border-2 border-[#00FFFF]/30"
                            style={{ transform: 'rotateY(90deg)' }}
                        />
                        <div
                            className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#D2FF00]"
                        >
                            {'</>'}
                        </div>
                    </motion.div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((link, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -4, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className="w-10 h-10 bg-white/5 border border-white/10 text-[#B4B4B4] hover:text-[#D2FF00] hover:bg-white/10"
                                >
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <link.icon size={18} />
                                    </a>
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <Separator className="my-8 bg-white/5" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    <p className="text-[#6B6B6B]">{footer.copyright}</p>

                    <div className="flex items-center gap-2">
                        <span className="text-[#6B6B6B]">{footer.builtWith}</span>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Badge
                                variant="outline"
                                className="text-xs bg-[#D2FF00]/10 text-[#D2FF00] border-[#D2FF00]/30"
                            >
                                v1.0
                            </Badge>
                        </motion.div>
                    </div>
                </div>

                {/* Easter egg - subtle code reference */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-[#333] font-mono tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-default">
                        {'/* console.log("Thanks for checking the source!"); */'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
