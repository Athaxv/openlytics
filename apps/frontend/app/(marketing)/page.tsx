import { FeaturesBento } from "@/components/marketing/features-bento";
import { FinalCta } from "@/components/marketing/final-cta";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";

export default function LandingPage() {
  return (
    <>
      <MarketingNav />
      <main id="main-content">
        <MarketingHero />
        <FeaturesBento />
        <ProductShowcase />
        <HowItWorks />
        <TestimonialsSection />
        <FinalCta />
      </main>
      <MarketingFooter />
    </>
  );
}
