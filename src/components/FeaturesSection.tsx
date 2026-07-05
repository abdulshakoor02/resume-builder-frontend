"use client";

const features = [
  {
    title: "AI-Powered",
    description:
      "Describe your experience in plain language and let AI craft a professional resume tailored to your strengths.",
  },
  {
    title: "Beautiful Templates",
    description:
      "Get a clean, modern, ATS-friendly resume design that stands out without looking generic.",
  },
  {
    title: "Iterate & Refine",
    description:
      "Chat with AI to refine every section. Tweak wording, reorder experience, and perfect your story.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16">
      <div className="section-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display text-ink-primary">
            Everything you need to land the job
          </h2>
          <p className="mt-2 text-ink-secondary">
            Our AI handles the formatting so you can focus on what matters — your experience
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {features.map((feature, i) => (
            <div
              key={i}
              className="card p-6 hover:border-accent/30 transition-colors duration-300"
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-ink-primary">{feature.title}</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
