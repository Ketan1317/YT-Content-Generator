import React from 'react'
import { VideoInfo } from '../page'
import Image from 'next/image'
import { Eye, MessageCircle, ThumbsUp } from 'lucide-react'

type PROPS = {
    videoInfo: VideoInfo
}

const formatCount = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
}

const VideoCard = ({ videoInfo }: PROPS) => {
    
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col h-80">
            <div className="relative w-full h-40 md:h-44">
                <Image 
    src={videoInfo.thumbnail} 
    alt={videoInfo.title} 
    fill
    className="object-cover"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

            </div>

            <div className="p-3 flex-1">
                <h5 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                    {videoInfo.title}
                </h5>
                <h5 className="text-xs text-gray-500 dark:text-gray-400">
                    {videoInfo.channelTitle}
                </h5>
            </div>


            <div className="flex items-center justify-evenly text-gray-600 dark:text-gray-300 p-3 border-t border-gray-200 dark:border-gray-700">
                <p className="flex items-center gap-1"><Eye size={16}/> {formatCount(parseInt(videoInfo.viewCount))}</p>
                <p className="flex items-center gap-1"><MessageCircle size={16}/> {formatCount(parseInt(videoInfo.commentCount))}</p>
                <p className="flex items-center gap-1"><ThumbsUp size={16}/> {formatCount(parseInt(videoInfo.likeCount))}</p>
            </div>
        </div>
    )
}

export default VideoCard
