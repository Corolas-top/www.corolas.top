import { Navbar } from '@/components/Navbar';
import { Footer } from '@/sections/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { privacyContent } from '@/data/content';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <section className="py-20 lg:py-24">
          <div className="max-w-[800px] mx-auto px-6">
            <ScrollReveal>
              <h2
                className="font-display font-semibold text-corolas-text mb-4"
                style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Privacy Policy
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-corolas-text-secondary text-lg leading-relaxed mb-12">
                We are committed to protecting your privacy across all Corolas projects.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Accordion type="single" collapsible className="space-y-4">
                {privacyContent.map((item) => (
                  <AccordionItem
                    key={item.projectId}
                    value={item.projectId}
                    className="border rounded-lg px-6"
                    style={{ borderColor: 'rgba(212, 175, 55, 0.12)' }}
                  >
                    <AccordionTrigger className="font-display font-semibold text-corolas-text text-lg hover:text-corolas-gold hover:no-underline py-5">
                      {item.projectName}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div
                        className="text-corolas-text-secondary text-sm leading-relaxed whitespace-pre-line"
                      >
                        {item.content}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
