import { Navigation } from "@/components/Navigation";
import { Contact } from "@/components/Contact";
import Image from "next/image";
import { notFound } from "next/navigation";

const projects = [
  { 
    id: "01", 
    title: "ARCHITECTURAL RENDER", 
    tag: "Creative Dev · 2024", 
    img: "/project_1.png", 
    description: "A highly detailed architectural visualization focusing on brutalist aesthetics and natural lighting. Built using modern 3D rendering techniques and integrated into a seamless web experience." 
  },
  { 
    id: "02", 
    title: "TYPOGRAPHY POSTER", 
    tag: "Design · 2023", 
    img: "/project_2.png", 
    description: "An experimental typography poster exploring the boundaries of legibility and grid systems. Inspired by Swiss design principles and modern brutalism." 
  },
  { 
    id: "03", 
    title: "MINIMALIST MOCKUP", 
    tag: "Web Design · 2023", 
    img: "/project_3.png", 
    description: "A sleek, minimalist product mockup designed to showcase digital products in a realistic environment with perfect lighting and shadow play." 
  },
];

export function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full">
      <main className="w-full min-h-screen flex flex-col px-6 md:px-12 py-12 md:py-16">
        <Navigation />
        
        <div className="flex-1 flex flex-col justify-center mt-12 md:mt-0">
          <div className="mb-8">
            <span className="text-sm md:text-base uppercase tracking-widest opacity-50">{project.tag}</span>
          </div>
          <h1 className="text-[clamp(40px,8vw,120px)] font-black uppercase leading-[0.9] tracking-tighter mb-12">
            {project.title}
          </h1>
          
          <div className="w-full relative aspect-video md:aspect-[21/9] overflow-hidden bg-[#0A0A0A]/5 mb-12 md:mb-24">
            <Image 
              src={project.img}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="max-w-3xl ml-auto text-xl md:text-3xl font-medium leading-relaxed tracking-tight mb-24 md:mb-32">
            {project.description}
          </div>
        </div>
      </main>
      
      <Contact />
    </div>
  );
}
