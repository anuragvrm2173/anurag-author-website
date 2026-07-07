import "./Home.css";

import Hero from "../../sections/Hero/Hero";
import FeaturedBooks from "../../sections/FeaturedBooks/FeaturedBooks";
import WritingPhilosophy from "../../sections/WritingPhilosophy/WritingPhilosophy";
import AboutPreview from "../../sections/AboutPreview/AboutPreview";
import Timeline from "../../sections/Timeline/Timeline";
import Reviews from "../../sections/Reviews/Reviews";
import Newsletter from "../../sections/Newsletter/Newsletter";

function Home() {
  return (
    <main className="home-page">
      <Hero />
      <FeaturedBooks />
      <WritingPhilosophy />
      <AboutPreview />
      <Timeline />
      <Reviews />
      <Newsletter source="Homepage" />
    </main>
  );
}

export default Home;
