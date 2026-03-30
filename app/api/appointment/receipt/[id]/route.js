import connectDB from "@/app/lib/db";
import Application from "@/app/models/application";
import PDFDocument from "pdfkit";
import path from "path";

export async function GET(req, { params }) {
    const { id } = await params;
    console.log(`[PDF] Generating Receipt PDF for ID: ${id}`);
    const fontPath = path.join(process.cwd(), "node_modules", "pdfkit", "js", "data", "Helvetica.afm");

    try {
        await connectDB();
        const application = await Application.findOne({ applicationId: id });

        if (!application) {
            console.error(`[PDF] Application not found for Receipt ID: ${id}`);
            return new Response(JSON.stringify({ message: "Application not found" }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create a PDF document
        const doc = new PDFDocument({ 
            size: [300, 500], // Smaller receipt-like size
            margin: 30,
            bufferPages: true
        });
        
        const pdfBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));

            try {
                // Set the font explicitly to the valid path we found
                try {
                    doc.font(fontPath);
                } catch (fontErr) {
                    console.warn("[PDF] Helvetica font metrics not found, using default fallback.");
                }

                // Header
                doc.fontSize(20).fillColor('#4f46e5').text('Appointment Receipt', { align: 'center' });
                doc.moveDown();
                doc.fontSize(10).fillColor('#64748b').text(`Reference ID: ${application.applicationId}`, { align: 'center' });
                doc.moveDown();
                doc.fontSize(8).text(`Printed on: ${new Date().toLocaleDateString()}`, { align: 'right' });
                doc.moveDown();
                doc.rect(30, 75, 240, 2).fill('#4f46e5');
                doc.moveDown();

                // Receipt Details
                doc.fillColor('#1e293b');
                doc.fontSize(14).text('Applicant Name:', { continued: true });
                doc.fontSize(14).text(` ${application.fullName || 'N/A'}`, { align: 'right' });
                doc.moveDown();

                doc.fontSize(12).text('Application ID:', { continued: true });
                doc.fontSize(12).text(` ${application.applicationId}`, { align: 'right' });
                doc.moveDown(2);

                // PSK Box
                doc.rect(30, doc.y, 240, 100).fill('#f8fafc');
                doc.fillColor('#1e293b');
                doc.fontSize(10).text('Passport Seva Kendra Location:', { align: 'center' });
                doc.fontSize(12).text(application.passportOffice || 'N/A', { align: 'center', bold: true });
                doc.moveDown();
                doc.fontSize(10).text('Appointment Date & Time:', { align: 'center' });
                doc.fontSize(12).text(`${application.appointmentDate ? new Date(application.appointmentDate).toLocaleDateString() : 'N/A'} at ${application.timeSlot || 'N/A'}`, { align: 'center' });

                doc.moveDown(4);
                doc.fontSize(8).fillColor('#64748b').text('Please bring your original documents and this receipt to the PSK at least 15 minutes before your time slot.', { align: 'center' });

                doc.end();
            } catch (err) {
                reject(err);
            }
        });

        console.log(`[PDF] Receipt Buffer created successfully, size: ${pdfBuffer.length} bytes`);

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Receipt_${id}.pdf"`,
                'Content-Length': pdfBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error("[PDF] Receipt Generation Error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
