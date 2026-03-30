import nodemailer from 'nodemailer';

/**
 * Configure Nodemailer with SMTP credentials from .env
 */
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send a confirmation email after successful application submission.
 * 
 * @param {Object} data - Application details (name, email, appId, appointmentDate, appointmentTime)
 */
export const sendConfirmationEmail = async (data) => {
    const { name, email, appId, appointmentDate, appointmentTime } = data;
    
    // Construct base URL for download links
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const mailOptions = {
        from: `"Passport Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Passport Application Submitted: ${appId}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <h2 style="color: #4f46e5;">Submission Confirmed</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your passport application has been successfully submitted and is now under review.</p>
                
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #64748b;">Application ID:</p>
                    <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #1e293b;">${appId}</p>
                </div>
                
                <h4 style="margin-bottom: 10px;">Appointment Details:</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Date:</strong> ${appointmentDate}</li>
                    <li><strong>Time:</strong> ${appointmentTime}</li>
                </ul>
                
                <p style="margin-top: 30px;">You can download your application copies using the links below:</p>
                
                <div style="margin-top: 20px; display: flex; gap: 10px;">
                    <a href="${baseUrl}/api/application/pdf/${appId}" 
                       style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold; display: inline-block;">
                       Download Application PDF
                    </a>
                </div>
                
                <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;">
                
                <p style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
                    This is an automated message from the Passport Hub. Please do not reply to this email.
                </p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error("Email Sending Error:", error);
        return { success: false, error };
    }
};
