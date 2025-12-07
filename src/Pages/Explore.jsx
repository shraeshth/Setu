import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LayoutBento from "../Components/Explore/LayoutBento";
import SearchResultsDisplay from "../Components/Explore/SearchResultsDisplay";
import { useFirestore } from "../Hooks/useFirestore";
import { Loader } from "lucide-react";
import RecentlySearchedStrip from "../Components/Explore/RecentlySearchedStrip";
import { useRecentSearches } from "../Hooks/useRecentSearches";

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCollection } = useFirestore();
  const { addSearch } = useRecentSearches();
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    members: [],
    projects: [],
    teams: []
  });

  // Handle URL params
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (queryText) => {
    setSearchQuery(queryText);
    if (!queryText.trim()) {
      setSearchActive(false);
      return;
    }

    // Add to recent searches
    addSearch(queryText);

    setSearchActive(true);
    setLoading(true);

    try {
      // Fetch Users and Projects
      // Note: Firestore doesn't support native full-text search. 
      // For MVP, we fetch a batch and filter client-side.
      // In production, use Algolia or ElasticSearch.

      const [users, projects] = await Promise.all([
        getCollection("users"),
        getCollection("collaborations")
      ]);

      const lowerQuery = queryText.toLowerCase();

      const filteredUsers = users.filter(u =>
        (u.displayName && u.displayName.toLowerCase().includes(lowerQuery)) ||
        (u.skills && u.skills.some(s => s.toLowerCase().includes(lowerQuery)))
      ).map(u => ({
        id: u.id,
        name: u.displayName,
        skills: u.skills || [],
        credibility: u.credibilityScore || 0
      }));

      const filteredProjects = projects.filter(p =>
        (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
      ).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        stack: p.techStack || [], // Assuming techStack field
        teamSize: p.memberIds ? p.memberIds.length : 0
      }));

      setSearchResults({
        members: filteredUsers,
        projects: filteredProjects,
        teams: [] // Teams collection not fully defined yet
      });

    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden px-4 mt-0 font-gilroy bg-[#F9F8F3] dark:bg-[#0B0B0B] transition-colors duration-300">

      {/* RECENTLY SEARCHED STRIP */}
      <div className="flex-none pt-2">
        <RecentlySearchedStrip />
      </div>

      {/* MAIN AREA (Rigid Bento layout) */}
      <div className="flex-1 min-h-0 rounded-xl overflow-hidden pb-4 pt-2">
        <LayoutBento />
      </div>

      {/* SEARCH OVERLAY */}
      {searchActive && (
        <SearchResultsDisplay
          query={searchQuery}
          results={searchResults}
          loading={loading}
          onClose={() => {
            setSearchActive(false);
            setSearchParams({}); // Clear URL param
          }}
        />
      )}
    </div>
  );
}
