import { apiFetch } from "@/modules/auth/lib/auth-client";
import { useState, useEffect, useCallback } from "react";
import type { SupportTicketResponseDto } from "../dto/support.dto";

/** Knowledge-base article as returned by the API (row of `knowledgeBaseArticles`, JSON-serialised). */
export interface KnowledgeBaseArticle {
  id: string;
  category: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  readTime: string;
  icon: string;
  views: number;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: string;
}

export interface HelpSetupChecklistItem {
  id: number;
  text: string;
  done: boolean;
  route: string;
}

export interface HelpPopularVideo {
  id: string;
  title: string;
  duration: string;
  level: string;
  progress: string;
}

export interface HelpDashboardData {
  learningProgress: number;
  setupChecklist: HelpSetupChecklistItem[];
  popularVideos: HelpPopularVideo[];
}

export interface HelpSearchResults {
  articles: KnowledgeBaseArticle[];
  tickets: SupportTicketResponseDto[];
}

/** Articles grouped by category for the knowledge-base view. */
export interface KnowledgeBaseCategoryGroup {
  title: string;
  color: string;
  articles: KnowledgeBaseArticle[];
}

export type GroupedKnowledgeBaseArticles = Record<string, KnowledgeBaseCategoryGroup>;

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export function useHelpCenter() {
  const [dashboardData, setDashboardData] = useState<HelpDashboardData | null>(null);
  const [kbArticles, setKbArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<HelpSearchResults>({
    articles: [],
    tickets: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await apiFetch("/api/seller/help/dashboard");
      const json = await res.json();
      if (json.success && json.data) {
        setDashboardData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch help dashboard:", err);
    }
  }, []);

  const fetchKbArticles = useCallback(async (category?: string) => {
    setLoading(true);
    try {
      const url = category && category !== "all"
        ? `/api/seller/help/kb?category=${encodeURIComponent(category)}`
        : "/api/seller/help/kb";
      const res = await apiFetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setKbArticles(json.data.articles || []);
      }
    } catch (err) {
      console.error("Failed to fetch KB articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchKbArticles();
  }, [fetchDashboard, fetchKbArticles]);

  const searchHelp = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ articles: [], tickets: [] });
      return;
    }
    setIsSearching(true);
    try {
      const res = await apiFetch(`/api/seller/help/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.success && json.data) {
        setSearchResults(json.data);
      }
    } catch (err) {
      console.error("Failed to execute help search:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const requestCallback = async (phoneNumber: string, preferredTimeSlot: string, reason?: string) => {
    try {
      const res = await apiFetch("/api/seller/help/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, preferredTimeSlot, reason }),
      });
      const json = await res.json();
      if (json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to schedule callback" };
    } catch (err: unknown) {
      return { success: false, error: getErrorMessage(err, "Failed to schedule callback") };
    }
  };

  return {
    dashboardData,
    kbArticles,
    loading,
    searchResults,
    isSearching,
    refetchDashboard: fetchDashboard,
    refetchKb: fetchKbArticles,
    searchHelp,
    requestCallback,
  };
}
