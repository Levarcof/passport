export const runtime = "nodejs";

import connectDB from "@/app/lib/db";
import Application from "@/app/models/application";
import PDFDocument from "pdfkit";
import { Buffer } from "buffer";
import { headers } from "next/headers";

export async function GET(req, context) {
    const { id } = await context.params;

    console.log(`[PDF] Generating Application PDF for ID: ${id}`);

    try {
        await connectDB();
        const application = await Application.findOne({ applicationId: id });

        if (!application) {
            console.error(`[PDF] Application not found for ID: ${id}`);

            return new Response(
                JSON.stringify({ message: "Application not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const doc = new PDFDocument({ margin: 50 });
        doc.font("Helvetica");

        const pdfBuffer = await new Promise((resolve, reject) => {
            const buffers = [];

            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            try {
                // Header
                doc
                    .fontSize(25)
                    .fillColor("#4f46e5")
                    .text("Passport Application Form", { align: "center" });

                doc.moveDown();

                doc
                    .fontSize(10)
                    .fillColor("#64748b")
                    .text(`Reference ID: ${application.applicationId}`, {
                        align: "center",
                    });

                doc.moveDown();

                doc
                    .fontSize(10)
                    .fillColor("black")
                    .text(`Generated on: ${new Date().toLocaleString()}`, {
                        align: "right",
                    });

                doc.moveDown();

                doc.rect(50, doc.y, 500, 2).fill("#4f46e5");

                doc.moveDown(2);

                const drawRow = (label, value) => {
                    doc
                        .fontSize(10)
                        .fillColor("#64748b")
                        .text(label.toUpperCase(), { continued: true });

                    doc
                        .fillColor("#1e293b")
                        .fontSize(12)
                        .text(`  ${value || "N/A"}`);

                    doc.moveDown(1.2);
                };

                // Application Section
                doc
                    .fontSize(16)
                    .fillColor("black")
                    .text("Application Details", { underline: true });

                doc.moveDown();

                drawRow("Application ID", application.applicationId);
                drawRow("Status", application.status || "Submitted");
                drawRow("Full Name", application.fullName);

                drawRow(
                    "Date of Birth",
                    application.dateOfBirth
                        ? new Date(application.dateOfBirth).toLocaleDateString()
                        : "N/A"
                );

                drawRow("Gender", application.gender);
                drawRow("Nationality", application.nationality);

                // Contact Section
                doc.moveDown();

                doc
                    .fontSize(16)
                    .fillColor("black")
                    .text("Contact & Address", { underline: true });

                doc.moveDown();

                drawRow("Email", application.email);
                drawRow("Address", application.address);
                drawRow("City", application.city);
                drawRow("State", application.addressState);
                drawRow("Pincode", application.pincode);

                // Appointment Section
                doc.moveDown();

                doc
                    .fontSize(16)
                    .fillColor("black")
                    .text("Appointment Details", { underline: true });

                doc.moveDown();

                drawRow("Passport Office", application.passportOffice);

                drawRow(
                    "Appointment Date",
                    application.appointmentDate
                        ? new Date(application.appointmentDate).toLocaleDateString()
                        : "N/A"
                );

                drawRow("Time Slot", application.timeSlot);

                // Footer
                doc.moveDown(4);

                doc
                    .fontSize(10)
                    .fillColor("#94a3b8")
                    .text(
                        "This is a computer-generated document. No signature is required.",
                        { align: "center" }
                    );

                doc.end();
            } catch (err) {
                reject(err);
            }
        });

        console.log(`[PDF] PDF created successfully`);

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Application_${id}.pdf"`,
            },
        });
    } catch (error) {
        console.error("[PDF] Generation Error:", error);

        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}