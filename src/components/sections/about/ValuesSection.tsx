import FadeIn from "../../FadeIn";

export default function ValuesSection() {
  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "Speed Over Perfection",
      description: "We ship fast, iterate faster, and believe momentum beats polish. AI marketing moves at the speed of data—so do we."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      title: "Bold Experimentation",
      description: "We test aggressively, fail forward, and treat every campaign as a learning opportunity. Comfort zones are where growth dies."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      title: "Customer-First Automation",
      description: "AI should amplify human creativity, not replace it. We build tools that free marketers to focus on strategy, not spreadsheets."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      ),
      title: "Continuous Innovation",
      description: "The best marketing platform is the one that's always evolving. We ship new AI capabilities weekly, not quarterly."
    }
  ];

  return (
    <section className="theme-inverse bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[hsl(var(--text-heading))] mb-6">
              Our Values
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed max-w-3xl mx-auto">
              These principles guide how we build, ship, and support our customers every day.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, i) => (
            <FadeIn key={i} delay={i * 100} variant="up">
              <div className="bg-surface rounded-2xl p-8 border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--color-primary)/.3)] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-[hsl(var(--color-primary)/.1)] text-[hsl(var(--color-primary-text))] flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[hsl(var(--text-heading))] mb-3">
                  {value.title}
                </h3>
                <p className="text-sm text-[hsl(var(--text-main))] leading-relaxed">
                  {value.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
