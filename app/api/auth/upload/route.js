import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }

    const imageUrl = await uploadToCloudinary(image, "user_profiles");

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("Cloudinary Upload API Error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
