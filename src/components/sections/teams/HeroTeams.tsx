import FadeIn from "../../FadeIn";

export default function HeroTeams() {
  return (
    <section className="bg-[hsl(var(--bg-canvas))] py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--text-heading) / .15) 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--color-primary)/0.08)] blur-[120px]" aria-hidden="true" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block rounded-[var(--radius-btn)] bg-[hsl(var(--color-primary)/.1)] text-[hsl(var(--color-primary))] text-xs font-semibold px-3 py-1 mb-6">
              Team Collaboration
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
              Build Powerful Teams with AI Marketing test test
            </h1>
            <p className="text-lg md:text-xl text-[hsl(var(--text-muted))] leading-relaxed mb-10 max-w-3xl mx-auto">
              Empower your marketing team to collaborate seamlessly, move faster, and achieve more with unified AI-powered automation. Scale campaigns, share insights, and drive growth together.
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
                Learn More
              </a>
            </div>
            <p className="text-sm text-[hsl(var(--text-muted))] mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
