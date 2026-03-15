import FadeIn from "../../FadeIn";

export default function CTAAbout() {
  return (
    <section className="theme-brand bg-[hsl(var(--bg-canvas))] py-24 md:py-32 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-primary)/0.05)] via-transparent to-[hsl(var(--color-primary)/0.03)]" aria-hidden="true" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <FadeIn>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-[hsl(var(--text-heading))] mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed mb-8 max-w-2xl mx-auto">
            Join the growth teams already using Everloop to automate their funnel and ship campaigns 3-5x faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://geteverloop.com" 
              className="inline-flex items-center justify-center rounded-[var(--radius-btn)] bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-fg))] px-8 py-3.5 font-semibold shadow-lg shadow-[hsl(var(--color-primary)/.25)] hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </a>
            <a 
              href="https://geteverloop.com/demo" 
              className="inline-flex items-center justify-center rounded-[var(--radius-btn)] border border-[hsl(var(--border-subtle))] bg-surface px-8 py-3.5 font-semibold text-[hsl(var(--text-heading))] hover:border-[hsl(var(--color-primary)/.4)] transition-colors"
            >
              Book a Demo
            </a>
          </div>
          <p className="text-sm text-[hsl(var(--text-muted))] mt-6">
            No credit card required • Setup in minutes • Cancel anytime
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
