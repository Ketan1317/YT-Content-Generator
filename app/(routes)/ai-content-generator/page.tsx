"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Sparkles,
  Loader2,
  Tags,
  Image as ImageIcon,
  Lightbulb,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export type Content = {
  thumbnailUrl: string;
  tags: string[];
  description: string;
  ideas: string[];
};

const Page = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<Content | null>(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      toast.error("Please Enter Something to Search");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/contentGenerate", { userInput });
      console.log(res.data);
      setResult({
        thumbnailUrl: res.data.imageUrl,
        tags: res.data.result.tags,
        description: res.data.result.description,
        ideas: res.data.result.idea.map(
          (i: any) => i.idea || i.text || JSON.stringify(i)
        ),
      });
      toast.success("Content generated successfully!");
    } catch (error: any) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900 ">
        AI Content Generator 
      </h2>
      <p className="text-gray-600  text-sm md:text-base mb-6">
        Generate <b>beautiful thumbnails</b> and <b>SEO-rich content</b> for
        YouTube, blogs, or social media using AI. Enter a topic below and watch
        the magic happen.
      </p>

      <div className="relative w-full mb-10">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full border border-gray-300  bg-white  rounded-lg py-3 px-4 pr-32 text-gray-900  focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your topic or prompt..."
        />
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-white shadow-md hover:shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {loading ? <Skeleton/> : result && (
        <div className="bg-gray-50  rounded-2xl shadow-xl p-8 animate-fadeIn">
          {result.thumbnailUrl && (
            <div className="flex justify-center mb-6">
              <div className="relative w-[450px] h-[350px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={result.thumbnailUrl}
                  alt="Generated Thumbnail"
                  fill
                  className="object-cover rounded-xl border border-gray-200"
                />
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Youtube Video Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {result.description}
            </p>
          </div>

          {result.ideas && result.ideas.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                Title Ideas with SEO scores
              </h3>
              <ul className="list-disc pl-6 text-gray-700  space-y-2">
                {result.ideas.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
            </div>
          )}

          {result.tags && result.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-2xl font-semibold text-gray-900  mb-3 flex items-center gap-2">
                Popular YT Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm text-black bg-gray-300 shadow-sm hover:scale-105 transition-transform"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
