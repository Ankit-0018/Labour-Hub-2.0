import { create } from "zustand";
import { Job } from "../types";
import { getPaginatedJobs } from "../queries/jobs";

interface JobState {
  jobs: Job[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  lastVisibleId: string | null;
  error: string | null;

  fetchJobs: (limit?: number) => Promise<void>;
  fetchMoreJobs: (limit?: number) => Promise<void>;
  reset: () => void;
}

export const useJobStore = create<JobState>()((set, get) => ({
  jobs: [],
  loading: false,
  loadingMore: false,
  hasMore: true,
  lastVisibleId: null,
  error: null,

  fetchJobs: async (limitSize = 10) => {
    console.log("inside fetching jobs..");
    set({ loading: true, error: null });
    try {
      const response = await getPaginatedJobs(limitSize);
      console.log("This is the response...", response);
      set({
        jobs: response.jobs,
        lastVisibleId: response.lastVisibleId,
        hasMore: response.hasMore,
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch jobs", loading: false });
    }
  },

  fetchMoreJobs: async (limitSize = 10) => {
    const { hasMore, lastVisibleId, loadingMore, jobs } = get();
    if (!hasMore || !lastVisibleId || loadingMore) return;

    set({ loadingMore: true });
    try {
      const response = await getPaginatedJobs(limitSize, lastVisibleId);
      set({
        jobs: [...jobs, ...response.jobs],
        lastVisibleId: response.lastVisibleId,
        hasMore: response.hasMore,
        loadingMore: false,
      });
    } catch (error) {
      set({ error: "Failed to fetch more jobs", loadingMore: false });
    }
  },

  reset: () => {
    set({
      jobs: [],
      loading: false,
      loadingMore: false,
      hasMore: true,
      lastVisibleId: null,
      error: null,
    });
  },
}));
