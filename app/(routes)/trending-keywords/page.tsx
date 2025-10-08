"use client";


import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const page = () => {

    const [userInput, setUserInput] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
  <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-gray-900">
    Trending Keywords Finder
  </h2>
  <p className="text-gray-600 text-sm md:text-base mb-6">
    Discover <b>trending keywords</b> and <b>SEO-friendly topics</b> for your
    YouTube videos, blogs, or marketing campaigns. Enter a topic below to find
    what's hot right now.
  </p>

  <div className="relative w-full mb-10">
    <input
      type="text"
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      className="w-full border border-gray-300 bg-white rounded-lg py-3 px-4 pr-32 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your niche or topic..."
    />
    <Button
      // onClick={handleGenerate}
      disabled={loading}
      className="absolute top-1/2 right-2 -translate-y-1/2 text-white shadow-md hover:shadow-lg transition-all"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Find Keywords
        </>
      )}
    </Button>
  </div>
</div>

  )
}

export default page