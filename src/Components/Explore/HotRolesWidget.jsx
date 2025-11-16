import React from "react";

export default function HotRolesWidget() {
  const roles = [
    { role: "ML Engineer", openings: 4, heat: 3 },
    { role: "UI Designer", openings: 6, heat: 4 },
    { role: "Backend Dev", openings: 3, heat: 2 },
  ];

  return (
    <div className="h-full flex flex-col p-0">
      <div className="space-y-3 overflow-y-auto pr-1">

        {roles.map((r, i) => (
          <div
            key={i}
            className="
              flex flex-col gap-1 cursor-pointer  
              pb-2
            "
          >

            {/* Header Row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#2B2B2B] dark:text-gray-200">
                {r.role}
              </span>
              <span className="text-[10px] font-medium text-[#8A877C] dark:text-gray-400">
                {r.openings} openings
              </span>
            </div>

            {/* Brutalist Line Histogram */}
            <div className="flex gap-1 h-[6px]">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className={`
                    flex-1 rounded-sm 
                    transition-all
                    ${idx < r.heat 
                      ? "bg-[#D94F04]"        // strong brutalist block
                      : "bg-[#E2E1DB] dark:bg-[#3A3A3A]"  // neutral filler
                    }
                  `}
                ></div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
