import FadeIn from "../../FadeIn";

export default function StorySection() {
  const milestones = [
    {
      year: "2023",
      title: "The Beginning",
      description: "Founded by marketing technologists frustrated with manual campaign workflows and slow optimization cycles."
    },
    {
      year: "2024",
      title: "AI-Native Platform Launch",
      description: "Released the first truly autonomous marketing platform—agents that run discovery, ads, and retention without human intervention."
    },
    {
      year: "Today",
      title: "Scaling Growth Teams",
      description: "Helping hundreds of companies automate their entire funnel and achieve 3-5x faster campaign execution."
    }
  ];

  return (
    <section className="bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[hsl(var(--text-heading))] mb-6">
              Our Story
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed max-w-3xl mx-auto">
              We've lived the pain of scaling marketing teams. Every manual workflow, every slow optimization cycle, every missed opportunity—we built Everloop to solve it.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[hsl(var(--border-subtle))]" aria-hidden="true" />
          
          <div className="space-y-12">
            {milestones.map((milestone, i) => (
              <FadeIn key={i} delay={i * 150} variant="up">
                <div className={`relative grid md:grid-cols-2 gap-8 items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className={`${i % 2 === 0 ? 'md:text-right' : 'md:col-start-2'}`}>
                    <div className="inline-block rounded-[var(--radius-btn)] bg-[hsl(var(--color-primary)/.1)] text-[hsl(var(--color-primary-text))] text-sm font-semibold px-3 py-1 mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-[hsl(var(--text-heading))] mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-[hsl(var(--text-main))] leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[hsl(var(--color-primary))] border-4 border-[hsl(var(--bg-canvas))]" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
