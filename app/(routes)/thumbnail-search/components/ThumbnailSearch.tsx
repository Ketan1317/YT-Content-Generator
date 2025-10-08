import React from "react";
import { VideoInfo } from "../page";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton ";

type Props = {
  videoList: VideoInfo[] | undefined;
  SearchSimilarThumbnail : any;
  loading:boolean
};

const ThumbnailSearch = ({ videoList,SearchSimilarThumbnail,loading }: Props) => {
  if (!videoList || videoList.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-8">
        No videos found. Try searching something else.
      </p>
    );
  }

  return (
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {loading
        ? Array.from({ length: 8 }).map((_, idx) => <VideoCardSkeleton key={idx} />)
        : videoList.map((video,index) => (
            <div  onClick={() => SearchSimilarThumbnail(video.thumbnail)}>
              <VideoCard key={index} videoInfo={video} />
            </div>
          ))}
    </div>
  );
};

export default ThumbnailSearch;
