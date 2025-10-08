import { gemini } from "@/services/GeminiService";
import { openai } from "@/services/OpenAi";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        let query = searchParams.get("query");
        const thumbnailUrl = searchParams.get("thumbnailUrl");

        if (!query && !thumbnailUrl) {
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
        }

        // If thumbnail is provided, generate query from it using OpenAI
        if (thumbnailUrl) {
            try {
                // Fetch and convert the thumbnail image to a Base64 Part
                const imagePart = await urlToGenerativePart(thumbnailUrl, "image/jpeg"); 

                const response = await gemini.models.generateContent({
                    model: "gemini-2.5-flash", 
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: "Describe this thumbnail in short keywords suitable for searching similar YouTube videos. Give me 5 tags separated by commas. Do not give any extra text."
                                },
                                imagePart 
                            ]
                        }
                    ]
                });

                if (response?.text) {
                    query = response.text.trim();
                } else {
                    console.warn("Gemini returned no content, using fallback query.");
                }

            } catch (error) {
                console.error("Error generating content with Gemini:", error);
                console.warn("Using fallback query.");
            }
        }

        if (!query) {
            return NextResponse.json({ error: "Failed to generate search query" }, { status: 500 });
        }
        // Call YouTube Search API
        const searchRes = await axios.get(
            `https://www.googleapis.com/youtube/v3/search`,
            {
                params: {
                    part: "snippet",
                    q: query,
                    type: "video",
                    maxResults: 20,
                    key: process.env.YOUTUBE_API_KEY
                }
            }
        );

        const videoIds = searchRes.data.items.map((item: any) => item.id.videoId).join(",");

        // Get video statistics
        const videosRes = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
                params: {
                    part: "snippet,statistics",
                    id: videoIds,
                    key: process.env.YOUTUBE_API_KEY
                }
            }
        );

        const finalResult = videosRes.data.items.map((item: any) => ({
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description,
            viewCount: item.statistics?.viewCount || 0,
            likeCount: item.statistics?.likeCount || 0,
            commentCount: item.statistics?.commentCount || 0
        }));

        return NextResponse.json(finalResult);

    } catch (err: any) {
        console.error("API Error:", err.message);
        return NextResponse.json({ error: "Failed to fetch data: " + err.message }, { status: 500 });
    }
}


async function urlToGenerativePart(url: string, mimeType: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType,
        },
    };
}