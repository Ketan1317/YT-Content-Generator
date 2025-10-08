"use client";

import axios from "axios";
import { ArrowUp, ImagePlus, Loader2, User, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ThumbnailList from "./components/ThumbnailList";
import toast from "react-hot-toast";

const Page = () => {
  const [userInput, setUserInput] = useState("");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [faceImage, setFaceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);

  const [outputImage, setOutputImage] = useState<string | null>(null);

  const [faceImagePreview, setFaceImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (field: string, e: any) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const imageUrl = URL.createObjectURL(selectedFile);

    if (field === "referenceImageUpload") {
      setReferenceImage(selectedFile);
      setReferenceImagePreview(imageUrl);
    } else {
      setFaceImage(selectedFile);
      setFaceImagePreview(imageUrl);
    }
  };

  const handleCrossBtn = (field: string) => {
    if (!field) return;

    if (field === "referenceImageUpload") {
      setReferenceImage(null);
      setReferenceImagePreview(null);
    } else {
      setFaceImage(null);
      setFaceImagePreview(null);
    }
  };

  const onSubmitHandler = async () => {
    if (!userInput.trim()){
      toast.error("Please enter something to generate!") 
      return};
    const formData = new FormData();
    userInput && formData.append("userInput", userInput);
    referenceImage && formData.append("refImage", referenceImage);
    faceImage && formData.append("faceImage", faceImage);

    console.log(formData);

    // Api call
    try {
      setLoading(true);
      const res = await axios.post("/api/generate-thumbnail", formData);
      console.log(res.data);

      // set generated image
      console.log(res.data.savedInfo[0].thumbnailUrl)
      setOutputImage(res.data.savedInfo[0].thumbnailUrl);

      setLoading(false);
      setFaceImage(null)
      setUserInput("")
    } catch (error:any) {
      console.error(error);
      toast.error(error.message)
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">
          AI Thumbnail Generator
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Generate stunning YouTube thumbnails using AI-powered creativity.
        </p>
      </div>


      {outputImage && (
  <div className="mt-6 w-full mb-9 flex justify-center">
    <Image
      src={outputImage}
      alt="Generated Thumbnail"
      width={512}
      height={288}
      className="rounded-xl border border-gray-300"
    />
  </div>
)}


      {!loading ? (
        <div className="relative mb-10">
          <textarea
            onChange={(e) => setUserInput(e.target.value)}
            value={userInput}
            placeholder="Enter your YouTube title or description..."
            className="w-full h-32 resize-none p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={onSubmitHandler}
            className="absolute bottom-4 right-4 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2 shadow"
          >
            <ArrowUp className="w-4 h-4" />
            Generate
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-52 mb-20 bg-gray-100 gap-4">
          <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
          <p className="text-gray-700 text-lg text-center">
            Please wait... While we are generating your thumbnail
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-8">
        {referenceImagePreview ? (
          <div className="relative z-0 w-40 h-32 rounded-xl overflow-hidden border border-gray-300">
            <X
              onClick={() => handleCrossBtn("referenceImageUpload")}
              className="absolute cursor-pointer z-10"
            />
            <Image
              src={referenceImagePreview}
              alt="Reference Image"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <label htmlFor="referenceImageUpload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center w-40 h-32 bg-gray-100 border border-gray-300 rounded-xl hover:shadow-md transition">
              <ImagePlus className="w-6 h-6 mb-2 text-gray-700" />
              <p className="font-medium text-gray-700">Reference Image</p>
            </div>
          </label>
        )}
        <input
          type="file"
          id="referenceImageUpload"
          className="hidden"
          onChange={(e) => handleFileChange("referenceImageUpload", e)}
        />

        {faceImagePreview ? (
          <div className="relative w-40 z-0 h-32 rounded-xl overflow-hidden border border-gray-300">
            <X
              onClick={() => handleCrossBtn("includeFace")}
              className="absolute cursor-pointer z-10"
            />
            <Image
              src={faceImagePreview}
              alt="Face Image"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <label htmlFor="includeFace" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center w-40 h-32 bg-gray-100 border border-gray-300 rounded-xl hover:shadow-md transition">
              <User className="w-6 h-6 mb-2 text-gray-700" />
              <p className="font-medium text-gray-700">Include Face</p>
            </div>
          </label>
        )}
        <input
          type="file"
          id="includeFace"
          className="hidden"
          onChange={(e) => handleFileChange("includeFace", e)}
        />
      </div>

      <ThumbnailList/>

    </div>
  );
};

export default Page;
