import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <div className="w-full">
      <main className="w-full min-h-screen flex flex-col px-6 md:px-12 py-12 md:py-16">
        <Navigation />
        <Hero />
      </main>
      <Work />
      <Testimonials />
      <About />
      <Contact />
    </div>
  );
}
