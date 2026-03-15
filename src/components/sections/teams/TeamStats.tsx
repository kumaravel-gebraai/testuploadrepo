import FadeIn from "../../FadeIn";

export default function TeamStats() {
  const stats = [
    {
      value: "3x",
      label: "Faster Campaign Launches",
      description: "Teams ship campaigns 3x faster with unified workflows"
    },
    {
      value: "47%",
      label: "Reduction in Approval Time",
      description: "Real-time collaboration cuts approval cycles by half"
    },
    {
      value: "92%",
      label: "Team Adoption Rate",
      description: "Marketing teams love our intuitive collaboration tools"
    },
    {
      value: "100%",
      label: "Data Visibility",
      description: "Every team member works from the same insights"
    }
  ];

  return (
    <section className="theme-alt bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
              Teams That Work Together Win Together
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed">
              Marketing teams using Everloop see measurable improvements in speed, efficiency, and collaboration quality.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 100} variant="scale">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold tracking-tight text-[hsl(var(--color-primary-text))] mb-3">
                  {stat.value}
                </div>
                <div className="text-xl font-semibold text-[hsl(var(--text-heading))] mb-2">
                  {stat.label}
                </div>
                <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
