import FadeIn from "../../FadeIn";

export default function WorkflowSection() {
  const steps = [
    {
      number: "01",
      title: "Invite Your Team",
      description: "Add team members with custom roles and permissions. Set up departments, assign leads, and define approval workflows."
    },
    {
      number: "02",
      title: "Collaborate on Campaigns",
      description: "Work together in real-time on AI-generated campaigns. Comment, suggest edits, and approve content without email chains."
    },
    {
      number: "03",
      title: "Share AI Insights",
      description: "Access unified analytics dashboards. Every team member sees the same performance data, recommendations, and opportunities."
    },
    {
      number: "04",
      title: "Scale with Confidence",
      description: "Launch campaigns faster with automated workflows. Track accountability, measure ROI, and grow your marketing impact."
    }
  ];

  return (
    <section className="bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
              How Teams Work Better with Everloop
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed">
              From onboarding to scaling, our platform is designed for seamless team collaboration at every stage.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <FadeIn key={i} delay={i * 100} variant="up">
              <div className="relative">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-[hsl(var(--color-primary)/.1)] text-[hsl(var(--color-primary-text))] flex items-center justify-center">
                      <span className="text-2xl font-bold">{step.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-[hsl(var(--text-heading))] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[hsl(var(--text-muted))] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
