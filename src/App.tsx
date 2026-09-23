// App entry
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SphereLayer from "./components/SphereLayer";
import About from "./components/About";
import Services from "./components/Services";
import Process from "./components/Process";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import NavigationIndicator from "./components/NavigationIndicator";
import Intro from "./components/Intro";
import ThemeToggle from "./components/ThemeToggle";
import { useSmoothScroll } from "./lib/useSmoothScroll";

const SECTIONS = [
  { id: "top", label: "Top" },
  { id: "studio", label: "Studio" },
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

function App() {
  // Lenis smooth scroll, as on the reference site.
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-parchment text-ink relative">
      <Intro requireClick={false} />
      {/* Fixed layer behind everything — the sphere travels the whole page. */}
      <SphereLayer />
      <Navbar />
      <ThemeToggle />
      
      {/* Navigation Indicator on the right */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 mix-blend-difference hidden md:block">
        <NavigationIndicator sections={SECTIONS} />
      </div>

      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
