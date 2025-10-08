import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Thumbnail = {
    id:number,
    thumbnailUrl:string,
    refImage:string,
    userInput:string
}

const ThumbnailList = () => {

    const [thumbnailItems,setThumnailItems] = useState<Thumbnail[]>([]);

  const getThumbnails = async () => {
    const thumbnails = await axios.get("/api/generate-thumbnail");
    console.log(thumbnails.data);
    setThumnailItems(thumbnails.data)
  };

  useEffect(() => {
    getThumbnails();
  }, []);

  return (
  <div className="p-6 max-w-[90%] mt-20 mx-auto">
    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
      Previously Generated Thumbnails
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {thumbnailItems.map((item, idx) => (
        <Link
          href={item.thumbnailUrl}
          target="_blank"
          key={idx}
          className="relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 block hover:scale-105"
        >
          <Image
            src={item.thumbnailUrl}
            alt={item.userInput || `Thumbnail ${idx + 1}`}
            width={900}  // larger width
            height={506} // maintain 16:9 aspect ratio
            className="w-full h-auto object-cover rounded-2xl"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-lg font-medium text-white truncate">
              {item.userInput}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);


};

export default ThumbnailList;
