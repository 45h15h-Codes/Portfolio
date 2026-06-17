import { Navigation } from "@/components/Navigation";
import { Contact } from "@/components/Contact";
import Image from "next/image";
import { notFound } from "next/navigation";

type Project = {
  id: string;
  title: string;
  tag: string;
  client: string;
  year: string;
  img: string;
  description: string;
  overview: string;
  stack: string[];
  highlights: string[];
  github?: string;
  live?: string;
};

const projects: Project[] = [
  {
    id: "01",
    title: "DIAMOND CRM",
    tag: "Laravel · Vue.js · 2025",
    client: "Om Gems",
    year: "2025",
    img: "/project_1.png",
    description:
      "Full-stack internal admin panel for a jewellery trading business — built with Laravel 11 backend featuring custom RBAC, real-time multi-user chat with Vue 3 + Laravel Echo, and a complete order lifecycle management system.",
    overview:
      "A comprehensive CRM solution for a diamond and jewellery trading business. The system handles three distinct order types with full lifecycle tracking, a permission-based access system with granular controls, and a real-time messaging layer for team collaboration. The architecture includes an audit log system, Cloudinary-based file pipeline with virus scanning, and automated notifications for key business events.",
    stack: [
      "Laravel 11",
      "Vue 3",
      "Laravel Echo",
      "MySQL",
      "Cloudinary",
      "RBAC",
      "WebSockets",
      "PHP",
    ],
    highlights: [
      "Custom Role-Based Access Control (RBAC) with granular `hasPermission()` guards across 696 files",
      "Real-time multi-user chat with channels, mentions, reactions, and read receipts via Laravel Echo",
      "Three order type pipelines with status transitions, history tracking, and conversion registry",
      "Diamond & Melee stock management with bulk editing, CSV import/export, and low-stock alerts",
      "Jewellery stock pricing matrix with dynamic rate calculations and multi-stone support",
      "Email account integration with compose, attachments, and policy-based access",
      "Automated PDF invoices, shipping labels, and order tracking sync",
    ],
    github: "https://github.com/45h15h-Codes",
  },
  {
    id: "02",
    title: "BANKING SYSTEM",
    tag: "Microservices · Laravel · 2025",
    client: "Personal Project",
    year: "2025",
    img: "/project_2.png",
    description:
      "A microservices-based banking platform built with Laravel, featuring dedicated services for authentication, accounts, customers, transactions, loans, and payments — all coordinated through an API Gateway.",
    overview:
      "A production-grade banking backend demonstrating microservices architecture with service-to-service communication. Each service is independently deployable and owns its database. The system supports full KYC workflows, loan applications with EMI schedules, Razorpay payment integration, and comprehensive audit logging. Built with a clean API contract-first approach and test coverage across all services.",
    stack: [
      "Laravel",
      "PHP",
      "MySQL",
      "Razorpay",
      "API Gateway",
      "REST APIs",
      "JWT Auth",
      "Microservices",
    ],
    highlights: [
      "6 independently deployed microservices: Auth, Account, Customer, Transaction, Loan, Payment",
      "Razorpay webhook integration for payment processing with transaction ledger",
      "KYC document upload and review workflow with status management",
      "Loan service with EMI schedule generation and automated repayment tracking",
      "Service-to-service auth middleware with internal API contracts",
      "Standardized API response trait (`success()`, `error()`, `notFound()`, `forbidden()`)",
      "Comprehensive feature test coverage with `AccountServiceFeatureTest` and `TransactionServiceFeatureTest`",
    ],
    github: "https://github.com/45h15h-Codes",
  },
  {
    id: "03",
    title: "GITREPORT",
    tag: "Node.js · TypeScript · 2024",
    client: "Open Source",
    year: "2024",
    img: "/project_3.png",
    description:
      "An AI-powered GitHub analytics tool that ingests commit history, classifies repositories, generates monthly developer reports with narrative summaries, and delivers them via email — built with TypeScript, Redis queues, and an LLM narrative engine.",
    overview:
      "GitReport pulls raw GitHub data via the API, runs it through an aggregation engine that computes commit patterns, language breakdowns, peak coding hours, streaks, and focus scores. Worker queues (Bull + Redis) handle async report generation and AI narrative creation. Reports can be shared publicly and exported as PDFs. The frontend is a React SPA with cinematic mode, achievement badges, and challenge cards.",
    stack: [
      "TypeScript",
      "Node.js",
      "Redis",
      "BullMQ",
      "React",
      "Drizzle ORM",
      "LLM / AI",
      "GitHub API",
    ],
    highlights: [
      "GitHub OAuth with encrypted token storage and rate-limit-aware API client",
      "Aggregation engine: commit size distribution, language breakdown, peak hour blocks, streaks & focus score",
      "LLM narrative generation pipeline via worker queue with persona-based report tone",
      "PDF report export with cinematic layout using `generateReportPdf()`",
      "Achievement system with badge evaluation and shareable public report URLs",
      "Bull + Redis queue architecture for async ingestion, report, and narrative workers",
      "Email notifications for report-ready and developer challenge events",
    ],
    github: "https://github.com/45h15h-Codes/gitreport",
  },
  {
    id: "04",
    title: "VERITAS GEM LAB",
    tag: "TypeScript · Freelance · 2025",
    client: "OM GEMS",
    year: "2025",
    img: "/project_3.png",
    description:
      "A gem laboratory management web application built with TypeScript for OM GEMS - handling gem certification, grading records, and lab operations in a clean, modern interface.",
    overview:
      "Veritas Gem Laboratory is a domain-specific web application for managing gemstone certification workflows. Built as a freelance project for OM GEMS, it handles gem grading submissions, certificate generation, and laboratory operations. The TypeScript-first codebase ensures type safety and long-term maintainability for the client.",
    stack: ["TypeScript", "Web Technologies", "Modern Tooling"],
    highlights: [
      "Gem certification and grading record management",
      "TypeScript-first architecture with strict type safety",
      "Freelance delivery with domain-specific requirements",
      "Clean, maintainable codebase for long-term client ownership",
    ],
    github: "https://github.com/45h15h-Codes/VERITAS-GEM-LABORATORY",
  },
  {
    id: "05",
    title: "GOLD API",
    tag: "Python · Open Source · 2024",
    client: "Open Source",
    year: "2024",
    img: "/project_2.png",
    description:
      "NavkarGold-based REST API for real-time gold rates in India (INR) with smart fallback logic and support for both 22K and 24K pricing.",
    overview:
      "A lightweight Python API that scrapes and serves live gold prices from NavkarGold with intelligent fallback mechanisms. The API supports 22K and 24K gold pricing in Indian Rupees, making it useful for jewellery businesses and financial apps that need real-time commodity pricing without paying for expensive data feeds.",
    stack: ["Python", "REST API", "Web Scraping", "NavkarGold"],
    highlights: [
      "Real-time gold rate fetching from NavkarGold with smart fallback",
      "Supports both 22K and 24K gold pricing in INR",
      "Lightweight Python REST API — low latency, easy to self-host",
      "Open source with clean API contract for easy integration",
    ],
    github: "https://github.com/45h15h-Codes/custom-gold-api",
  },
  {
    id: "06",
    title: "RANKUP",
    tag: "TypeScript · Freelance · 2025",
    client: "Freelance Client",
    year: "2025",
    img: "/project_1.png",
    description:
      "A freelance web application built with TypeScript, delivered for a client with a focus on clean architecture and modern web development practices.",
    overview:
      "A client-facing web application developed as freelance work. The project demonstrates production-ready TypeScript development with a clean, maintainable codebase. Built with modern tooling and best practices for long-term maintainability and scalability.",
    stack: ["TypeScript", "Web Technologies", "Modern Tooling"],
    highlights: [
      "Production-ready TypeScript codebase with strict type safety",
      "Freelance delivery with client-focused requirements",
      "Clean architecture for long-term maintainability",
    ],
    github: "https://github.com/45h15h-Codes/RankUp",
  },
  {
    id: "07",
    title: "PORTFOLIO",
    tag: "Next.js · GSAP · 2025",
    client: "Personal",
    year: "2025",
    img: "/project_2.png",
    description:
      "The portfolio site you are currently viewing — built with Next.js 15, GSAP animations, Supabase for the community drawing wall, and Vercel Analytics for performance insights.",
    overview:
      "A creative portfolio built to showcase my work with attention to detail in motion design and user experience. Features include a GSAP-powered page transition system, a hidden Konami code easter egg linking to an interactive drawing canvas stored in Supabase, smooth scroll with Lenis, SplitType text animations, and a fully animated dark/light theme toggle.",
    stack: [
      "Next.js 15",
      "TypeScript",
      "GSAP",
      "Supabase",
      "Tailwind CSS",
      "Lenis",
      "SplitType",
      "Vercel",
    ],
    highlights: [
      "GSAP ScrollTrigger animations across all sections — word-reveal, parallax, magnetic hover",
      "Konami code easter egg leading to a Supabase-backed community drawing wall",
      "Page transition system with animated overlay using template.tsx",
      "Custom magnetic cursor with blend-mode effects",
      "SplitType character-level animations on contact section CTA",
      "Vercel Analytics integration for real-time usage insights",
      "Fully responsive with adaptive mobile layouts",
    ],
    github: "https://github.com/45h15h-Codes/Portfolio",
    live: "https://ashishvala.in/",
  },
];

export function generateStaticParams() {
  return projects.map((p) => ({
    id: p.id,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full">
      <main className="w-full min-h-screen flex flex-col px-6 md:px-12 py-12 md:py-16">
        <Navigation />

        <div className="flex-1 flex flex-col mt-12 md:mt-16">
          {/* Tag + Client row */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-xs md:text-sm uppercase tracking-widest opacity-50">
              {project.tag}
            </span>
            <span className="text-xs md:text-sm uppercase tracking-widest opacity-30">
              ·
            </span>
            <span className="text-xs md:text-sm uppercase tracking-widest opacity-50">
              {project.client}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-[clamp(32px,9vw,120px)] font-black uppercase leading-[0.9] tracking-tighter mb-12 break-words hyphens-auto">
            {project.title}
          </h1>

          {/* Hero Image */}
          <div className="w-full relative aspect-video md:aspect-[21/9] overflow-hidden bg-foreground/5 mb-16 md:mb-24">
            <Image
              src={project.img}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Two-col layout */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24 mb-16 md:mb-24">
            {/* Left: Meta */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">
                  Client
                </p>
                <p className="text-base font-semibold uppercase tracking-wide">
                  {project.client}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-2">
                  Year
                </p>
                <p className="text-base font-semibold uppercase tracking-wide">
                  {project.year}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 mb-3">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-xs font-semibold uppercase tracking-widest border border-foreground/15 px-3 py-1"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {/* Links */}
              <div className="flex flex-col gap-3 pt-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wide hover:opacity-50 transition-opacity duration-300 w-fit"
                  >
                    GitHub ↗
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wide hover:opacity-50 transition-opacity duration-300 w-fit"
                  >
                    Live Site ↗
                  </a>
                )}
              </div>
            </div>

            {/* Right: Description + Overview */}
            <div>
              <p className="text-xl md:text-3xl font-medium leading-[1.6] tracking-tight mb-10">
                {project.description}
              </p>
              <p className="text-base md:text-lg leading-[1.8] opacity-70">
                {project.overview}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="border-t border-foreground/10 pt-12 md:pt-16 mb-8">
            <p className="text-xs uppercase tracking-widest opacity-40 mb-8">
              Key Features
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-sm md:text-base leading-relaxed"
                >
                  <span className="text-foreground/30 font-mono text-xs mt-1 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="opacity-70">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Contact />
    </div>
  );
}
