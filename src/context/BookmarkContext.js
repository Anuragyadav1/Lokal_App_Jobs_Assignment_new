import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getBookmarkedJobs,
  toggleBookmark,
  isJobBookmarked,
} from "../utils/storage";

const BookmarkContext = createContext();

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarkedJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const jobs = await getBookmarkedJobs();
      setBookmarkedJobs(jobs);
      setBookmarkedIds(new Set(jobs.map((job) => job.id)));
      return jobs;
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleJobBookmark = useCallback(async (job) => {
    try {
      const isBookmarked = await toggleBookmark(job);
      if (isBookmarked) {
        setBookmarkedJobs((prev) => [...prev, job]);
        setBookmarkedIds((prev) => new Set([...prev, job.id]));
      } else {
        setBookmarkedJobs((prev) => prev.filter((j) => j.id !== job.id));
        setBookmarkedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(job.id);
          return newSet;
        });
      }
      return isBookmarked;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  }, []);

  const checkJobBookmarkStatus = useCallback(
    async (jobId) => {
      return bookmarkedIds.has(jobId);
    },
    [bookmarkedIds]
  );

  useEffect(() => {
    loadBookmarkedJobs();
  }, [loadBookmarkedJobs]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedJobs,
        bookmarkedIds,
        isLoading,
        loadBookmarkedJobs,
        toggleJobBookmark,
        checkJobBookmarkStatus,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
