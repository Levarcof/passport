import connectDB from "@/app/lib/db";
import Application from "@/app/models/application";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid Token" },
        { status: 401 }
      );
    }

    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: "Application ID is required" },
        { status: 400 }
      );
    }

    const result = await Application.findOneAndDelete({
      applicationId,
      userId: decoded.id,
      state: "draft",
    });

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Draft not found or already submitted" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("Delete Draft API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
