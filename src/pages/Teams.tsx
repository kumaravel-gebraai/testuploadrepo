import HeroTeams from "../components/sections/teams/HeroTeams";
import CollaborationFeatures from "../components/sections/teams/CollaborationFeatures";
import WorkflowSection from "../components/sections/teams/WorkflowSection";
import RolesPermissions from "../components/sections/teams/RolesPermissions";
import TeamStats from "../components/sections/teams/TeamStats";
import TestimonialsTeams from "../components/sections/teams/TestimonialsTeams";
import FAQTeams from "../components/sections/teams/FAQTeams";
import CTATeams from "../components/sections/teams/CTATeams";

export default function Teams() {
  return (
    <main>
      <HeroTeams />
      <CollaborationFeatures />
      <WorkflowSection />
      <RolesPermissions />
      <TeamStats />
      <TestimonialsTeams />
      <FAQTeams />
      <CTATeams />
    </main>
  );
}
