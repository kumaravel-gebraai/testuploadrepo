import FadeIn from "../../FadeIn";

export default function CTATeams() {
  return (
    <section className="theme-brand bg-[hsl(var(--bg-canvas))] py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-primary)/0.05)] via-transparent to-[hsl(var(--color-primary)/0.03)]" aria-hidden="true" />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
              Ready to Build a Powerful Marketing Team?
            </h2>
            <p className="text-lg md:text-xl text-[hsl(var(--text-muted))] leading-relaxed mb-10 max-w-2xl mx-auto">
              Start your free trial today. No credit card required. Invite your team and start collaborating in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="https://app.geteverloop.com/signup" 
                className="inline-flex items-center justify-center rounded-[var(--radius-btn)] bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-fg))] px-8 py-3.5 font-semibold shadow-lg shadow-[hsl(var(--color-primary)/.25)] hover:opacity-90 transition-all duration-300"
              >
                Start Free Trial
              </a>
              <a 
                href="/about" 
                className="inline-flex items-center justify-center rounded-[var(--radius-btn)] px-8 py-3.5 font-semibold text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-heading))] transition-all duration-300"
              >
                Contact Sales
              </a>
            </div>
            <p className="text-sm text-[hsl(var(--text-muted))] mt-6">
              Join 500+ marketing teams already growing with Everloop
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
