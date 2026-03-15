import HeroAbout from "../components/sections/about/HeroAbout";
import MissionSection from "../components/sections/about/MissionSection";
import StorySection from "../components/sections/about/StorySection";
import ValuesSection from "../components/sections/about/ValuesSection";
import TeamSection from "../components/sections/about/TeamSection";
import DifferentiatorSection from "../components/sections/about/DifferentiatorSection";
import CTAAbout from "../components/sections/about/CTAAbout";

export default function About() {
  return (
    <>
      <HeroAbout />
      <MissionSection />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <DifferentiatorSection />
      <CTAAbout />
    </>
  );
}
