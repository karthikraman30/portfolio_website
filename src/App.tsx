import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import { LoadingScreen } from '@/components/LoadingScreen';
import { Navigation } from '@/components/Navigation';
import Particles from '@/components/Particles';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { siteContent } from '@/data/content';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Update ScrollTrigger on scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Add lenis to GSAP tick
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable smooth scroll while loading
    if (isLoading) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, [isLoading]);

  // Update document title
  useEffect(() => {
    document.title = siteContent.meta.title;
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Particle Background - Always visible as page background */}
      {!isLoading && (
        <Particles
          particleCount={150}
          particleSpread={8}
          speed={0.05}
          particleColors={['#ffffff', '#f0f0f0', '#e0e0e0']}
          moveParticlesOnHover={true}
          particleHoverFactor={0.5}
          alphaParticles={true}
          particleBaseSize={80}
          sizeRandomness={0.8}
          cameraDistance={25}
          className="!fixed !inset-0 !w-screen !h-screen !z-[-1]"
        />
      )}

      <div className="relative min-h-screen">
        {/* Loading Screen */}
        <LoadingScreen isLoading={isLoading} onLoadingComplete={handleLoadingComplete} />

        {/* Main Content */}
        {!isLoading && (
          <>
            {/* Navigation */}
            <Navigation />

            {/* Main Sections */}
            <main>
              <Hero />
              <About />
              <Skills />
              <Projects />
              <Contact />
            </main>

            {/* Footer */}
            <Footer />
          </>
        )}
      </div>
    </>
  );
}

export default App;
