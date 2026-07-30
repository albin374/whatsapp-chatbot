const axios = require("axios");
require("dotenv").config();

async function sendWholesaleCategories(to) {
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
                        text: "Great! Please select the product category you're interested in."
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_mounts",
                                    title: "🖥️ Mounting Solutions"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_displays",
                                    title: "🔲 Displays"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_cables",
                                    title: "〰️ Cables & Wires"
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

        console.log("✅ Wholesale Categories Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending wholesale categories");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

module.exports = {
    sendWholesaleCategories
};
