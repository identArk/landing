import { Helmet } from "react-helmet-async";
import { useNavScrolled } from "@/hooks/useNavScroll";
import { useReveal } from "@/hooks/useReveal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { Plausible } from "@/components/Plausible";
import { CodeSwapSection } from "./CodeSwapSection";
import { CtaSection } from "./CtaSection";
import { EmailCapture } from "./EmailCapture";
import { FaqSection } from "./FaqSection";
import { FeaturesSection } from "./FeaturesSection";
import { GovernanceSection } from "./GovernanceSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { IntegrationsSection } from "./IntegrationsSection";
import { LandingFooter } from "./LandingFooter";
import { LandingNav } from "./LandingNav";
import { PrinciplesStrip } from "./PrinciplesStrip";
import { PricingSection } from "./PricingSection";
import { TrustBar } from "./TrustBar";

export function HomePage() {
  const scrolled = useNavScrolled();
  useReveal();
  useSmoothScroll();

  return (
    <>
      <Helmet>
        <title>IdentArk — Agent Governance Platform | Human-in-the-Loop for AI Agents</title>
        <meta
          name="description"
          content="IdentArk is the agent governance platform for regulated industries. Human-in-the-loop approval, 6-factor risk scoring, and immutable audit trails for AI agents. EU AI Act compliant."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://identark.io/" />
        <meta property="og:title" content="IdentArk — Agent Governance Platform | Human-in-the-Loop for AI Agents" />
        <meta property="og:description" content="Deploy AI agents with governance. Risk-scored operations, human approval, and cryptographic audit trails." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Plausible />

      <div className="banner">
        IdentArk v1.2.0 — streaming + n8n adapter now on PyPI &nbsp;
        <a href="https://github.com/identark/identark/releases" target="_blank" rel="noopener noreferrer">
          Read the release →
        </a>
      </div>

      <LandingNav scrolled={scrolled} />

      <main>
        <HeroSection />
        <PrinciplesStrip />
        <TrustBar />
        <CodeSwapSection />
        <HowItWorksSection />
        <GovernanceSection />
        <FeaturesSection />
        <IntegrationsSection />
        <PricingSection />
        <FaqSection />
        <EmailCapture />
        <CtaSection />
      </main>

      <LandingFooter />
    </>
  );
}
