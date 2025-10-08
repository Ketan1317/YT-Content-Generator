'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const FeatureList = () => {
  const Features = [
    { id: 1, title: "AI Thumbnail Generator", image: '/feature1.png', path: '/ai-thumbnail-generator' },
    { id: 2, title: "AI Thumbnail Search", image: '/feature2.png', path: '/thumbnail-search' },
    { id: 3, title: "Outlier", image: '/feature3.png', path: '/ai-content-generator' },
    { id: 4, title: "Content Generator", image: '/feature4.png', path: '/outlier' },
    { id: 5, title: "Trending Keywords", image: '/feature5.png', path: '/trending-keywords' },
    { id: 6, title: "Optimize Video", image: '/feature6.png', path: '#' },
  ]

  return (
    <section className="mt-6">
      <h1 className="text-2xl font-bold mb-5 text-gray-900 dark:text-gray-100">
        AI Tools
      </h1>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Features.map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className="group group-hover:scale-105 block rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300"
          >
            <div className="relative w-full aspect-video">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-xl  transition-transform duration-300"
              />
            </div>
            <h2 className="text-center mt-3 font-medium text-gray-800">
              {item.title}
            </h2>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeatureList
