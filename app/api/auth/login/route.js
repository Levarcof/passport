import connectDB from "@/app/lib/db";
import User from "@/app/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try{
      await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return Response.json({ message: "Invalid password" }, { status: 401 });
  }

  
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
  }
  catch(error){
    console.error("Register API Error:", error);
   
       return NextResponse.json(
         { message: "Internal Server Error" },
         { status: 500 }
       );
  }

}