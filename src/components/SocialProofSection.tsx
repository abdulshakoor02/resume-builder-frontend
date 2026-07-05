export default function SocialProofSection() {
  const stats = [
    { value: "10,000+", label: "Resumes Created" },
    { value: "ATS-Optimized", label: "Format Ready" },
    { value: "4.8/5", label: "User Rating" },
  ];

  return (
    <section className="border-t border-b border-border">
      <div className="section-container py-10">
        <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-display text-accent">{stat.value}</p>
              <p className="text-sm text-ink-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
