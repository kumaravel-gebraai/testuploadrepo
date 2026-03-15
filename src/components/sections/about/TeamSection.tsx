import FadeIn from "../../FadeIn";

export default function TeamSection() {
  const team = [
    {
      name: "Marketing Technologists",
      role: "Founding Team",
      bio: "Built and scaled growth engines at high-velocity startups. Experienced the pain of manual workflows firsthand.",
      gradient: "from-purple-500/10 to-blue-500/10"
    },
    {
      name: "AI Engineers",
      role: "Platform Team",
      bio: "Experts in autonomous agents, LLM optimization, and real-time decisioning systems. Pushing the boundaries of what AI can automate.",
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      name: "Growth Operators",
      role: "Customer Success",
      bio: "Former in-house marketers who've run campaigns at scale. We speak your language and solve your problems.",
      gradient: "from-cyan-500/10 to-teal-500/10"
    }
  ];

  return (
    <section className="bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[hsl(var(--text-heading))] mb-6">
              Meet the Team
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed max-w-3xl mx-auto">
              Led by marketing technologists who've built and scaled high-growth companies. We've been in your shoes—and we're here to make your job easier.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <FadeIn key={i} delay={i * 100} variant="up">
              <div className="bg-surface rounded-2xl p-8 border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--color-primary)/.3)] hover:shadow-lg transition-all duration-300">
                <div className={`aspect-square rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center mb-6`}>
                  <svg className="w-16 h-16 text-[hsl(var(--color-primary)/.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[hsl(var(--text-heading))] mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-[hsl(var(--color-primary-text))] font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-[hsl(var(--text-main))] leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
