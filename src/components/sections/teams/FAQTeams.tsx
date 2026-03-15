import FadeIn from "../../FadeIn";

export default function FAQTeams() {
  const faqs = [
    {
      question: "How many team members can I add?",
      answer: "Our free plan includes up to 3 team members. Paid plans offer unlimited team members with tiered pricing based on active users. You can add, remove, and adjust seats at any time."
    },
    {
      question: "Can I customize roles and permissions?",
      answer: "Yes! Beyond our default roles (Admin, Manager, Creator, Viewer), you can create custom roles with granular permissions tailored to your team structure and workflows."
    },
    {
      question: "How does real-time collaboration work?",
      answer: "Team members can comment, suggest edits, and approve campaigns directly in the platform. Changes sync instantly, and notifications keep everyone in the loop without email overload."
    },
    {
      question: "Can I track individual team performance?",
      answer: "Absolutely. Our dashboards show campaign contributions, approval times, and ROI by team member. You can also set goals and track progress at the individual and team level."
    },
    {
      question: "Is there a limit on campaigns per team?",
      answer: "No campaign limits on any plan. Your team can create, collaborate on, and launch as many campaigns as you need to drive growth."
    },
    {
      question: "How do I migrate my existing team?",
      answer: "We offer white-glove onboarding for teams. Our team will help you import data, configure roles, and train your marketers to get up and running fast."
    }
  ];

  return (
    <section className="theme-alt bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed">
              Everything you need to know about team collaboration on Everloop.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 50} variant="up" as="div">
              <details className="group bg-surface rounded-2xl border border-[hsl(var(--border-subtle))] overflow-hidden hover:border-[hsl(var(--color-primary)/.3)] transition-all duration-300">
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-[hsl(var(--text-heading))] text-lg">
                  <span>{faq.question}</span>
                  <svg 
                    className="w-5 h-5 text-[hsl(var(--color-primary-text))] transition-transform duration-300 group-open:rotate-180 flex-shrink-0 ml-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-[hsl(var(--text-muted))] leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
