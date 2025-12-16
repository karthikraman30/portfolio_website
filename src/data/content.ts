// Content data for the portfolio website
// This file contains all text content, making it easy to update and manage

export const siteContent = {
    // Hero Section
    hero: {
        greeting: "Hey, I am",
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
        title: "About Me",
        paragraphs: [
            "Hello! I'm Karthik Raman, a passionate developer with a love for creating beautiful, functional, and user-centered digital experiences. With a strong foundation in modern web technologies, I bring ideas to life through clean, efficient code and thoughtful design.",
            "My journey in software development has equipped me with a diverse set of skills, from front-end design to back-end development. I'm constantly learning and adapting to new technologies to stay at the forefront of web development.",
            "When I'm not coding, you'll find me exploring new AI/ML concepts, contributing to open-source projects, or participating in competitive programming challenges. I believe in writing code that not only works but tells a story."
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
                items: ["C", "C++", "Python", "JavaScript", "TypeScript", "SQL", "HTML", "CSS"],
                description: "Proficient in multiple programming languages with a strong foundation in problem-solving and algorithm design."
            },
            {
                title: "Developer Tools",
                iconName: "Wrench",
                iconBg: "from-purple-500 to-indigo-500",
                items: ["Git", "VS Code", "Figma", "Google Colab", "Streamlit", "MATLAB"],
                description: "Skilled in industry-standard development tools and environments for efficient coding and collaboration."
            },
            {
                title: "Frameworks & Libraries",
                iconName: "Cpu",
                iconBg: "from-pink-500 to-rose-500",
                items: ["React Native", "React.js", "Node.js", "Tailwind CSS", "NumPy", "Pandas", "Scikit-learn"],
                description: "Experienced with modern frameworks and libraries for building scalable and efficient applications."
            },
            {
                title: "Cloud & Databases",
                iconName: "Database",
                iconBg: "from-amber-400 to-orange-500",
                items: ["Firebase", "MySQL", "PostgreSQL", "Gen AI"],
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
        title: "Featured Projects",
        subtitle: "A showcase of creative problem-solving and technical excellence",
        items: [
            {
                title: "AI-Powered Analytics Platform",
                description: "Real-time data visualization and predictive analytics using machine learning algorithms. Features include interactive dashboards, automated reporting, and intelligent data insights.",
                tech: ["Python", "TensorFlow", "React", "Node.js"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                demoUrl: "",
                githubUrl: "",
                featured: true
            },
            {
                title: "Distributed Task Scheduler",
                description: "Scalable microservices architecture for managing millions of concurrent tasks. Built with fault tolerance, load balancing, and real-time monitoring capabilities.",
                tech: ["C++", "Redis", "Docker", "Kubernetes"],
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
                demoUrl: "",
                githubUrl: "",
                featured: true
            },
            {
                title: "Real-Time Collaboration Tool",
                description: "WebSocket-based collaborative editing platform with conflict resolution. Supports multiple users, version history, and seamless synchronization.",
                tech: ["JavaScript", "WebSocket", "React", "MongoDB"],
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
                demoUrl: "",
                githubUrl: "",
                featured: false
            },
            {
                title: "Neural Network Visualizer",
                description: "Interactive 3D visualization of neural network architectures and training processes. Helps understand deep learning concepts through visual exploration.",
                tech: ["Python", "Three.js", "PyTorch", "WebGL"],
                image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
                demoUrl: "",
                githubUrl: "",
                featured: true
            },
            {
                title: "Cloud Infrastructure Manager",
                description: "Automated deployment and monitoring system for cloud resources. Features infrastructure-as-code, auto-scaling, and comprehensive logging.",
                tech: ["Node.js", "AWS", "Terraform", "GraphQL"],
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
                demoUrl: "",
                githubUrl: "",
                featured: false
            },
            {
                title: "Blockchain Voting System",
                description: "Secure, transparent voting platform using blockchain technology. Ensures vote integrity, anonymity, and verifiable results.",
                tech: ["Solidity", "Web3.js", "React", "IPFS"],
                image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
                demoUrl: "",
                githubUrl: "",
                featured: false
            }
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
            email: "karthik@example.com",
            linkedin: "https://linkedin.com",
            github: "https://github.com",
            twitter: "https://twitter.com"
        },
        footer: {
            copyright: "© 2025 Karthik Raman",
            builtWith: "Built with React, GSAP & Framer Motion",
            tagline: "Crafted with ❤️ and lots of ☕"
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
