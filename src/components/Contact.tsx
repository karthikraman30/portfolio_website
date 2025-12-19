import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, Linkedin, Github, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { siteContent } from '@/data/content';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
    const containerRef = useRef<HTMLElement>(null);
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { title, subtitle, description, form, social } = siteContent.contact;

    useGSAP(
        () => {
            gsap.from('.contact-content', {
                scrollTrigger: {
                    trigger: '.contact-content',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out',
            });

            gsap.from('.contact-form-element', {
                scrollTrigger: {
                    trigger: '.contact-form',
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.6,
                ease: 'power3.out',
            });
        },
        { scope: containerRef }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    name: formState.name,
                    email: formState.email,
                    message: formState.message,
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            setIsSubmitted(true);
            setFormState({ name: '', email: '', message: '' });
            setTimeout(() => setIsSubmitted(false), 3000);
        } catch (err) {
            console.error('EmailJS error:', err);
            setError('Failed to send message. Please try again or email me directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormState((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        // Clear error when user starts typing again
        if (error) setError(null);
    };

    const socialLinks = [
        { icon: Mail, href: `mailto:${social.email}`, label: 'Email' },
        { icon: Linkedin, href: social.linkedin, label: 'LinkedIn' },
        { icon: Github, href: social.github, label: 'GitHub' },
    ];

    return (
        <section
            id="contact"
            ref={containerRef}
            className="section relative overflow-hidden scroll-mt-20"
            style={{ minHeight: 'auto', paddingBottom: '4rem' }}
        >
            {/* Background */}
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#D2FF00] rounded-full blur-[250px] opacity-5" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00FFFF] rounded-full blur-[250px] opacity-5" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="contact-content text-center mb-16">
                    <h2 className="section-title">{title}</h2>
                    <p className="section-subtitle mx-auto mt-4">{subtitle}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left - Contact Info */}
                    <div className="contact-content space-y-8">
                        <p className="text-lg text-[#B4B4B4] leading-relaxed">{description}</p>

                        {/* Social Links */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Connect with me</h3>
                            <div className="flex flex-wrap gap-4">
                                {socialLinks.map((link, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            variant="ghost"
                                            asChild
                                            className="px-5 py-3 h-auto bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D2FF00]/50"
                                        >
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3"
                                            >
                                                <link.icon className="w-5 h-5 text-[#B4B4B4]" />
                                                <span className="text-sm text-[#B4B4B4]">
                                                    {link.label}
                                                </span>
                                            </a>
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* Right - Contact Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        className="contact-form"
                    >
                        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                            <CardContent className="p-8 space-y-6">
                                {/* Name Field */}
                                <div className="contact-form-element space-y-2">
                                    <Label htmlFor="name" className="text-white">
                                        {form.nameLabel}
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        placeholder={form.namePlaceholder}
                                        required
                                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6B6B6B] focus-visible:border-[#D2FF00] focus-visible:ring-[#D2FF00]/20"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="contact-form-element space-y-2">
                                    <Label htmlFor="email" className="text-white">
                                        {form.emailLabel}
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formState.email}
                                        onChange={handleChange}
                                        placeholder={form.emailPlaceholder}
                                        required
                                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6B6B6B] focus-visible:border-[#D2FF00] focus-visible:ring-[#D2FF00]/20"
                                    />
                                </div>

                                {/* Message Field */}
                                <div className="contact-form-element space-y-2">
                                    <Label htmlFor="message" className="text-white">
                                        {form.messageLabel}
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formState.message}
                                        onChange={handleChange}
                                        placeholder={form.messagePlaceholder}
                                        required
                                        rows={5}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-[#6B6B6B] focus-visible:border-[#D2FF00] focus-visible:ring-[#D2FF00]/20 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <motion.div
                                    className="contact-form-element"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || isSubmitted}
                                        className="w-full bg-[#D2FF00] text-[#0A0A0F] hover:bg-[#D2FF00]/90 font-semibold py-6"
                                        size="lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : isSubmitted ? (
                                            <>
                                                <CheckCircle size={18} />
                                                Sent!
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                {form.submitButton}
                                            </>
                                        )}
                                    </Button>
                                </motion.div>

                                {/* Success Message */}
                                {isSubmitted && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center text-sm text-[#00FF88]"
                                    >
                                        {form.successMessage}
                                    </motion.p>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-center gap-2 text-sm text-red-400"
                                    >
                                        <AlertCircle size={16} />
                                        <p>{error}</p>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
