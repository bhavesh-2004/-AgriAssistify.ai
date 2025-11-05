/**
 * MAILER.JS - AgriAssistify.ai Enhanced Email Service
 * Professional email system for agricultural issue tracking platform
 */

import nodemailer from 'nodemailer';

// Create transporter function
const createTransporter = () => {
    return nodemailer.createTransporter({  // ✅ This is correct method
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });
};


// ==================== BASIC SEND MAIL FUNCTION ====================
export const sendMail = async (to, subject, text, html) => {
    try {
        const transporter = createTransporter();
        
        const info = await transporter.sendMail({
            from: '"AgriAssistify.ai" <noreply@agriassistify.ai>',
            to,
            subject,
            text,
            html: html || `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2 style="color: #16a34a;">🌾 AgriAssistify.ai</h2><p>${text}</p></div>`,
        });

        console.log("✅ Message sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Mail Error:", error.message);
        throw error;
    }
};

// ==================== AGRICULTURAL EMAIL TEMPLATES ====================

// 🎉 Welcome Email for New Users
export const sendWelcomeEmail = async (user) => {
    const subject = `🌾 Welcome to AgriAssistify.ai - Your Agricultural Support Platform!`;
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #16a34a, #22c55e); text-align: center; padding: 40px 20px; color: white;">
            <h1 style="margin: 0; font-size: 32px;">🌾 Welcome to AgriAssistify.ai!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Intelligent Agriculture Issue Tracker</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
            <h2 style="color: #16a34a; margin-top: 0;">Hello ${user.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Welcome to the future of agricultural problem solving! As a <strong>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</strong>, 
                you now have access to our intelligent platform designed specifically for farmers like you.
            </p>

            <!-- Features Box -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #16a34a; margin-top: 0;">🚀 What You Can Do:</h3>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #374151;">
                    <li>🤖 <strong>Report Farm Issues:</strong> Get AI-powered analysis instantly</li>
                    <li>👥 <strong>Connect with Experts:</strong> Access agricultural specialists 24/7</li>
                    <li>📊 <strong>Track Progress:</strong> Monitor your issue resolution in real-time</li>
                    <li>📱 <strong>Get Notifications:</strong> Stay updated on solutions and advice</li>
                </ul>
            </div>

            <!-- Quick Start Guide -->
            <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h4 style="color: #d97706; margin-top: 0;">📝 Quick Start Guide:</h4>
                <ol style="margin: 0; padding-left: 20px; line-height: 1.8; color: #92400e;">
                    <li>Log into your dashboard</li>
                    <li>Report your first farm issue</li>
                    <li>Upload photos of the problem</li>
                    <li>Get matched with relevant experts</li>
                    <li>Receive intelligent solutions</li>
                </ol>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_URL}dashboard" 
                   style="background: #16a34a; color: white; text-decoration: none; padding: 15px 30px; 
                          border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                    🚀 Start Using AgriAssistify.ai
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Need help? Contact us at <a href="mailto:support@agriassistify.ai" style="color: #16a34a;">support@agriassistify.ai</a><br>
                AgriAssistify.ai - Empowering Farmers with Technology 🌱
            </p>
        </div>
    </div>`;

    return await sendMail(user.email, subject, `Welcome ${user.name}! Your AgriAssistify.ai account is ready.`, html);
};

// 🎫 New Ticket Confirmation Email
export const sendTicketCreatedEmail = async (user, ticket) => {
    const subject = `✅ Issue Reported: ${ticket.title} - Ticket #${ticket._id.toString().slice(-8).toUpperCase()}`;
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: #16a34a; text-align: center; padding: 30px 20px; color: white;">
            <h1 style="margin: 0; font-size: 28px;">✅ Issue Reported Successfully!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your agricultural issue is now being processed</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
            <h2 style="color: #16a34a;">Hello ${user.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                Your agricultural issue has been successfully submitted to our platform. Our AI system is analyzing your case and matching it with relevant experts.
            </p>

            <!-- Ticket Details -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #16a34a; margin-top: 0;">🎫 Ticket Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Ticket ID:</td>
                        <td style="padding: 8px 0; color: #6b7280;">#${ticket._id.toString().slice(-8).toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Issue:</td>
                        <td style="padding: 8px 0; color: #6b7280;">${ticket.title}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Type:</td>
                        <td style="padding: 8px 0; color: #6b7280;">${ticket.issueType.replace('-', ' ')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Priority:</td>
                        <td style="padding: 8px 0; color: #6b7280;">${ticket.urgencyLevel.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Status:</td>
                        <td style="padding: 8px 0; color: #6b7280;">Open - Awaiting Expert Assignment</td>
                    </tr>
                </table>
            </div>

            <!-- Next Steps -->
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h4 style="color: #1d4ed8; margin-top: 0;">📋 What Happens Next:</h4>
                <ol style="margin: 0; padding-left: 20px; line-height: 1.8; color: #1e40af;">
                    <li>AI analyzes your issue for initial recommendations</li>
                    <li>Expert assignment based on issue type and location</li>
                    <li>You'll receive email notification when expert responds</li>
                    <li>Track progress in your dashboard</li>
                </ol>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_URL}tickets/${ticket._id}" 
                   style="background: #16a34a; color: white; text-decoration: none; padding: 15px 30px; 
                          border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                    🔍 Track Your Issue
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Questions? Reply to this email or contact <a href="mailto:support@agriassistify.ai" style="color: #16a34a;">support@agriassistify.ai</a><br>
                AgriAssistify.ai - Your Agricultural Support Partner 🌾
            </p>
        </div>
    </div>`;

    return await sendMail(user.email, subject, `Your agricultural issue "${ticket.title}" has been reported successfully.`, html);
};

// 🔔 Expert Assignment Notification (to Expert)
export const sendExpertAssignmentEmail = async (expert, ticket, farmer) => {
    const subject = `🚨 New Case Assignment: ${ticket.title} - Urgent Response Needed`;
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: #dc2626; text-align: center; padding: 30px 20px; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🚨 New Case Assignment</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Farmer needs your expertise</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
            <h2 style="color: #dc2626;">Hello Dr. ${expert.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                A new agricultural case has been assigned to you based on your expertise. The farmer is waiting for your professional guidance.
            </p>

            <!-- Urgent Box -->
            <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">⚡ URGENT CASE DETAILS:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Issue:</td>
                        <td style="padding: 8px 0; color: #6b7280;">${ticket.title}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Farmer:</td>
                        <td style="padding: 8px 0; color: #6b7280;">${farmer.name} (${farmer.email})</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Priority:</td>
                        <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${ticket.urgencyLevel.toUpperCase()}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #374151;">Location:</td>
                        <td style="padding: 8px 0; color: #6b7280;">${ticket.fieldLocation || 'Not specified'}</td>
                    </tr>
                </table>
            </div>

            <!-- Issue Description -->
            <div style="background: #f9fafb; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0;">
                <h4 style="color: #16a34a; margin-top: 0;">📝 Issue Description:</h4>
                <p style="margin: 0; line-height: 1.6; color: #374151;">${ticket.description}</p>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_URL}tickets/${ticket._id}" 
                   style="background: #dc2626; color: white; text-decoration: none; padding: 15px 30px; 
                          border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                    🔍 View Full Case & Respond
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Time is critical! Please respond within 24 hours.<br>
                AgriAssistify.ai - Connecting Farmers with Experts 🤝
            </p>
        </div>
    </div>`;

    return await sendMail(expert.email, subject, `New agricultural case "${ticket.title}" has been assigned to you.`, html);
};

// 📧 Password Reset Email
export const sendPasswordResetEmail = async (user, resetToken) => {
    const subject = `🔐 Reset Your AgriAssistify.ai Password`;
    const resetUrl = `${process.env.APP_URL}reset-password?token=${resetToken}`;
    
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <!-- Header -->
        <div style="background: #f59e0b; text-align: center; padding: 30px 20px; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
            <h2 style="color: #f59e0b;">Hello ${user.name}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">
                We received a request to reset your AgriAssistify.ai password. Click the button below to create a new password:
            </p>

            <!-- Reset Button -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #f59e0b; color: white; text-decoration: none; padding: 15px 30px; 
                          border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                    🔐 Reset Password
                </a>
            </div>

            <!-- Security Notice -->
            <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <h4 style="color: #d97706; margin-top: 0;">🔒 Security Notice:</h4>
                <ul style="margin: 0; padding-left: 20px; line-height: 1.8; color: #92400e;">
                    <li>This link expires in 1 hour</li>
                    <li>If you didn't request this, ignore this email</li>
                    <li>Your password remains unchanged until you reset it</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px;">
                AgriAssistify.ai Security Team 🛡️
            </p>
        </div>
    </div>`;

    return await sendMail(user.email, subject, `Reset your password for AgriAssistify.ai`, html);
};

// Export all functions
export default {
    sendMail,
    sendWelcomeEmail,
    sendTicketCreatedEmail,
    sendExpertAssignmentEmail,
    sendPasswordResetEmail
};
