// components/Explore/ExploreByCategory.jsx
import React from "react";

export default function ExploreByCategory() {
  const categories = [
    { name: 'Frontend', count: 24, icon: '🎨' },
    { name: 'Backend', count: 18, icon: '⚙️' },
    { name: 'AI', count: 15, icon: '🤖' },
    { name: 'SaaS', count: 32, icon: '☁️' },
    { name: 'Tools', count: 21, icon: '🔧' },
    { name: 'Productivity', count: 19, icon: '⚡' },
    { name: 'EdTech', count: 12, icon: '📚' },
    { name: 'Research', count: 9, icon: '🔬' },
    { name: 'Analytics', count: 16, icon: '📊' }
  ];

  return (
    <div className="h-full bg-neutral-900/50 backdrop-blur-xl 
      rounded-2xl border border-neutral-800 p-6">

      <h3 className="text-lg font-bold mb-4">Explore by Category</h3>

      <div className="grid grid-cols-3 gap-3 h-[calc(100%-3rem)]">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="
              bg-neutral-950/50 backdrop-blur-sm 
              rounded-xl border border-neutral-700 
              hover:border-orange-500 transition-all 
              cursor-pointer p-4 flex flex-col justify-between 
              group hover:scale-[1.02] relative overflow-hidden
            "
          >
            <div className="absolute top-0 right-0 w-16 h-16 
              bg-gradient-to-bl from-orange-600/20 to-transparent 
              rounded-bl-3xl"></div>

            <div className="relative z-10">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-bold group-hover:text-orange-400 transition-colors">
                {cat.name}
              </div>
              <div className="text-xs text-neutral-400">
                {cat.count} projects
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
