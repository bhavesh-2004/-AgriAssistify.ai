/**
 * ON-TICKET-CREATED.JS - AgriAssistify.ai Background Job
 * 
 * This Inngest function handles the complete workflow when a new farm ticket is created:
 * 1. Fetches ticket from database
 * 2. Analyzes issue using AI (Gemini)
 * 3. Assigns priority and required skills
 * 4. Finds and assigns skilled moderator/admin
 * 5. Sends email notification to assigned person
 * 
 * Purpose: Automates intelligent task assignment for agricultural issues
 */

// ==================== IMPORTS ====================

import { inngest } from "../client.js";                    
import Ticket from "../../models/ticket.js";              
import User from "../../models/user.js";                  // User model for farmers/workers/moderators
import { NonRetriableError } from "inngest";            
import { sendMail } from "../../utilities/mailer.js";    
import analyzeTicket from "../../utilities/ticketAnalyzer.js"; // AI ticket analysis


// ==================== MAIN FUNCTION ====================
export const onTicketCreated = inngest.createFunction(
    { 
        id: "on-ticket-created",     
        retries: 3                  
    },
    
    // Listen for ticket creation events
    { event: "ticket/created" },

    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;

            // ==================== STEP 1: FETCH TICKET ====================

            // Retrieve the newly created ticket from MongoDB
            const ticket = await step.run("fetch-ticket", async () => {
                const ticketObject = await Ticket.findById(ticketId);
                
                if (!ticketObject) {
                    throw new NonRetriableError("Ticket not found in database");
                }
                
                return ticketObject;
            });

            // ==================== STEP 2: UPDATE INITIAL STATUS ====================
             
            await step.run("update-initial-status", async () => {
                await Ticket.findByIdAndUpdate(ticket._id, {
                    status: "TODO"
                });
            });

            // ==================== STEP 3: AI ANALYSIS ====================

            // Analyze ticket using Gemini AI to determine priority and skills
            const aiAnalysis = await step.run("ai-processing", async () => {
                const aiResponse = await analyzeTicket(ticket);
                let skills = [];

                if (aiResponse) {
                    // Validate AI priority or default to "medium"
                    const validPriority = ["low", "medium", "high"].includes(aiResponse.priority) 
                        ? aiResponse.priority 
                        : "medium";

              
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: validPriority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        status: "IN_PROGRESS",
                        relatedSkills: aiResponse.relatedSkills || []
                    });
                    
                    skills = aiResponse.relatedSkills || [];
                }
                
                return skills;
            });

            // ==================== STEP 4: ASSIGN MODERATOR/ADMIN ====================

            // Find skilled moderator or fallback to admin
            const assignedUser = await step.run("assign-moderator", async () => {
                let user = null;

                // FIX: Improved skills matching query
                if (aiAnalysis.length > 0) {
                    user = await User.findOne({
                        role: "moderator",
                        skills: { $in: aiAnalysis }  
                    });
                }

                // Fallback: Assign to admin if no skilled moderator found
                if (!user) {
                    user = await User.findOne({
                        role: "admin"
                    });
                }

                // Update ticket with assigned user
                if (user) {
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        assignedTo: user._id
                    });
                }

                return user;
            });

            // ==================== STEP 5: EMAIL NOTIFICATION ====================

            // Send email notification to assigned moderator/admin
            await step.run("send-email-notification", async () => {
                if (assignedUser) {
                    // Get updated ticket with all details
                    const finalTicket = await Ticket.findById(ticket._id);
                    
                    // Compose agriculture-specific email
                    const subject = `🚨 New ${finalTicket.priority.toUpperCase()} Priority Farm Issue Assigned`;
                    const message = `
                        Hi ${assignedUser.name || assignedUser.email},
                        
                        A new agricultural issue has been assigned to you:
                        
                        📋 TICKET DETAILS:
                        • Title: ${finalTicket.title}
                        • Priority: ${finalTicket.priority}
                        • Status: ${finalTicket.status}
                        • Issue Type: ${finalTicket.issueType || 'General'}
                        • Required Skills: ${aiAnalysis.join(', ') || 'General farming knowledge'}
                        
                        🤖 AI SUGGESTIONS:
                        ${finalTicket.helpfulNotes || 'AI analysis pending'}
                        
                        Please check your AgriAssistify.ai dashboard for full details and take appropriate action.
                        
                        Best regards,
                        AgriAssistify.ai Team
                    `;
                    
                    await sendMail(assignedUser.email, subject, message);
                }
            });

            // ==================== SUCCESS RESPONSE ====================

            return {
                success: true,
                ticketId: ticket._id,
                assignedTo: assignedUser?._id || null,
                priority: aiAnalysis.priority || "medium",
                skillsRequired: aiAnalysis || [],
                notificationSent: !!assignedUser
            };

        } catch (error) {
            // ==================== ERROR HANDLING ====================
            
            console.error("Ticket processing workflow error:", error.message);
            return {
                success: false,
                error: error.message,
                ticketId: event.data.ticketId
            };
        }
    }
);
