export const SKILL_CATEGORIES = [
    "Programming & Development",
    "Design & Creative",
    "Data, AI & Research",
    "Business, Professional & Productivity",
    "Arts, Music & Creative Crafts",
    "Academic & Technical Subjects",
    "Soft Skills & Personal Growth",
    "Misc & Campus Skills"
];

export const ALL_SKILLS = [
    /* CATEGORY 1 — Programming & Development */
    // Core Languages
    { name: "C", slug: "c", category: "Programming & Development", icon: { type: "brand", name: "C", fallback: "Code" } },
    { name: "C++", slug: "cpp", category: "Programming & Development", icon: { type: "brand", name: "CPlusPlus", fallback: "Code" } },
    { name: "Java", slug: "java", category: "Programming & Development", icon: { type: "brand", name: "Java", fallback: "Coffee" } },
    { name: "Python", slug: "python", category: "Programming & Development", icon: { type: "brand", name: "Python", fallback: "Terminal" } },
    { name: "JavaScript", slug: "javascript", category: "Programming & Development", icon: { type: "brand", name: "JavaScript", fallback: "Code" } },
    { name: "TypeScript", slug: "typescript", category: "Programming & Development", icon: { type: "brand", name: "TypeScript", fallback: "Code" } },
    { name: "Go", slug: "go", category: "Programming & Development", icon: { type: "brand", name: "Go", fallback: "Terminal" } },
    { name: "Rust", slug: "rust", category: "Programming & Development", icon: { type: "brand", name: "Rust", fallback: "Settings" } },
    { name: "Kotlin", slug: "kotlin", category: "Programming & Development", icon: { type: "brand", name: "Kotlin", fallback: "Smartphone" } },
    { name: "Swift", slug: "swift", category: "Programming & Development", icon: { type: "brand", name: "Swift", fallback: "Smartphone" } },
    { name: "PHP", slug: "php", category: "Programming & Development", icon: { type: "brand", name: "PHP", fallback: "Server" } },
    { name: "R", slug: "r", category: "Programming & Development", icon: { type: "brand", name: "R", fallback: "BarChart" } },

    // Web Dev
    { name: "HTML", slug: "html", category: "Programming & Development", icon: { type: "brand", name: "HTML5", fallback: "Layout" } },
    { name: "CSS", slug: "css", category: "Programming & Development", icon: { type: "brand", name: "CSS3", fallback: "Palette" } },
    { name: "React", slug: "react", category: "Programming & Development", icon: { type: "brand", name: "React", fallback: "Atom" } },
    { name: "Next.js", slug: "next-js", category: "Programming & Development", icon: { type: "brand", name: "Next.js", fallback: "Box" } },
    { name: "Node.js", slug: "node-js", category: "Programming & Development", icon: { type: "brand", name: "Node.js", fallback: "Server" } },
    { name: "Express.js", slug: "express-js", category: "Programming & Development", icon: { type: "brand", name: "Express", fallback: "Server" } },
    { name: "Django", slug: "django", category: "Programming & Development", icon: { type: "brand", name: "Django", fallback: "Database" } },
    { name: "Flask", slug: "flask", category: "Programming & Development", icon: { type: "brand", name: "Flask", fallback: "Beaker" } },
    { name: "Spring Boot", slug: "spring-boot", category: "Programming & Development", icon: { type: "brand", name: "Spring", fallback: "Leaf" } },
    { name: "Tailwind CSS", slug: "tailwind-css", category: "Programming & Development", icon: { type: "brand", name: "TailwindCSS", fallback: "Wind" } },
    { name: "Bootstrap", slug: "bootstrap", category: "Programming & Development", icon: { type: "brand", name: "Bootstrap", fallback: "Layout" } },
    { name: "Angular", slug: "angular", category: "Programming & Development", icon: { type: "brand", name: "Angular", fallback: "Box" } },
    { name: "Vue.js", slug: "vue-js", category: "Programming & Development", icon: { type: "brand", name: "Vue.js", fallback: "Box" } },

    // Mobile Dev
    { name: "Flutter", slug: "flutter", category: "Programming & Development", icon: { type: "brand", name: "Flutter", fallback: "Smartphone" } },
    { name: "React Native", slug: "react-native", category: "Programming & Development", icon: { type: "brand", name: "React", fallback: "Smartphone" } },
    { name: "Android", slug: "android", category: "Programming & Development", icon: { type: "brand", name: "Android", fallback: "Smartphone" } },
    { name: "iOS", slug: "ios", category: "Programming & Development", icon: { type: "brand", name: "Apple", fallback: "Smartphone" } },

    // Backend & APIs
    { name: "REST API Design", slug: "rest-api-design", category: "Programming & Development", icon: { type: "lucide", name: "Globe", fallback: "Globe" } },
    { name: "GraphQL", slug: "graphql", category: "Programming & Development", icon: { type: "brand", name: "GraphQL", fallback: "Share2" } },
    { name: "Microservices", slug: "microservices", category: "Programming & Development", icon: { type: "lucide", name: "Boxes", fallback: "Boxes" } },
    { name: "Authentication", slug: "authentication", category: "Programming & Development", icon: { type: "lucide", name: "Lock", fallback: "Lock" } },

    // Databases
    { name: "SQL", slug: "sql", category: "Programming & Development", icon: { type: "lucide", name: "Database", fallback: "Database" } },
    { name: "PostgreSQL", slug: "postgresql", category: "Programming & Development", icon: { type: "brand", name: "PostgreSQL", fallback: "Database" } },
    { name: "MySQL", slug: "mysql", category: "Programming & Development", icon: { type: "brand", name: "MySQL", fallback: "Database" } },
    { name: "MongoDB", slug: "mongodb", category: "Programming & Development", icon: { type: "brand", name: "MongoDB", fallback: "Database" } },
    { name: "Redis", slug: "redis", category: "Programming & Development", icon: { type: "brand", name: "Redis", fallback: "Database" } },
    { name: "Firebase Firestore", slug: "firebase-firestore", category: "Programming & Development", icon: { type: "brand", name: "Firebase", fallback: "Database" } },
    { name: "Supabase", slug: "supabase", category: "Programming & Development", icon: { type: "brand", name: "Supabase", fallback: "Database" } },

    // DevOps
    { name: "Docker", slug: "docker", category: "Programming & Development", icon: { type: "brand", name: "Docker", fallback: "Container" } },
    { name: "Kubernetes", slug: "kubernetes", category: "Programming & Development", icon: { type: "brand", name: "Kubernetes", fallback: "Ship" } },
    { name: "CI/CD", slug: "ci-cd", category: "Programming & Development", icon: { type: "lucide", name: "Repeat", fallback: "Repeat" } },
    { name: "Linux", slug: "linux", category: "Programming & Development", icon: { type: "brand", name: "Linux", fallback: "Terminal" } },
    { name: "Git", slug: "git", category: "Programming & Development", icon: { type: "brand", name: "Git", fallback: "GitBranch" } },
    { name: "AWS", slug: "aws", category: "Programming & Development", icon: { type: "brand", name: "AmazonAWS", fallback: "Cloud" } },
    { name: "GCP", slug: "gcp", category: "Programming & Development", icon: { type: "brand", name: "GoogleCloud", fallback: "Cloud" } },
    { name: "Azure", slug: "azure", category: "Programming & Development", icon: { type: "brand", name: "MicrosoftAzure", fallback: "Cloud" } },


    /* CATEGORY 2 — Design & Creative */
    // UI/UX
    { name: "UI/UX", slug: "ui-ux", category: "Design & Creative", icon: { type: "lucide", name: "Layout", fallback: "Layout" } },
    { name: "Wireframing", slug: "wireframing", category: "Design & Creative", icon: { type: "lucide", name: "PenTool", fallback: "PenTool" } },
    { name: "Prototyping", slug: "prototyping", category: "Design & Creative", icon: { type: "lucide", name: "Play", fallback: "Play" } },
    { name: "User Research", slug: "user-research", category: "Design & Creative", icon: { type: "lucide", name: "Users", fallback: "Users" } },
    { name: "Information Architecture", slug: "information-architecture", category: "Design & Creative", icon: { type: "lucide", name: "GitGraph", fallback: "GitGraph" } },
    { name: "Design Systems", slug: "design-systems", category: "Design & Creative", icon: { type: "lucide", name: "Grid", fallback: "Grid" } },

    // Tools
    { name: "Figma", slug: "figma", category: "Design & Creative", icon: { type: "brand", name: "Figma", fallback: "PenTool" } },
    { name: "Adobe XD", slug: "adobe-xd", category: "Design & Creative", icon: { type: "brand", name: "AdobeXD", fallback: "PenTool" } },
    { name: "Photoshop", slug: "photoshop", category: "Design & Creative", icon: { type: "brand", name: "AdobePhotoshop", fallback: "Image" } },
    { name: "Illustrator", slug: "illustrator", category: "Design & Creative", icon: { type: "brand", name: "AdobeIllustrator", fallback: "PenTool" } },
    { name: "Canva", slug: "canva", category: "Design & Creative", icon: { type: "brand", name: "Canva", fallback: "Image" } },

    // Creative
    { name: "Graphic Design", slug: "graphic-design", category: "Design & Creative", icon: { type: "lucide", name: "Palette", fallback: "Palette" } },
    { name: "Branding", slug: "branding", category: "Design & Creative", icon: { type: "lucide", name: "Tag", fallback: "Tag" } },
    { name: "Motion Graphics", slug: "motion-graphics", category: "Design & Creative", icon: { type: "lucide", name: "Film", fallback: "Film" } },
    { name: "Video Editing", slug: "video-editing", category: "Design & Creative", icon: { type: "lucide", name: "Video", fallback: "Video" } },
    { name: "3D Modeling", slug: "3d-modeling", category: "Design & Creative", icon: { type: "lucide", name: "Box", fallback: "Box" } },
    { name: "Blender", slug: "blender", category: "Design & Creative", icon: { type: "brand", name: "Blender", fallback: "Box" } },
    { name: "Animation Basics", slug: "animation-basics", category: "Design & Creative", icon: { type: "lucide", name: "Activity", fallback: "Activity" } },
    { name: "Poster Design", slug: "poster-design", category: "Design & Creative", icon: { type: "lucide", name: "Image", fallback: "Image" } },
    { name: "Presentation Design", slug: "presentation-design", category: "Design & Creative", icon: { type: "lucide", name: "MonitorPlay", fallback: "MonitorPlay" } },


    /* CATEGORY 3 — Data, AI & Research */
    { name: "Machine Learning", slug: "machine-learning", category: "Data, AI & Research", icon: { type: "lucide", name: "Brain", fallback: "Brain" } },
    { name: "Deep Learning", slug: "deep-learning", category: "Data, AI & Research", icon: { type: "lucide", name: "Network", fallback: "Network" } },
    { name: "Data Structures & Algorithms", slug: "dsa", category: "Data, AI & Research", icon: { type: "lucide", name: "Binary", fallback: "Binary" } },
    { name: "Data Science", slug: "data-science", category: "Data, AI & Research", icon: { type: "lucide", name: "BarChart", fallback: "BarChart" } },
    { name: "Data Visualization", slug: "data-visualization", category: "Data, AI & Research", icon: { type: "lucide", name: "PieChart", fallback: "PieChart" } },
    { name: "SQL for Analytics", slug: "sql-analytics", category: "Data, AI & Research", icon: { type: "lucide", name: "Database", fallback: "Database" } },

    // Tools/Libs
    { name: "Pandas", slug: "pandas", category: "Data, AI & Research", icon: { type: "brand", name: "Pandas", fallback: "Table" } },
    { name: "NumPy", slug: "numpy", category: "Data, AI & Research", icon: { type: "brand", name: "NumPy", fallback: "Calculator" } },
    { name: "TensorFlow", slug: "tensorflow", category: "Data, AI & Research", icon: { type: "brand", name: "TensorFlow", fallback: "Brain" } },
    { name: "PyTorch", slug: "pytorch", category: "Data, AI & Research", icon: { type: "brand", name: "PyTorch", fallback: "Flame" } },
    { name: "NLP", slug: "nlp", category: "Data, AI & Research", icon: { type: "lucide", name: "MessageSquare", fallback: "MessageSquare" } },
    { name: "Computer Vision", slug: "computer-vision", category: "Data, AI & Research", icon: { type: "lucide", name: "Eye", fallback: "Eye" } },
    { name: "Research Writing", slug: "research-writing", category: "Data, AI & Research", icon: { type: "lucide", name: "FileText", fallback: "FileText" } },
    { name: "Academic Research", slug: "academic-research", category: "Data, AI & Research", icon: { type: "lucide", name: "BookOpen", fallback: "BookOpen" } },
    { name: "Statistics", slug: "statistics", category: "Data, AI & Research", icon: { type: "lucide", name: "Sigma", fallback: "Sigma" } },


    /* CATEGORY 4 — Business, Professional & Productivity */
    { name: "Project Management", slug: "project-management", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Kanban", fallback: "Kanban" } },
    { name: "Product Management", slug: "product-management", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Package", fallback: "Package" } },
    { name: "Agile", slug: "agile", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "RefreshCcw", fallback: "RefreshCcw" } },
    { name: "Scrum", slug: "scrum", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Users", fallback: "Users" } },
    { name: "Entrepreneurship", slug: "entrepreneurship", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Briefcase", fallback: "Briefcase" } },
    { name: "Business Strategy", slug: "business-strategy", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "TrendingUp", fallback: "TrendingUp" } },
    { name: "Market Research", slug: "market-research", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Search", fallback: "Search" } },
    { name: "Digital Marketing", slug: "digital-marketing", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Megaphone", fallback: "Megaphone" } },
    { name: "SEO", slug: "seo", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Globe", fallback: "Globe" } },
    { name: "Social Media Management", slug: "social-media", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Share2", fallback: "Share2" } },
    { name: "Content Writing", slug: "content-writing", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Pen", fallback: "Pen" } },
    { name: "Copywriting", slug: "copywriting", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Highlighter", fallback: "Highlighter" } },
    { name: "Resume Building", slug: "resume-building", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "FileText", fallback: "FileText" } },
    { name: "Public Speaking", slug: "public-speaking", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Mic", fallback: "Mic" } },
    { name: "Interview Preparation", slug: "interview-prep", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "UserCheck", fallback: "UserCheck" } },
    { name: "Leadership", slug: "leadership", category: "Business, Professional & Productivity", icon: { type: "lucide", name: "Award", fallback: "Award" } },


    /* CATEGORY 5 — Arts, Music & Creative Crafts */
    { name: "Drawing", slug: "drawing", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Pencil", fallback: "Pencil" } },
    { name: "Sketching", slug: "sketching", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "PenTool", fallback: "PenTool" } },
    { name: "Painting", slug: "painting", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Brush", fallback: "Brush" } },
    { name: "Digital Art", slug: "digital-art", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Monitor", fallback: "Monitor" } },
    { name: "Music Production", slug: "music-production", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Music", fallback: "Music" } },
    { name: "Singing", slug: "singing", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Mic2", fallback: "Mic2" } },
    { name: "Guitar", slug: "guitar", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Music", fallback: "Music" } },
    { name: "Piano", slug: "piano", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Music", fallback: "Music" } },
    { name: "Creative Writing", slug: "creative-writing", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Feather", fallback: "Feather" } },
    { name: "Storytelling", slug: "storytelling", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "BookOpen", fallback: "BookOpen" } },
    { name: "Poetry", slug: "poetry", category: "Arts, Music & Creative Crafts", icon: { type: "lucide", name: "Scroll", fallback: "Scroll" } },


    /* CATEGORY 6 — Academic & Technical Subjects */
    { name: "Mathematics", slug: "mathematics", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Calculator", fallback: "Calculator" } },
    { name: "Applied Physics", slug: "applied-physics", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Atom", fallback: "Atom" } },
    { name: "Engineering Fundamentals", slug: "engineering", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Hammer", fallback: "Hammer" } },
    { name: "Soft Computing", slug: "soft-computing", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Brain", fallback: "Brain" } },
    { name: "Cloud Computing", slug: "cloud-computing", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Cloud", fallback: "Cloud" } },
    { name: "Cybersecurity Basics", slug: "cybersecurity", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "ShieldCheck", fallback: "ShieldCheck" } },
    { name: "Ethical Hacking", slug: "ethical-hacking", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Terminal", fallback: "Terminal" } },
    { name: "Operating Systems", slug: "operating-systems", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Cpu", fallback: "Cpu" } },
    { name: "Computer Networks", slug: "computer-networks", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Network", fallback: "Network" } },
    { name: "DBMS", slug: "dbms", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Database", fallback: "Database" } },
    { name: "OOP", slug: "oop", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Box", fallback: "Box" } },
    { name: "Software Engineering", slug: "software-engineering", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Code2", fallback: "Code2" } },
    { name: "Graph Theory", slug: "graph-theory", category: "Academic & Technical Subjects", icon: { type: "lucide", name: "Share2", fallback: "Share2" } },


    /* CATEGORY 7 — Soft Skills & Personal Growth */
    { name: "Communication Skills", slug: "communication", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "MessageCircle", fallback: "MessageCircle" } },
    { name: "Critical Thinking", slug: "critical-thinking", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "Lightbulb", fallback: "Lightbulb" } },
    { name: "Team Collaboration", slug: "collaboration", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "Users", fallback: "Users" } },
    { name: "Time Management", slug: "time-management", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "Clock", fallback: "Clock" } },
    { name: "Problem Solving", slug: "problem-solving", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "Puzzle", fallback: "Puzzle" } },
    { name: "Mentoring", slug: "mentoring", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "HelpingHand", fallback: "HelpingHand" } },
    { name: "Teaching", slug: "teaching", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "GraduationCap", fallback: "GraduationCap" } },
    { name: "Negotiation", slug: "negotiation", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "Handshake", fallback: "Handshake" } },
    { name: "Confidence Building", slug: "confidence", category: "Soft Skills & Personal Growth", icon: { type: "lucide", name: "Smile", fallback: "Smile" } },


    /* CATEGORY 8 — Misc & Campus Skills */
    { name: "Hackathon Navigation", slug: "hackathon", category: "Misc & Campus Skills", icon: { type: "lucide", name: "Trophy", fallback: "Trophy" } },
    { name: "Competitive Programming", slug: "competitive-programming", category: "Misc & Campus Skills", icon: { type: "lucide", name: "Code", fallback: "Code" } },
    { name: "Startup Pitching", slug: "startup-pitching", category: "Misc & Campus Skills", icon: { type: "lucide", name: "Presentation", fallback: "Presentation" } },
    { name: "Event Management", slug: "event-management", category: "Misc & Campus Skills", icon: { type: "lucide", name: "Calendar", fallback: "Calendar" } },
    { name: "Photography", slug: "photography", category: "Misc & Campus Skills", icon: { type: "lucide", name: "Camera", fallback: "Camera" } },
    { name: "Videography", slug: "videography", category: "Misc & Campus Skills", icon: { type: "lucide", name: "Video", fallback: "Video" } },
    { name: "Fitness Coaching", slug: "fitness", category: "Misc & Campus Skills", icon: { type: "lucide", name: "Dumbbell", fallback: "Dumbbell" } },
    { name: "Finance Basics", slug: "finance-basics", category: "Misc & Campus Skills", icon: { type: "lucide", name: "DollarSign", fallback: "DollarSign" } },
    { name: "Personal Branding", slug: "personal-branding", category: "Misc & Campus Skills", icon: { type: "lucide", name: "UserPlus", fallback: "UserPlus" } },
];

export const getSkillBySlug = (slug) => {
    return ALL_SKILLS.find(skill => skill.slug === slug);
};

export const getSkillsByCategory = (category) => {
    return ALL_SKILLS.filter(skill => skill.category === category);
};
