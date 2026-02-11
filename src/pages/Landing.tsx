import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { useEffect } from 'react';

export default function Landing() {
  useEffect(() => {
    console.info('[Landing] Component mounted');
  }, []);

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
