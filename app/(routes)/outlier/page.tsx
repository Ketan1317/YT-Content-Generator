"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import VideoOutlierCard from "../thumbnail-search/components/VideoOutlierCard";
import VideoCardSkeleton from "../thumbnail-search/components/VideoCardSkeleton ";

export type VideoOutlierInfo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelTitle: string;
  outlierScore: number;
  smartScore: number;
  isOutlier: boolean;
  viewsPerDay: number;
  engagementRate: number;
};

const OutlierPage = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<VideoOutlierInfo[]>([]);
   

  const onSearch = async () => {
    if (!userInput.trim()){
      toast.error("Please enter something to generate!") 
      return};

    setLoading(true);
    try {
      const res = await axios.get(`/api/outlier?query=${userInput}`);
      setResults(res.data);
    } catch (error: any) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch video data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 dark:text-white">
        Outlier Analysis 📊
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-6">
        Discover which YouTube videos perform{" "}
        <b>significantly above or below average</b>
        in your niche. Analyze thumbnails, titles, and engagement rates of these
        <span className="text-blue-500 font-semibold"> outliers</span> to learn
        what stands out.
      </p>

      <div className="relative w-full mb-10">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg py-3 px-4 pr-28 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter niche keyword or competitor channel name..."
        />
        <Button
          onClick={onSearch}
          disabled={loading}
          className="absolute top-1/2 right-2 -translate-y-1/2 "
        >
          <Search className="mr-2 h-4 w-4" />
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      {!results || results.length === 0 ? <p className="text-gray-500 text-center mt-8">
        No videos found. Try searching something else.
      </p> : <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <VideoCardSkeleton key={idx} />
            ))
          : results.map((video) => (
              <div>
                <VideoOutlierCard key={video.id} videoInfo={video} />
              </div>
            ))}
      </div>}
    </div>
  );
};

export default OutlierPage;
