import React, { useState, useEffect } from "react";
import {
    Book, Flag, Star, Bell, MessageSquare, Shield, HelpCircle, Layout,
    Users, BarChart3, AlertTriangle, Zap, Search, ChevronRight, Menu
} from "lucide-react";

export default function Help() {
    const [activeTab, setActiveTab] = useState("getting-started");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Categories
    const categories = [
        { id: "getting-started", label: "Getting Started", icon: Flag },
        { id: "projects", label: "Projects & Collaboration", icon: Layout },
        { id: "skills", label: "Skills & Matching", icon: Star },
        { id: "credibility", label: "Credibility Score", icon: BarChart3 },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "communication", label: "Chat & Communication", icon: MessageSquare },
        { id: "safety", label: "Safety & Privacy", icon: Shield },
        { id: "issues", label: "Common Issues & Fixes", icon: AlertTriangle },
        { id: "app-controls", label: "App Controls & UI Guide", icon: Menu },
        { id: "owners", label: "For Project Owners", icon: Users },
        { id: "collaborators", label: "For Collaborators", icon: Zap },
        { id: "advanced", label: "Advanced Features", icon: Star }, // Reusing Star for now
        { id: "support", label: "Contact & Support", icon: HelpCircle },
    ];

    // Mock content map
    const content = {
        "getting-started": (
            <>
                <SectionTitle title="Getting Started with Setu" subtitle="Your journey to meaningful collaboration starts here." />
                <HelpArticle title="How to Create an Account">
                    <p>Sign up quickly using your email or Google account. We recommend using your professional email if you plan to join organizational workspaces.</p>
                </HelpArticle>
                <HelpArticle title="Setting Up Your Profile">
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li><strong>Photo & Bio:</strong> Add a clear profile picture and a short bio to build trust.</li>
                        <li><strong>Skills:</strong> Tag your core skills (e.g., React, Python, Design). This drives project recommendations.</li>
                        <li><strong>Interests:</strong> List what you want to learn to get matched with mentorship opportunities.</li>
                    </ul>
                </HelpArticle>
                <HelpArticle title="Navigating the Home Feed">
                    <p>The Home Feed (My Feed) is your central dashboard. It shows:</p>
                    <ul className="list-disc pl-5 mt-2">
                        <li><strong>Team Feed:</strong> Potential collaborators based on your skills.</li>
                        <li><strong>Project Feed:</strong> Open projects hiring for roles you fit.</li>
                        <li><strong>Recent Activity:</strong> Updates from your network and joined projects.</li>
                    </ul>
                </HelpArticle>
            </>
        ),
        "projects": (
            <>
                <SectionTitle title="Projects & Collaboration" subtitle="Build together, ship faster." />
                <HelpArticle title="Creating a Project">
                    <p>Go to your Workspace and click <strong>"New Project"</strong>. Define the scope, required roles, and tech stack. Clear descriptions attract better talent.</p>
                </HelpArticle>
                <HelpArticle title="Joining a Project">
                    <p>Browse the <strong>Project Feed</strong> or <strong>Explore</strong> page. If you see a project you like, click <strong>"Request to Join"</strong>. The owner will review your profile and credibility score.</p>
                </HelpArticle>
                <HelpArticle title="Task Management">
                    <p>Once in a workspace, use the <strong>Kanban Board</strong> to track progress. Drag tasks from To-Do &rarr; In Progress &rarr; Done to keep everyone synced.</p>
                </HelpArticle>
            </>
        ),
        "skills": (
            <>
                <SectionTitle title="Skills & Matching" subtitle="Find the right people for the right job." />
                <HelpArticle title="How Skill Tags Work">
                    <p>We use a standardized tag system. When you add "React" to your profile, our engine matches you with projects needing "React".</p>
                </HelpArticle>
                <HelpArticle title="Improving Recommendations">
                    <p>Keep your skills updated! The more specific you are (e.g., "Next.js" vs just "JavaScript"), the better your matches will be.</p>
                </HelpArticle>
            </>
        ),
        "credibility": (
            <>
                <SectionTitle title="Credibility Score" subtitle="The trust engine of Setu." />
                <HelpArticle title="What is it?">
                    <p>Your Credibility Score (0-5.0) reflects your reliability as a collaborator. It is NOT just about coding skill—it measures how good you are to work with.</p>
                </HelpArticle>
                <HelpArticle title="How is it calculated?">
                    <p>It acts like a credit score, updating weekly based on 5 pillars:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Communication:</strong> Responsiveness and clarity.</li>
                        <li><strong>Teamwork:</strong> Peer reviews and collaboration.</li>
                        <li><strong>Delivery:</strong> Finishing assigned tasks on time.</li>
                        <li><strong>Initiative:</strong> Proactive contributions.</li>
                        <li><strong>Consistency:</strong> Regular activity over time.</li>
                    </ul>
                </HelpArticle>
                <HelpArticle title="How to Increase Score">
                    <p>Complete tasks, get positive reviews from teammates, and maintain a "streak" of daily activity.</p>
                </HelpArticle>
            </>
        ),
        "notifications": (
            <>
                <SectionTitle title="Notifications" subtitle="Stay in the loop without the noise." />
                <HelpArticle title="Types of Notifications">
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Requests:</strong> Project join requests or connection invites.</li>
                        <li><strong>Mentions:</strong> When someone tags you in a chat.</li>
                        <li><strong>System:</strong> Credibility score updates or platform announcements.</li>
                    </ul>
                </HelpArticle>
            </>
        ),
        "communication": (
            <>
                <SectionTitle title="Chat & Communication" subtitle="Seamless team sync." />
                <HelpArticle title="Direct Messaging">
                    <p>You can DM any connection. Be respectful and professional. Project workspaces also have dedicated group chats.</p>
                </HelpArticle>
                <HelpArticle title="Privacy">
                    <p>Chats are private between participants. We do not sell your conversation data.</p>
                </HelpArticle>
            </>
        ),
        "safety": (
            <>
                <SectionTitle title="Safety & Privacy" subtitle="Your data, your control." />
                <HelpArticle title="What is visible?">
                    <p>Your profile (photo, name, bio, skills, credibility score) is public to other users to facilitate networking. Your email is hidden unless you share it.</p>
                </HelpArticle>
                <HelpArticle title="Reporting">
                    <p>If you encounter harassment, please use the <strong>Report</strong> button on the user's profile or contact support immediately.</p>
                </HelpArticle>
            </>
        ),
        "issues": (
            <>
                <SectionTitle title="Common Issues & Fixes" subtitle="Troubleshooting 101." />
                <HelpArticle title="I can't join a project">
                    <p>The project might be full or archived. Check the project status tag (e.g., "Hiring" vs "Full").</p>
                </HelpArticle>
                <HelpArticle title="Score not updating">
                    <p>Credibility scores update <strong>weekly</strong> (every Sunday night). Daily actions contribute to the next update.</p>
                </HelpArticle>
            </>
        ),
        "app-controls": (
            <>
                <SectionTitle title="App Controls & UI Guide" subtitle="Master the interface." />
                <HelpArticle title="Dashboards">
                    <p>Use the <strong>Left Sidebar</strong> to switch between Home, Projects, Explore, and Profile. Use the <strong>Right Sidebar</strong> for quick stats and news.</p>
                </HelpArticle>
                <HelpArticle title="Color Indicators">
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><span className="text-orange-500 font-bold">Orange:</span> Primary actions & Credibility.</li>
                        <li><span className="text-green-500 font-bold">Green:</span> Success / High Performance.</li>
                        <li><span className="text-blue-500 font-bold">Blue:</span> Info / Neutral status.</li>
                    </ul>
                </HelpArticle>
            </>
        ),
        "owners": (
            <>
                <SectionTitle title="For Project Owners" subtitle="Lead with confidence." />
                <HelpArticle title="Reviewing Applicants">
                    <p>Check their Credibility Score and portfolio links before accepting. A high score usually indicates reliability.</p>
                </HelpArticle>
                <HelpArticle title="Setting Deadlines">
                    <p>Be clear. Add due dates to tasks in the Kanban board so the "Delivery" score metric can be tracked accurately.</p>
                </HelpArticle>
            </>
        ),
        "collaborators": (
            <>
                <SectionTitle title="For Collaborators" subtitle="Be the teammate everyone wants." />
                <HelpArticle title="Contributing">
                    <p>Pick tasks from the "To Do" column. Move them to "In Progress" while working, and "Done" when finished.</p>
                </HelpArticle>
                <HelpArticle title="Peer Reviews">
                    <p>At the end of a sprint/project, leave honest reviews for your leader and peers. This feeds into the ecosystem's trust.</p>
                </HelpArticle>
            </>
        ),
        "advanced": (
            <>
                <SectionTitle title="Advanced Features" subtitle="Power user tools." />
                <HelpArticle title="AI Matches">
                    <p>Our algorithms analyze your past project success to suggest new teammates who complement your working style.</p>
                </HelpArticle>
            </>
        ),
        "support": (
            <>
                <SectionTitle title="Contact & Support" subtitle="We're here to help." />
                <HelpArticle title="Report Bugs">
                    <p>Found a glitch? Email us at <a href="mailto:support@setu.com" className="text-orange-500 hover:underline">support@setu.com</a>.</p>
                </HelpArticle>
                <HelpArticle title="Feature Requests">
                    <p>We love feedback! Drop a suggestion in the #feedback channel or DM the admin.</p>
                </HelpArticle>
            </>
        )
    };

    const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

    return (
        <div className="flex h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] overflow-hidden -mt-6"> {/* Negative margin to offset potential padding from MainLayout if needed */}

            {/* SIDEBAR */}
            <div className={`
        ${isSidebarOpen ? "w-[280px]" : "w-0 opacity-0"} 
        transition-all duration-300 ease-in-out
        border-r border-[#E2E1DB] dark:border-[#333]
        text-[#2B2B2B] dark:text-[#EAEAEA]
        bg-[#FCFCF9] dark:bg-[#1A1A1A]
        flex flex-col overflow-hidden whitespace-nowrap
      `}>
                <div className="p-6 border-b border-[#E2E1DB] dark:border-[#333] flex justify-between items-center">
                    <h2 className="font-bold text-xl flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="text-[#D94F04]" /> Help Center
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                    {categories.map(cat => {
                        const Icon = cat.icon;
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setActiveTab(cat.id);
                                    // On mobile, maybe close sidebar?
                                }}
                                className={`
                   w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                   ${isActive
                                        ? "bg-[#D94F04] text-white shadow-md"
                                        : "hover:bg-[#F0EFE9] dark:hover:bg-[#2B2B2B] text-gray-600 dark:text-gray-400"}
                 `}
                            >
                                <Icon size={18} />
                                {cat.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* HEADER - Only visible when sidebar closed to provide open toggle */}
                <div className={`h-16 border-b border-[#E2E1DB] dark:border-[#333] flex items-center px-6 bg-[#FCFCF9] dark:bg-[#1A1A1A] ${isSidebarOpen ? 'hidden' : 'flex'}`}>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 mr-4 rounded-md hover:bg-gray-200 dark:hover:bg-[#333] transition"
                        title="Open Menu"
                    >
                        <Menu size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="font-bold text-lg text-[#2B2B2B] dark:text-white">Help Center</div>
                </div>

                {/* CONTENT SCROLLABLE */}
                <div className="flex-1 overflow-y-auto p-8 relative scrollbar-thin dark:scrollbar-thumb-gray-700">
                    <div className="max-w-3xl mx-auto pb-20">
                        {/* Mobile/Toggle fallback logic if needed */}
                        {
                            // Simple Search Filter logic (basic)
                            searchQuery.trim() !== "" ? (
                                <SearchResults query={searchQuery} />
                            ) : (
                                <div className="animate-fade-in">
                                    {content[activeTab]}
                                </div>
                            )
                        }

                        {/* Footer Help Contact */}
                        <div className="mt-12 pt-8 border-t border-[#E2E1DB] dark:border-[#333] text-center">
                            <p className="text-sm text-gray-500">
                                Still need help? <a href="#" className="text-[#D94F04] font-medium hover:underline">Contact Support</a>
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Sub-components for cleaner code
function SectionTitle({ title, subtitle }) {
    return (
        <div className="mb-8 border-b border-[#E2E1DB] dark:border-[#333] pb-6">
            <h1 className="text-3xl font-bold text-[#2B2B2B] dark:text-white mb-2">{title}</h1>
            <p className="text-lg text-[#8A877C] dark:text-gray-400">{subtitle}</p>
        </div>
    );
}

function HelpArticle({ title, children }) {
    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#2B2B2B] dark:text-gray-200 mb-3 flex items-center gap-2">
                {title}
                {/* <ChevronRight size={16} className="text-gray-400" /> */}
            </h3>
            <div className="text-[#555] dark:text-gray-400 leading-relaxed text-[15px] bg-white dark:bg-[#151515] p-5 rounded-xl border border-[#E2E1DB] dark:border-[#333]">
                {children}
            </div>
        </div>
    );
}

function SearchResults({ query }) {
    // A mock placeholder for search results
    return (
        <div className="text-center py-20 opacity-50">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-500">Searching for "{query}"...</h3>
            <p className="text-sm text-gray-400 mt-2">Search functionality is limited in this preview.</p>
        </div>
    )
}
