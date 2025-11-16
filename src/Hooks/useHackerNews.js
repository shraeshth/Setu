import { useEffect, useState, useRef } from "react";


/**
 * useHackerNews
 * @param {object} opts
 *   - feed: 'top' | 'new' | 'best' (default 'top')
 *   - count: number of stories to return (default 6)
 *   - pollInterval: ms to refresh (default 10 minutes) ; set 0 to disable polling
 */
export default function useHackerNews({ feed = "top", count = 6, pollInterval = 10 * 60 * 1000 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // Helper: fetch item by id
  const fetchItem = async (id) => {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    if (!res.ok) throw new Error("HN item fetch failed");
    return res.json();
  };

  // Batching function to avoid too many simultaneous fetches
  const fetchItemsInBatches = async (ids, batchSize = 6) => {
    const results = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      const slice = ids.slice(i, i + batchSize);
      const batch = await Promise.all(slice.map((id) => fetchItem(id)));
      results.push(...batch);
      // short wait could be inserted if you're worried (await new Promise(r => setTimeout(r, 100));)
    }
    return results;
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) fetch id list
      const feedName = feed === "top" ? "topstories" : feed === "new" ? "newstories" : "beststories";
      const listRes = await fetch(`https://hacker-news.firebaseio.com/v0/${feedName}.json`);
      if (!listRes.ok) throw new Error("HN feed fetch failed");
      const ids = await listRes.json();

      // 2) take the top `count` ids
      const selected = Array.isArray(ids) ? ids.slice(0, count) : [];

      // 3) try get cached from localStorage (optional)
      const cachedRaw = localStorage.getItem("hn_cache_v1");
      let cached = {};
      try { cached = cachedRaw ? JSON.parse(cachedRaw) : {}; } catch (e) { cached = {}; }

      // 4) determine which ids to fetch (if cached and still fresh, use it)
      const now = Date.now();
      const freshThreshold = 5 * 60 * 1000; // 5 minutes cache freshness
      const toFetch = [];
      const results = [];

      selected.forEach((id) => {
        const c = cached[id];
        if (c && (now - c._cachedAt) < freshThreshold) {
          results.push(c.data);
        } else {
          toFetch.push(id);
        }
      });

      // 5) fetch missing items in batches
      if (toFetch.length) {
        const fetched = await fetchItemsInBatches(toFetch, 6);
        // store in cache
        fetched.forEach((it) => {
          if (!it) return;
          cached[it.id] = { data: it, _cachedAt: Date.now() };
          results.push(it);
        });
        localStorage.setItem("hn_cache_v1", JSON.stringify(cached));
      }

      // 6) sort results to match id order
      const ordered = selected.map((id) => results.find((r) => r && r.id === id)).filter(Boolean);

      if (mounted.current) {
        setItems(ordered);
        setLoading(false);
      }
    } catch (err) {
      if (mounted.current) {
        setError(err);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
    if (!pollInterval || pollInterval <= 0) return;
    const t = setInterval(load, pollInterval);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feed, count, pollInterval]);

  return { items, loading, error, reload: load };
}
