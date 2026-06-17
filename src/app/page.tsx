import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Work } from "@/components/Work";
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
      <About />
      <Contact />
    </div>
  );
}
