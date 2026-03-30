import connectDB from "@/app/lib/db";
import Application from "@/app/models/application";
import User from "@/app/models/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateApplicationId } from "@/utils/generateApplicationId";
import { sendConfirmationEmail } from "@/utils/emailService";

export async function POST(req) {
  try {
    await connectDB();

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

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

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const {
      applicationId,
      fullName,
      dob,
      gender,
      nationality,
      address,
      city,
      state,
      pincode,
      office,
      appointmentDate,
      timeSlot,
      passportPhoto,
      aadhaarCard,
      birthCertificate,
      action,
      email,
    } = body;

    // Ensure email exists
    const userEmail = email || user.email;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    let application = null;

    // Find existing application
    if (applicationId) {
      application = await Application.findOne({
        applicationId,
        userId: decoded.id,
      });
    }

    // Create new application
    if (!application) {
      // Use new ID format for brand new applications
      const newId = generateApplicationId();

      application = new Application({
        applicationId: newId,
        userId: decoded.id,
        email: userEmail,
      });
    }

    // Update fields
    application.fullName = fullName ?? application.fullName;
    application.dateOfBirth = dob ?? application.dateOfBirth;
    application.gender = gender ?? application.gender;
    application.nationality = nationality ?? application.nationality;
    application.address = address ?? application.address;
    application.city = city ?? application.city;
    application.addressState = state ?? application.addressState;
    application.pincode = pincode ?? application.pincode;
    application.passportOffice = office ?? application.passportOffice;
    application.appointmentDate = appointmentDate ?? application.appointmentDate;
    application.timeSlot = timeSlot ?? application.timeSlot;
    application.passportPhoto = passportPhoto ?? application.passportPhoto;
    application.aadhaarCard = aadhaarCard ?? application.aadhaarCard;
    application.birthCertificate = birthCertificate ?? application.birthCertificate;

    // Handle application state
    if (action === "submit") {
      application.state = "submitted";

      if (!application.status) {
        application.status = "under_review";
      }

      // Check for valid ID on submission (if it was an old APP-ID, re-generate)
      if (application.applicationId.startsWith('APP-')) {
          application.applicationId = generateApplicationId();
      }
    } else {
      application.state = "draft";
    }

    await application.save();

    // Trigger confirmation email if SUBMITTED
    if (action === "submit") {
        await sendConfirmationEmail({
            name: application.fullName,
            email: application.email,
            appId: application.applicationId,
            appointmentDate: application.appointmentDate ? new Date(application.appointmentDate).toLocaleDateString() : 'TBD',
            appointmentTime: application.timeSlot || 'TBD'
        });
    }

    return NextResponse.json({
      success: true,
      message: action === "submit" ? "Application submitted successfully" : "Draft saved successfully",
      application,
    });
  } catch (error) {
    console.error("Save Application Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}