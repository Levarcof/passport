import connectDB from "@/app/lib/db";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function PUT(req) {
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
    const body = await req.json();
    const { name, profileImage } = body;

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (name) user.name = name;

    if (profileImage) {
      const profileImageUrl = await uploadToCloudinary(profileImage, "user_profiles");
      user.profileImage = profileImageUrl;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
