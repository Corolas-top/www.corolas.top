import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/sections/HeroSection';
import { PhilosophySection } from '@/sections/PhilosophySection';
import { ProjectsSection } from '@/sections/ProjectsSection';
import { TeamSection } from '@/sections/TeamSection';
import { CTASection } from '@/sections/CTASection';
import { Footer } from '@/sections/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PhilosophySection />
        <ProjectsSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
