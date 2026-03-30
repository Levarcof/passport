import connectDB from "@/app/lib/db";
import Application from "@/app/models/application";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const drafts = await Application.find({ 
      userId: decoded.id, 
      state: "draft" 
    })
    .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      drafts,
    });
  } catch (error) {
    console.error("Drafts API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
