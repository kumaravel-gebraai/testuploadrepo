import FadeIn from "../../FadeIn";

export default function RolesPermissions() {
  const roles = [
    {
      name: "Admin",
      description: "Full platform access",
      permissions: [
        "Manage team members and billing",
        "Configure integrations and settings",
        "Access all campaigns and data",
        "Set up workflows and automations",
        "Approve and publish all content"
      ]
    },
    {
      name: "Manager",
      description: "Department oversight",
      permissions: [
        "Create and edit campaigns",
        "Review and approve team work",
        "Access performance dashboards",
        "Manage department workflows",
        "Assign tasks to team members"
      ]
    },
    {
      name: "Creator",
      description: "Content production",
      permissions: [
        "Create campaign content",
        "Use AI generation tools",
        "Submit work for approval",
        "View assigned campaigns",
        "Collaborate with team members"
      ]
    },
    {
      name: "Viewer",
      description: "Read-only access",
      permissions: [
        "View published campaigns",
        "Access performance reports",
        "Export analytics data",
        "Comment on campaigns",
        "Receive team notifications"
      ]
    }
  ];

  return (
    <section className="theme-inverse bg-[hsl(var(--bg-canvas))] py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-[hsl(var(--text-heading))] mb-6">
              Secure, Granular Permissions
            </h2>
            <p className="text-lg text-[hsl(var(--text-muted))] leading-relaxed">
              Control exactly who can access, edit, and publish campaigns with role-based permissions designed for marketing teams.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, i) => (
            <FadeIn key={i} delay={i * 100} variant="up">
              <div className="bg-surface rounded-2xl p-8 border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--color-primary)/.3)] hover:shadow-lg transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-[hsl(var(--text-heading))] mb-2">
                    {role.name}
                  </h3>
                  <p className="text-sm text-[hsl(var(--text-muted))]">
                    {role.description}
                  </p>
                </div>
                <ul className="space-y-3">
                  {role.permissions.map((permission, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-[hsl(var(--text-muted))]">
                      <svg className="w-5 h-5 text-[hsl(var(--color-primary-text))] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
