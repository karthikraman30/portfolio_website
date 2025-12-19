import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '@/data/content';


import { JourneyCards } from '@/components/JourneyCards';

gsap.registerPlugin(ScrollTrigger);

export function About() {
    const containerRef = useRef<HTMLElement>(null);
    const { title, paragraphs, timeline } = siteContent.about;

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
            className="section relative overflow-hidden min-h-0 pb-12 scroll-mt-20 border-0"
        >
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00FFFF] rounded-full blur-[200px] opacity-5" />

            <div className="max-w-6xl mx-auto">
                {/* Title */}
                <h2 className="about-title section-title mb-16">{title}</h2>

                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 xl:gap-20">
                    {/* Left Column - Bio */}
                    <div className="about-content space-y-8">
                        {paragraphs.map((paragraph, i) => (
                            <p
                                key={i}
                                className="about-paragraph text-base md:text-lg text-[#B4B4B4]"
                                style={{ lineHeight: '1.85' }}
                                dangerouslySetInnerHTML={{ __html: paragraph }}
                            />
                        ))}
                    </div>

                    {/* Right Column - Journey */}
                    <div>
                        {/* Journey Cards */}
                        <div className="mt-14 pt-10 relative border-t border-white/10">
                            <h3 className="text-xl font-semibold text-white mb-8">My Journey</h3>
                            <JourneyCards items={timeline} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}