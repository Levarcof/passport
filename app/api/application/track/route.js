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
    const applications = await Application.find({ 
      userId: decoded.id, 
      state: "submitted" 
    })
    .select("applicationId status updatedAt createdAt")
    .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Track API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
