import FadeIn from "../../FadeIn";

export default function TestimonialsTeams() {
  const testimonials = [
    {
      quote: "Everloop transformed how our team collaborates on campaigns. We went from weeks of back-and-forth to launching in days. The role-based permissions give us the control we need without slowing anyone down.",
      author: "Sarah Chen",
      role: "VP of Marketing",
      company: "TechFlow"
    },
    {
      quote: "The unified AI insights are a game-changer. Everyone on the team sees the same data and recommendations, so we're all aligned on strategy. No more siloed reporting or conflicting metrics.",
      author: "Marcus Williams",
      role: "Growth Lead",
      company: "ScaleUp Inc"
    },
    {
      quote: "We've scaled from 3 to 15 marketers without losing efficiency. Everloop's workflows and dashboards keep everyone accountable and moving fast. Best team collaboration tool we've ever used.",
      author: "Emily Rodriguez",
      role: "Director of Marketing",
      company: "Momentum Labs"
    }
  ];

  return (
    <section className="bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
              Loved by Marketing Teams
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed">
              See how marketing leaders are using Everloop to build high-performing teams that ship faster and achieve more.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <FadeIn key={i} delay={i * 100} variant="up">
              <div className="bg-surface rounded-2xl p-8 border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--color-primary)/.3)] hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="flex-1">
                  <svg className="w-10 h-10 text-[hsl(var(--color-primary-text))] mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[hsl(var(--text-main))] leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-[hsl(var(--text-heading))]">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-[hsl(var(--text-muted))]">
                    {testimonial.role}, {testimonial.company}
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
