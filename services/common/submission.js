const axios = require("axios");
require("dotenv").config();

async function sendSubmissionConfirmationMessage(to, name, category, referencePrefix) {
    try {
        // Send initial processing message
        await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "We're securely processing your request. Please wait a moment..." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );

        // Generate Reference ID
        const date = new Date();
        const dateString = date.getFullYear().toString() + 
            (date.getMonth() + 1).toString().padStart(2, '0') + 
            date.getDate().toString().padStart(2, '0');
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const referenceId = `ST-${referencePrefix}-${dateString}-${randomDigits}`;

        const confirmationText = `✅ Thank you, ${name}! Your request has been recorded for the ${category} team.\n\nReference: ${referenceId}\n\nA Skill Tech representative would contact you shortly.\n\n[Demo submission complete — the information remains only in this browser and was not sent to a server.]`;

        // Send confirmation interactive message
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: confirmationText },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_start_new", title: "+ Start a new request" } },
                            { type: "reply", reply: { id: "btn_talk_sales", title: "💬 Talk to sales" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );

        console.log(`✅ Submission Confirmation Message Sent for ${category}:`, response.data);
    } catch (err) {
        console.error("❌ Error sending submission confirmation message", err.response?.data);
    }
}

module.exports = {
    sendSubmissionConfirmationMessage
};
