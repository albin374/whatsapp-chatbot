const axios = require("axios");
require("dotenv").config();

async function sendDisplaysMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "list",
                    body: {
                        text: "Which display solution are you looking for?"
                    },
                    action: {
                        button: "View options",
                        sections: [
                            {
                                title: "Display Solutions",
                                rows: [
                                    { id: "display_led", title: "LED Display Solution" },
                                    { id: "display_interactive", title: "Interactive Display" },
                                    { id: "display_videowall", title: "Video Wall" },
                                    { id: "display_signage", title: "Digital Signage" },
                                    { id: "display_other", title: "Other Display" }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Displays Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending displays message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

module.exports = {
    sendDisplaysMessage
};
