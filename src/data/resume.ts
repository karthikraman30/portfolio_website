// Resume data — single source of truth for the /resume page and the /resume-maker builder.
// Sourced from the portfolio (src/data/content.ts) where possible.
//
// NOTE: Fields marked `TODO:` need Karthik's real info — replace the placeholder strings
// (or edit them live in the /resume-maker builder). They are intentionally visible so they
// are easy to spot.

export interface ResumeLink {
    portfolio: string;
    github: string;
    linkedin: string;
}

export interface ResumeBasics {
    name: string;
    title: string;
    location: string;
    phone?: string;
    email: string;
    links: ResumeLink;
    // Optional one-liner shown under the contact links — e.g. visa status + relocation
    // for UAE/Gulf applications. Leave empty to hide it (e.g. for other markets).
    availability?: string;
}

export interface EducationItem {
    institution: string;
    period: string;
    location: string;
    scoreLabel?: string; // e.g. "CPI" or "Percentage"
    score?: string;      // e.g. "7.48" or "87.2%"
    hidden?: boolean;
}

export interface ExperienceItem {
    company: string;
    role: string;
    location: string;
    period: string;
    bullets: string[];
    tech: string[];
    featured?: boolean;
    hidden?: boolean;
}

export interface ProjectItem {
    name: string;
    tech: string[];
    bullets: string[];
    links: { demo?: string; github?: string };
    featured?: boolean;
    hidden?: boolean;
}

export interface SkillCategory {
    label: string;
    items: string[];
    hidden?: boolean;
}

export interface CodingProfile {
    platform: string;
    handle: string;
    url: string;
    stat?: string;
    hidden?: boolean;
}

export interface ResumeData {
    basics: ResumeBasics;
    summary: string;
    education: EducationItem[];
    experience: ExperienceItem[];
    projects: ProjectItem[];
    skills: SkillCategory[];
    codingProfiles: CodingProfile[];
}

export const resumeData: ResumeData = {
    basics: {
        name: "Karthik Raman Balamurugan",
        title: "B.Tech – Information and Communication Technology",
        location: "",
        phone: "",
        email: "202301407@dau.ac.in",
        links: {
            portfolio: "https://karthikraman.in",
            github: "https://github.com/karthikraman30",
            linkedin: "https://www.linkedin.com/in/karthikramanbalamurugan/",
        },
        // UAE/Gulf: visa status + relocation. Clear this for non-UAE applications.
        availability:
            "Holder of a valid UAE residence visa · Open to relocating and working anywhere across the UAE · Available to join immediately.",
    },

    // Tailor the role phrase to each JD. Turn the Summary section off for markets that don't need it.
    summary:
        "Information & Communication Technology undergraduate and full-stack developer experienced in " +
        "building and shipping AI-powered web and mobile applications with React, TypeScript, Node.js, " +
        "Python and Google Gemini. Comfortable owning features end to end — from API and database design " +
        "through deployment — with a focus on clean, reliable, user-facing products. Seeking a Software " +
        "Engineer / Full-Stack Developer role where I can build scalable products within a high-performing team.",

    education: [
        {
            institution: "Dhirubhai Ambani University",
            period: "2023 – Present",
            location: "Gandhinagar, Gujarat",
            scoreLabel: "CPI",
            score: "7.48",
        },
        {
            institution: "Asian International (P) School — Class 12",
            period: "2022 – 2023",
            location: "Al Dhannah City, Ruwais, Abu Dhabi, UAE",
            scoreLabel: "Percentage",
            score: "87.2%",
        },
        {
            institution: "Asian International (P) School — Class 10",
            period: "2020 – 2021",
            location: "Al Dhannah City, Ruwais, Abu Dhabi, UAE",
            scoreLabel: "Percentage",
            score: "92.6%",
        },
    ],

    experience: [
        {
            company: "Maven Alpha Pvt. Ltd.",
            role: "Software Engineer Intern",
            location: "Chennai, Tamil Nadu",
            period: "May 2026 – July 2026",
            bullets: [
                "Architected a web-scraping platform in Python using Playwright to aggregate cultural data from 7 Swedish sources, bypassing Cloudflare and JS-heavy architectures.",
                "Engineered a dual-database sync layer (Supabase + Firebase Realtime DB) via Cloud Functions and built a Streamlit monitoring dashboard with SHA-256 deduplication.",
            ],
            tech: [],
        },
    ],

    projects: [
        {
            name: "Vaani — AI Meeting Notes for Indian Languages (Web + macOS Desktop)",
            tech: ["React 19", "TypeScript", "FastAPI", "Google Gemini 2.5 Flash", "Rust", "Tauri", "Firebase", "Render"],
            bullets: [
                "Built a full-stack AI meeting-summarization product for 8+ Indian languages, shipped in two versions on a shared FastAPI backend — a React/Firebase web app and a native Rust/Tauri macOS desktop app.",
                "Engineered a Google Gemini 2.5 Flash pipeline converting multilingual audio into schema-validated structured summaries (topics, scored events, decisions, action items), with retry/backoff and parallel chunking for long recordings.",
                "Implemented macOS system + microphone audio capture in Rust (ScreenCaptureKit + CPAL) with real-time 16 kHz mixing for one-click Meet/Zoom/Teams recording; deployed via Render + Firebase Hosting with real-time SSE progress.",
            ],
            links: { demo: "https://vaani-4d78f.web.app", github: "https://github.com/karthikraman30/vaani" },
            featured: true,
        },
        {
            name: "Psyche — AI Voice Journal",
            tech: ["Next.js 15", "React 19", "TypeScript", "Google Gemini", "Firebase", "Google Cloud KMS"],
            bullets: [
                "Architected and shipped a voice-first AI journaling web app that lets users journal by speaking in 9 Indian languages; deployed to production on Vercel.",
                "Engineered a multimodal Google Gemini pipeline (audio → native transcript + English translation → structured JSON analysis) hardened with JSON-mode schema validation, retries, and automatic model fallback.",
                "Implemented privacy-first AES-256-GCM envelope encryption with per-entry keys wrapped by Google Cloud KMS and locked-down Firestore rules, plus an 'Ask your journal' RAG chat grounded in recent entries.",
            ],
            links: { demo: "https://journal-roan-theta.vercel.app" },
            featured: true,
        },
        {
            name: "VoltBuddy — Gamified Battery Health",
            tech: ["JavaScript", "HTML", "CSS", "Tailwind CSS", "Google Gemini"],
            bullets: [
                "Built a gamified battery-health companion that turns phone charging logs into a virtual-pet RPG; designed a multi-stage scoring algorithm grounded in lithium-ion research, processing 3,594 sessions via a 2-stage data-cleaning pipeline.",
                "Integrated Google Gemini 2.5 Flash for dual-persona AI dialogue and built a GitHub-style interactive heatmap with per-day time-travel, a dual-locale i18n system, and an RPG progression system — as a zero-dependency single-file web app on GitHub Pages.",
            ],
            links: { demo: "https://karthikraman30.github.io/VoltBuddy/", github: "https://github.com/karthikraman30/VoltBuddy" },
            featured: true,
        },
        {
            name: "Coinscious — Smart Expense Tracker & Bill Splitter",
            tech: ["React", "TypeScript", "Flask", "Supabase", "PostgreSQL", "Google Gemini", "Groq"],
            bullets: [
                "Built a full-stack expense-sharing platform (React/TypeScript SPA + Python/Flask REST API) with groups, expense splitting, per-member balances, and a greedy debt-simplification engine that minimizes the transactions needed to settle up.",
                "Integrated generative AI for automatic expense categorization and receipt-image parsing (Google Gemini) plus a Groq-powered finance chatbot; settlements are recorded directly between members with automatic balance reconciliation, secured on Supabase/PostgreSQL with Row-Level Security and JWT auth.",
            ],
            links: { demo: "https://coincious-smart-expense-tracker.vercel.app/", github: "https://github.com/TirthGandhi18/Coincious-Smart-Expense-Tracker" },
        },
        {
            name: "Code Snippet Manager",
            tech: ["C++"],
            bullets: [
                "C++ CLI to organize reusable code snippets — CRUD operations, tag-based categorization, and fast search to streamline developer workflows.",
            ],
            links: { github: "https://github.com/karthikraman30/code-snippet-manager" },
        },
    ],

    skills: [
        { label: "Programming Languages", items: ["Python", "C++", "Java", "SQL", "JavaScript", "TypeScript", "HTML/CSS"] },
        { label: "Web Technologies", items: ["HTML", "CSS", "React.js", "Node.js", "Tailwind CSS", "React Native", "Web Services (REST/HTTP)"] },
        { label: "Frameworks & Libraries", items: ["Flask", "React.js", "Node.js", "Playwright", "Scrapy", "Streamlit", "STL", "Pandas", "Scikit-learn"] },
        { label: "Databases & Cloud", items: ["Google Cloud Platform (GCP)", "Firebase", "Supabase", "PostgreSQL", "MySQL"] },
        { label: "Developer Tools", items: ["Docker", "Firebase Cloud Functions", "Git", "Linux CLI", "VS Code", "Jupyter Notebook"] },
        { label: "Core Subjects", items: ["Data Structures and Algorithms", "Operating Systems", "DBMS", "Machine Learning"] },
        { label: "Soft Skills", items: ["Team Collaboration", "Problem Solving", "Communication", "Time Management", "Technical Documentation"] },
        { label: "Areas of Interest", items: ["Software Engineering", "Full-Stack Development", "Data Science", "AI/ML"] },
    ],

    // TODO: add your real coding profiles + ratings/solved counts, or hide the ones you don't use.
    codingProfiles: [
        { platform: "LeetCode", handle: "TODO: your-handle", url: "https://leetcode.com/u/TODO", stat: "TODO: rating / problems solved" },
        { platform: "Codeforces", handle: "TODO: your-handle", url: "https://codeforces.com/profile/TODO", stat: "TODO: rating / rank" },
    ],
};
