import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom"
import LeftSidebar from "../Components/LeftSIdebar";
import RightSidebar from "../Components/RightSidebar/RightSidebar.jsx";

export default function MainLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isExplorePage = pathname === "/explore";

  return (
    <div className="flex h-screen overflow-hidden font-sans 
      bg-[#F9F8F3] dark:bg-[#0B0B0B] text-[#2B2B2B] dark:text-gray-100">

      <LeftSidebar />

      {/* Scrollable main section */}
      <main className="flex-1 w-full py-6 overflow-y-auto">
        <Outlet />
      </main>

      {/* Pass the flag here */}
      <RightSidebar 
  isExplorePage={isExplorePage}
  isProfilePage={pathname.startsWith("/profile")}
/>

    </div>
  );
}
