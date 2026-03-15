import FadeIn from "../../FadeIn";

export default function MissionSection() {
  return (
    <section className="theme-alt bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[hsl(var(--text-heading))] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-[hsl(var(--text-main))] leading-relaxed mb-6">
                Founded to eliminate manual marketing workflows and unlock growth at scale, Everloop automates the entire funnel—from discovery and ads to conversion and retention.
              </p>
              <p className="text-lg text-[hsl(var(--text-main))] leading-relaxed">
                We believe AI marketing shouldn't be reserved for enterprises. Every growth team deserves tools that are always on, always optimizing, and built for speed.
              </p>
            </div>
            <div className="bg-surface rounded-2xl p-12 border border-[hsl(var(--border-subtle))] shadow-[0_4px_24px_hsl(var(--color-primary)/.08)]">
              <div className="space-y-8">
                <div>
                  <div className="text-5xl md:text-6xl font-bold tracking-tight text-[hsl(var(--color-primary-text))] mb-2">
                    3-5x
                  </div>
                  <p className="text-sm text-[hsl(var(--text-muted))]">
                    Faster campaign execution for our customers
                  </p>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold tracking-tight text-[hsl(var(--color-primary-text))] mb-2">
                    24/7
                  </div>
                  <p className="text-sm text-[hsl(var(--text-muted))]">
                    AI agents working to optimize your growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
