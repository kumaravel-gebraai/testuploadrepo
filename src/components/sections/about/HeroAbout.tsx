import FadeIn from "../../FadeIn";

export default function HeroAbout() {
  return (
    <section className="bg-[hsl(var(--bg-canvas))] py-24 md:py-32 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--text-heading) / .15) 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--color-primary)/0.08)] blur-[120px]" aria-hidden="true" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <FadeIn>
          <div className="inline-block rounded-[var(--radius-btn)] bg-[hsl(var(--color-primary)/.1)] text-[hsl(var(--color-primary-text))] text-xs font-semibold px-3 py-1 mb-6">
            About Everloop
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
            How We're Revolutionizing AI Marketing
          </h1>
          <p className="text-lg md:text-xl text-[hsl(var(--text-muted))] leading-relaxed max-w-3xl mx-auto">
            We're on a mission to eliminate manual marketing workflows and unlock growth at scale. Built by marketing technologists who've scaled high-growth companies, Everloop makes AI marketing accessible for teams of all sizes.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
