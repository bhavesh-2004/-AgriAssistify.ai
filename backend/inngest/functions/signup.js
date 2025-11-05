import { inngest } from "../client.js";              // Inngest client (to define functions & listen to events)
import User from "../../models/user.js";             
import { NonRetriableError } from "inngest";         
import { sendMail } from "../../utilities/mailer.js"; // Utility function to send emails

/**
 * Inngest Function: userSignup
 * 
 * - Triggered whenever the "user/signup" event is fired.
 * - Steps:
 *   1. Verify that the user exists in the database.
 *   2. Send a welcome email to the user.
 * - Retries: Up to 3 times if a retriable error occurs.
 */
export const userSignup = inngest.createFunction(
  
  { 
    id: "user-signup",     // Unique identifier for this function
    retries: 3             // Number of retries allowed for retriable errors
  },
  
  // Event configuration (listens to `user/signup` events)
  { event: "user/signup" },
 
  async ({ event, step }) => {
    try {
      // Extract email from the event data
      const { email } = event.data;

      /**
       * Step 1: Fetch the user from the database
       * - Uses step.run() for observability and retries
       * - Throws NonRetriableError if the user no longer exists
       */
      const user = await step.run("get-user-email", async () => {
        const userObject = await User.findOne({ email });

        if (!userObject) {
          throw new NonRetriableError("User no longer exists in the database.");
        }

        return userObject;
      });

      /**
       * Step 2: Send a welcome email to the user
       * - Uses sendMail utility function (configured with Nodemailer)
       */
      await step.run("send-welcome-email", async () => {
        const subject = "Welcome to AgriAssistify!";
        const message = `Hi ${user.name || ""},\n\n
        Thank you for signing up. We are glad to have you onboard!`;

        await sendMail(user.email, subject, message);
      });

      // Success response
      return { success: true };

    } catch (error) {
      console.error("❌ Error running step:", error.message);
      return { success: false };
    }
  }
);
