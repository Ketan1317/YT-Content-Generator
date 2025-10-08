import { db } from "@/configs/db";
import { AiContentTable } from "@/configs/schema";
import { imageKit } from "@/services/ImageKit";
import { openai } from "@/services/OpenAi";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN!;
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

const AIprompt = `You are an expert YouTube SEO strategist and AI creative assistant. Based on the user input below, generate a JSON response only (no explanation, no markdown, no comments, no extra text) that follows this structure exactly:

Three YouTube video titles optimized for SEO.
SEO Score for each title (1 to 100).
A compelling video description based on the selected topic.
10 YouTube tags relevant to the video.
Two different high-quality image prompts to generate professional YouTube thumbnails — use different styles or concepts based on the video topic.

User Input: {user_input}
Return format: (JSON ONLY):

{
    "idea": [
        {
            "title": "Title 1",
            "seo_score": 87
        },
        {
            "title": "Title 2",
            "seo_score": 82
        },
        {
            "title": "Title 3",
            "seo_score": 78
        }
    ],
    "description": "Write a professional and engaging YouTube video description here based on the input.",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"],
    "image_prompts": [
        "Professional thumbnail style prompt 1 based on the input title and topic.",
        "Professional thumbnail style prompt 2 with different visual concept based on the same topic."
    ]
}

Make sure the response includes real content based on the user input and follows this structure exactly.`;

export async function POST(req: NextRequest) {
    const user = await currentUser();
    const body = await req.json();
    const { userInput } = body;
    const email = user?.primaryEmailAddress?.emailAddress;

    const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash-preview-09-2025",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: AIprompt.replace(`{user_input}`, userInput),
                    },
                ],
            },
        ],
    });

    const rawJson = completion.choices[0].message.content;
    const parsedJson = rawJson
        ?.replace("```json", "")
        .replace("```", "")
        .trim();
    const formattedJson = parsedJson && JSON.parse(parsedJson);

    const imagePrompt = formattedJson?.image_prompts[0];

    const generateThumbnailUrl = await generatedImage(imagePrompt)
    console.log(generateThumbnailUrl)


    const saved = await saveToDB({
        userInput,
        userEmail: user?.primaryEmailAddress?.emailAddress ?? "unknown",
        thumbnailUrl: generateThumbnailUrl,
    });



    return NextResponse.json({ result: formattedJson, imageUrl: generateThumbnailUrl });
}


const uploadedImages = async (refImage: any) => {
    try {
        const uploaded = await imageKit.upload({
            file: refImage.buffer,
            fileName: refImage.name || "reference-image.png",
            useUniqueFileName: true,
            isPublished: true,
        });
        return uploaded.url;
    } catch (err) {
        console.error("Image upload failed:", err);
        return null;
    }
};


const generatedImage = async (aiPrompt: string) => {
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: aiPrompt }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HF request failed: ${response.status} - ${text}`);
    }

    const buffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);

    const uploaded = await imageKit.upload({
        file: imageBuffer,
        fileName: `generated-thumbnail-${Date.now()}.png`,
        isPublished: true,
        useUniqueFileName: true,
    });

    return uploaded.url;
};




const saveToDB = async ({
    userInput,
    userEmail,
    thumbnailUrl,

}: {
    userInput: string;
    userEmail: string;
    thumbnailUrl: string;
}) => {
    const result = await db
        .insert(AiContentTable)
        .values({
            userInput,
            userEmail,
            thumbnailUrl,
            createdOn: new Date(),
        })
        .returning();
    return result;
};