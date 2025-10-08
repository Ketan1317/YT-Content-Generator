import { Message } from './../../../node_modules/openai/resources/conversations/conversations.d';
import { db } from "@/configs/db";
import { AiThumbnail } from "@/configs/schema";
import { imageKit } from "@/services/ImageKit";
import { eq, desc } from "drizzle-orm";
import { openai } from "@/services/OpenAi";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const HF_TOKEN = process.env.HF_TOKEN!;
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const faceImage = formData.get("faceImage") as File | null;
    const userInput = formData.get("userInput") as string | undefined;
    const refImage = formData.get("refImage") as File | null;
    const user = await currentUser();

    if (!userInput || !user) {
      return NextResponse.json({ error: "Missing input or user" }, { status: 400 });
    }

    // Upload reference image 
    const refImageData = refImage ? await getFileBufferData(refImage) : null;
    const refImageUrl = refImageData
      ? await uploadedImages(refImageData)
      : undefined;

    // @ts-ignore
    const prompt = await aiPrompt(refImageUrl, userInput);

    // Generate thumbnail 
    const generatedImageUrl = await generatedImage(prompt);

    // Save to DB
    const saved = await saveToDB({
      userInput,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "unknown",
      thumbnailUrl: generatedImageUrl,
      refImage: refImageUrl!,
    });

    return NextResponse.json({ success: true, savedInfo: saved });
  } catch (err: any) {
    console.error("Error generating thumbnail:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper Functions

const getFileBufferData = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    buffer: buffer.toString("base64"),
  };
};

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

const aiPrompt = async (refImageUrl: string | undefined, userInput: string) => {
  const messages: any[] = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: refImageUrl
            ? `Write a text prompt to generate a high-quality YouTube thumbnail for: "${userInput}". 
Include bold readable text, relevant icons, and cinematic style. Output only the prompt.`
            : `Write a text prompt to generate a professional YouTube thumbnail for: "${userInput}". 
Include design hints and visuals. Output only the prompt.`,
        },
      ],
    },
  ];

  if (refImageUrl) {
    messages[0].content.push({
      type: "image_url",
      image_url: { url: refImageUrl },
    });
  }

  const completion = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-preview-09-2025",
    messages,
  });

  return completion.choices?.[0]?.message?.content?.trim() ?? "";
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
  refImage,
}: {
  userInput: string;
  userEmail: string;
  thumbnailUrl: string;
  refImage: string;
}) => {
  const result = await db
    .insert(AiThumbnail)
    .values({
      userInput,
      userEail:userEmail,
      thumbnailUrl,
      createdOn: new Date(),
      refImage,
    })
    .returning();
  return result;
};



export async function GET(req:NextRequest){
  try {
    const user = await currentUser();
    //@ts-ignore
    const result = await db.select().from(AiThumbnail).where(eq(AiThumbnail.userEail,user?.primaryEmailAddress?.emailAddress)).orderBy(desc(AiThumbnail.id))
    return NextResponse.json(result)
  } catch (error) {
    //@ts-ignore
    return NextResponse.json({message:error.message})
  }
}