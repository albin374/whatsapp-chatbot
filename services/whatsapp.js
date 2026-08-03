const axios = require("axios");
require("dotenv").config();

async function sendWelcomeMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: `Welcome to Skill Tech.

I'm your AI Assistant, ready to assist you with product information, quotations, technical support, and order inquiries. How may I help you today?`
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_products",
                                    title: "📦 Product Enquiry"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_install",
                                    title: "🛠️ Installation"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_support",
                                    title: "🎧 Customer Support"
                                }
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

        console.log("✅ Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending welcome message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function sendProductsMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: "I'll help you find the best product for your needs.\n\nAre you interested in:"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_wholesale",
                                    title: "🏢 Wholesale (Bulk)"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_retail",
                                    title: "🛍️ Retail (Indiv)"
                                }
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

        console.log("✅ Products Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending products message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

module.exports = {
    sendWelcomeMessage,
    sendProductsMessage
};