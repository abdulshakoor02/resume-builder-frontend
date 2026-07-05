"use client";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SocialProofSection from "@/components/SocialProofSection";
import BuilderSection from "@/components/BuilderSection";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <SocialProofSection />
      <BuilderSection />
    </main>
  );
}
