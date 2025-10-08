"use client";
import React from "react";
import Image from "next/image";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type VideoOutlierInfo = {
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

type Props = {
  videoInfo: VideoOutlierInfo;
};

const formatCount = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

const VideoOutlierCard = ({ videoInfo }: Props) => {
  return (
    <div className="bg-white dark:bg-gray-900 relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col">

      {/* SmartScore Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h2 className="absolute z-10 right-2 top-2 px-2 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md cursor-default">
              {videoInfo.smartScore}X
            </h2>
          </TooltipTrigger>
          <TooltipContent>
            <p>Outlier SmartScore</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Thumbnail */}
      <div className="relative w-full h-40 md:h-44">
        <Image
          src={videoInfo.thumbnail}
          alt={videoInfo.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Info Section */}
      <div className="p-3 flex-1">
        <h5 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
          {videoInfo.title}
        </h5>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {videoInfo.channelTitle}
        </p>
        {videoInfo.isOutlier && (
          <span className="mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            Outlier 🔥
          </span>
        )}
      </div>

      {/* Stats Section */}
      <div className="flex items-center justify-evenly text-gray-600 dark:text-gray-300 p-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <p className="flex items-center gap-1 text-xs md:text-sm">
          <Eye size={16} /> {formatCount(videoInfo.viewCount)}
        </p>
        <p className="flex items-center gap-1 text-xs md:text-sm">
          <MessageCircle size={16} /> {formatCount(videoInfo.commentCount)}
        </p>
        <p className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm">
          <ThumbsUp size={16} /> {formatCount(videoInfo.engagementRate)}
        </p>
      </div>
    </div>
  );
};

export default VideoOutlierCard;
