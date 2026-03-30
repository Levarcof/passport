import connectDB from "@/app/lib/db";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, phone, profileImage } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !password?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Profile Image Handling
    const profileImageUrl = profileImage || "";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      profileImage: profileImageUrl
    });
    
    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,  
        userId: user.userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🍪 Store in cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;

  } catch (error) {

    console.error("Register API Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );

  }
}