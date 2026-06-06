// Content data for the portfolio website
// This file contains all text content, making it easy to update and manage

import coinciousImage from '@/assets/images/1.png';
import snippetManagerImage from '@/assets/images/2.png';
import psycheImage from '@/assets/images/psyche.png';
import vaaniImage from '@/assets/images/vaani.png';
import voltbuddyImage from '@/assets/images/voltbuddy.png';

export const siteContent = {
    // Hero Section
    hero: {
        greeting: "Hey! I am",
        name: "Karthik Raman",
        tagline: "I love building applications that solve real-world problems with modern technologies and creative solutions",
        subtitle: "Full-Stack Developer • AI Enthusiast • Problem Solver",
        cta: {
            primary: {
                text: "Reach Out to Me",
                scrollTo: "contact"
            },
            secondary: {
                text: "Check Out My Work",
                scrollTo: "projects"
            }
        }
    },

    // About Section
    about: {
        title: "LET ME INTRODUCE MYSELF",
        paragraphs: [
            "Hello! I'm <span class='highlight-gradient'>Karthik Raman</span>, a <span class='highlight-cyan'>passionate developer</span> who loves transforming ideas into reliable, scalable products. Over time, I've explored several technologies and found my passion in building <span class='highlight-lime'>high-performance systems</span> and <span class='highlight-cyan'>intuitive user experiences</span>.",
            "My journey in software development has equipped me with a diverse set of skills, from front-end design to back-end development. I'm constantly learning and adapting to new technologies to stay at the forefront of <span class='highlight-lime'>web development</span>.",
            "My key areas of interest include developing <span class='highlight-cyan'>Web Applications</span>, exploring <span class='highlight-gradient'>AI/ML</span> concepts and applying to real problems and participating in <span class='highlight-lime'>competitive programming</span> challenges.",
            "Whenever I am free, I love playing <span class='highlight-cyan'>badminton</span> and also love watching movies."
        ],
        technologiesLabel: "Technologies I work with:",
        technologies: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Next.js",
            "Tailwind CSS",
            "Python",
            "SQL"
        ],
        stats: [
            { label: "Years of Experience", value: "3+" },
            { label: "Projects Completed", value: "25+" },
            { label: "Technologies Mastered", value: "15+" },
            { label: "Cups of Coffee", value: "∞" }
        ],
        timeline: [
            {
                id: 'school',
                title: 'School',
                institution: 'Asian International Private School',
                period: '2014 - 2022',
                description: 'Higher Secondary Education with focus on Science and Mathematics',
                color: '#FF00FF'
            },
            {
                id: 'college',
                title: 'College',
                institution: 'Dhirubhai Ambani University',
                period: '2023 - 2027',
                description: 'B.Tech in Computer Science & Engineering',
                color: '#00FFFF'
            },
            {
                id: 'work',
                title: 'Work',
                institution: 'Seeking opportunities to work and gain practical experience',
                period: 'Open to Opportunities',
                description: 'Looking for internships and entry-level positions',
                color: '#D2FF00'
            }
        ]
    },

    // Skills Section
    skills: {
        title: "Skills & Technologies",
        subtitle: "A comprehensive toolkit for building modern applications",
        categories: [
            {
                title: "Languages & Technologies",
                iconName: "Code2",
                iconBg: "from-cyan-400 to-blue-500",
                items: ["C", "C++", "Rust", "Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
                description: "Proficient in multiple programming languages with a strong foundation in problem-solving and algorithm design."
            },
            {
                title: "Developer Tools",
                iconName: "Wrench",
                iconBg: "from-purple-500 to-indigo-500",
                items: ["Git", "VS Code", "Vite", "Figma", "Google Colab", "Streamlit", "MATLAB"],
                description: "Skilled in industry-standard development tools and environments for efficient coding and collaboration."
            },
            {
                title: "Frameworks & Libraries",
                iconName: "Cpu",
                iconBg: "from-pink-500 to-rose-500",
                items: ["React Native", "React.js", "Next.js", "Node.js", "FastAPI", "Tauri", "Tailwind CSS", "shadcn/ui", "TanStack Query", "NumPy", "Pandas", "Scikit-learn"],
                description: "Experienced with modern frameworks and libraries for building scalable and efficient applications."
            },
            {
                title: "Cloud & Databases",
                iconName: "Database",
                iconBg: "from-amber-400 to-orange-500",
                items: ["Firebase", "Supabase", "MySQL", "PostgreSQL", "Google Gemini", "Gen AI", "Vercel", "Render"],
                description: "Knowledgeable in database management and cloud services for robust application development."
            },
            {
                title: "Soft Skills",
                iconName: "Users",
                iconBg: "from-emerald-400 to-teal-500",
                items: ["Team Collaboration", "Problem Solving", "Communication", "Time Management"],
                description: "Strong interpersonal skills that enhance team productivity and project success."
            },
            {
                title: "Areas of Interest",
                iconName: "Rocket",
                iconBg: "from-blue-400 to-cyan-500",
                items: ["Mobile App Development", "Web Development", "AI/ML", "System Design", "Competitive Programming"],
                description: "Passionate about exploring new technologies and solving complex problems through innovative solutions."
            }
        ]
    },

    // Projects Section
    projects: {
        title: "Explore My Projects",
        subtitle: "Here are the projects I've worked on",
        items: [
            {
                title: "Psyche : AI Voice Journal",
                description: "A voice-first AI journaling app: speak your thoughts in 9 Indian languages and get a written, AI-analyzed reflection — mood, themes, people, and an 'ask your journal' chat grounded in your own entries. Privacy-first, with entries encrypted at rest.",
                tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "Google Gemini", "Firebase", "Google Cloud KMS", "Vercel"],
                image: psycheImage,
                demoUrl: "https://journal-roan-theta.vercel.app",
                githubUrl: "",
                featured: true
            },
            {
                title: "Vaani : AI Meeting Notes for Indian Languages",
                description: "A web app that turns audio in 8+ Indian languages (Hindi, Tamil, Telugu…) into structured English meeting notes — overview, key topics, scored events, decisions, action items, and tags — in seconds. Upload or record, then chat with your meeting.",
                tech: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Firebase", "FastAPI", "Google Gemini 2.5 Flash", "Render", "TanStack Query"],
                image: vaaniImage,
                demoUrl: "https://vaani-4d78f.web.app",
                githubUrl: "https://github.com/karthikraman30/vaani",
                featured: true
            },
            {
                title: "Vaani Desktop : Live Meeting Capture for Mac",
                description: "A downloadable macOS app that captures system + microphone audio straight from Google Meet, Zoom, or Teams and produces the same rich AI summaries — no upload needed. Auto-detects active meetings and records with one click.",
                tech: ["Tauri", "Rust", "ScreenCaptureKit", "CPAL", "React", "TypeScript", "FastAPI", "Gemini"],
                image: vaaniImage,
                demoUrl: "",
                githubUrl: "https://github.com/karthikraman30/vaani",
                featured: true
            },
            {
                title: "VoltBuddy : Gamified Battery Health",
                description: "A gamified battery health companion that turns your charging habits into a virtual pet RPG. Feed it CSV charging logs and watch your pet thrive or suffer based on your behavior — with a heatmap, rank progression, and GenZ/Regular dual-locale UI.",
                tech: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "Gemini API"],
                image: voltbuddyImage,
                demoUrl: "https://karthikraman30.github.io/VoltBuddy/",
                githubUrl: "https://github.com/karthikraman30/VoltBuddy",
                featured: true
            },
            {
                title: "Coincious : Smart Expense Tracker",
                description: "Built a smart expense tracking application that uses Generative AI to automate transaction classification. Built with a robust Python/Flask backend and a responsive React/TypeScript frontend to simplify personal financial management.",
                tech: ["Python", "Typescript", "CSS", "Javascript", "Supabase", "Gen AI"],
                image: coinciousImage,
                demoUrl: "https://coincious-smart-expense-tracker.vercel.app/",
                githubUrl: "https://github.com/TirthGandhi18/Coincious-Smart-Expense-Tracker",
                featured: true
            },
            {
                title: "Code Snippet Manager",
                description: "A lightweight yet powerful CLI application built in C++ for organizing and managing reusable code snippets. Features intuitive CRUD operations, tag-based categorization for quick retrieval, and efficient search functionality—designed to streamline developer workflows and boost productivity.",
                tech: ["C++"],
                image: snippetManagerImage,
                demoUrl: "https://docs.google.com/presentation/d/1e4CvpFofTbqnBp744SR7rpAdS11HIz04rExXeDkVcss/edit?usp=sharing",
                githubUrl: "https://github.com/karthikraman30/code-snippet-manager",
                featured: true
            },
        ]
    },

    // Contact Section
    contact: {
        title: "Get In Touch",
        subtitle: "Let's create something amazing together",
        description: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Drop me a message and let's start a conversation!",
        form: {
            nameLabel: "Name",
            namePlaceholder: "Enter your name",
            emailLabel: "Email",
            emailPlaceholder: "your@email.com",
            messageLabel: "Message",
            messagePlaceholder: "Tell me about your project...",
            submitButton: "Send Message",
            successMessage: "Message sent successfully! I'll get back to you soon.",
            errorMessage: "Oops! Something went wrong. Please try again."
        },
        social: {
            email: "k.raman.b30@gmail.com",
            linkedin: "https://www.linkedin.com/in/karthikramanbalamurugan/",
            github: "https://github.com/karthikraman30",
        },
        footer: {
            copyright: "© 2025 Karthik Raman",
            tagline: "Designed and Developed by Karthik Raman"
        }
    },

    // Loading Screen
    loading: {
        messages: [
            "Initializing creative engine...",
            "Compiling awesomeness...",
            "Loading pixel perfection...",
            "Brewing digital magic...",
            "Assembling the matrix...",
            "Calibrating coolness factor..."
        ]
    },

    // Navigation
    navigation: {
        links: [
            { label: "Home", href: "#hero" },
            { label: "About", href: "#about" },
            { label: "Skills", href: "#skills" },
            { label: "Projects", href: "#projects" },
            { label: "Contact", href: "#contact" }
        ],
        logo: "KR"
    },

    // Meta / SEO
    meta: {
        title: "Karthik Raman - Developer Portfolio",
        description: "Passionate developer building beautiful, functional, and user-centered digital experiences with modern web technologies."
    }
};

// Type definitions for the content
export type SiteContent = typeof siteContent;
export type HeroContent = typeof siteContent.hero;
export type AboutContent = typeof siteContent.about;
export type SkillsContent = typeof siteContent.skills;
export type ProjectsContent = typeof siteContent.projects;
export type ContactContent = typeof siteContent.contact;
export type MetaContent = typeof siteContent.meta;

// Helper type for individual project
export type Project = typeof siteContent.projects.items[number];

// Helper type for skill category
export type SkillCategory = typeof siteContent.skills.categories[number];
