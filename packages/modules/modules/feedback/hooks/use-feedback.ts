import { useState, useEffect, useCallback } from "react";
import { CreateFeedbackDto, SubmitSurveyDto } from "../dto/feedback.dto";

export function useFeedback() {
  const [roadmapItems, setRoadmapItems] = useState<any[]>([]);
  const [trackerItems, setTrackerItems] = useState<any[]>([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [loadingTracker, setLoadingTracker] = useState(true);

  const fetchRoadmap = useCallback(async (status?: string) => {
    setLoadingRoadmap(true);
    try {
      const url = status && status !== "all"
        ? `/api/seller/feedback/roadmap?status=${encodeURIComponent(status)}`
        : "/api/seller/feedback/roadmap";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && json.data) {
        setRoadmapItems(json.data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch roadmap items:", err);
    } finally {
      setLoadingRoadmap(false);
    }
  }, []);

  const fetchTracker = useCallback(async () => {
    setLoadingTracker(true);
    try {
      const res = await fetch("/api/seller/feedback/tracker");
      const json = await res.json();
      if (json.success && json.data) {
        setTrackerItems(json.data.items || []);
      }
    } catch (err) {
      console.error("Failed to fetch feedback tracker:", err);
    } finally {
      setLoadingTracker(false);
    }
  }, []);

  useEffect(() => {
    fetchRoadmap();
    fetchTracker();
  }, [fetchRoadmap, fetchTracker]);

  const toggleUpvote = async (featureId: string) => {
    // Optimistic UI update
    setRoadmapItems((prev) =>
      prev.map((item) => {
        if (item.id === featureId) {
          return {
            ...item,
            hasVoted: !item.hasVoted,
            upvoteCount: item.hasVoted ? item.upvoteCount - 1 : item.upvoteCount + 1,
          };
        }
        return item;
      })
    );

    try {
      const res = await fetch(`/api/seller/feedback/roadmap/${featureId}/vote`, {
        method: "POST",
      });
      const json = await res.json();
      if (!json.success) {
        await fetchRoadmap();
      }
    } catch (err) {
      await fetchRoadmap();
    }
  };

  const fetchComments = async (featureId: string) => {
    try {
      const res = await fetch(`/api/seller/feedback/roadmap/${featureId}/comments`);
      const json = await res.json();
      if (json.success) {
        return { success: true, comments: json.data.comments };
      }
      return { success: false, error: json.error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addComment = async (featureId: string, comment: string) => {
    try {
      const res = await fetch(`/api/seller/feedback/roadmap/${featureId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchRoadmap();
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const submitFeedback = async (dto: CreateFeedbackDto) => {
    try {
      const res = await fetch("/api/seller/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      const json = await res.json();
      if (json.success) {
        await fetchTracker();
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to submit feedback" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const submitSurvey = async (dto: SubmitSurveyDto) => {
    try {
      const res = await fetch("/api/seller/feedback/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });
      const json = await res.json();
      if (json.success) {
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error?.message || "Failed to submit survey" };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return {
    roadmapItems,
    trackerItems,
    loadingRoadmap,
    loadingTracker,
    refetchRoadmap: fetchRoadmap,
    refetchTracker: fetchTracker,
    toggleUpvote,
    fetchComments,
    addComment,
    submitFeedback,
    submitSurvey,
  };
}
