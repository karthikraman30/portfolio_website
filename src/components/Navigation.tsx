import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { siteContent } from '@/data/content';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import GooeyNav from '@/components/GooeyNav';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const { links, logo } = siteContent.navigation;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Update active section
            const sections = links.map((link) => link.href.slice(1));
            const current = sections.find((section) => {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [links]);

    const scrollToSection = (href: string) => {
        const id = href.startsWith('#') ? href.slice(1) : href;
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    // Get initial active index based on current section
    const getInitialActiveIndex = () => {
        const index = links.findIndex((link) => link.href.slice(1) === activeSection);
        return index >= 0 ? index : 0;
    };

    return (
        <>
            {/* Desktop Navigation */}
            <motion.nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    scrolled ? 'glass-dark' : 'bg-transparent'
                )}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="max-w-7xl mx-auto px-8 md:px-12 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <motion.a
                        href="#hero"
                        className="text-2xl font-bold neon-text"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('#hero');
                        }}
                    >
                        {logo}
                    </motion.a>

                    {/* Desktop Links - GooeyNav */}
                    <div className="hidden md:block">
                        <GooeyNav
                            items={links}
                            initialActiveIndex={getInitialActiveIndex()}
                            onItemClick={(href) => scrollToSection(href)}
                            animationTime={600}
                            particleCount={12}
                            particleDistances={[70, 10]}
                            particleR={80}
                            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
                        />
                    </div>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-white hover:bg-white/10"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu size={24} />
                    </Button>
                </div>
            </motion.nav>

            {/* Mobile Menu Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent
                    side="right"
                    className="w-full sm:w-[400px] bg-[#0A0A0F]/95 backdrop-blur-xl border-l-white/10"
                >
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold text-[#D2FF00] neon-text">
                            {logo}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col items-start gap-6 mt-8">
                        {links.map((link, i) => (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-2xl font-bold transition-colors',
                                    activeSection === link.href.slice(1)
                                        ? 'text-[#D2FF00] neon-text'
                                        : 'text-white hover:text-[#D2FF00]'
                                )}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(link.href);
                                }}
                            >
                                {link.label}
                            </motion.a>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
