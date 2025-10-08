"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ThumbnailSearch from "./components/ThumbnailSearch";

export type VideoInfo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  channelTitle: string;
};

const Page = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoInfo[]>([]);

  const SearchSimilarThumbnail = async (url: string) => {
    if (!url.trim()) {
      toast.error("Please enter something to generate!");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(`/api/thumbnail-search?thumbnailUrl=${url}`);
      console.log(res.data);
      setResults(res.data);
    } catch (error: any) {
      console.error("Error fetching thumbnails:", error);
      toast.error(error.message);
    }
    setLoading(false);
  };

  const onSearch = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    try {
      const res = await axios.get(`/api/thumbnail-search?query=${userInput}`);
      console.log(res.data);
      setResults(res.data);
    } catch (error: any) {
      console.error("Error fetching thumbnails:", error);
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold mb-2 text-gray-900">
        AI Thumbnail Search
      </h2>
      <p className="text-gray-600 text-sm md:text-base">
        Discover thumbnails that match your content using smart AI-powered
        search. Just enter a title or keyword and get visually similar YouTube
        thumbnails in seconds.
      </p>

      <div className="mt-8 w-full relative">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Your Text Here..."
        />
        <Button
          onClick={onSearch}
          disabled={loading}
          className="absolute top-1/2 right-2 -translate-y-1/2"
        >
          <Search className="mr-2" /> {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <ThumbnailSearch
        videoList={results}
        loading={loading}
        SearchSimilarThumbnail={(url: string) => SearchSimilarThumbnail(url)}
      />
    </div>
  );
};

export default Page;
