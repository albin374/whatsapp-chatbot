const axios = require("axios");
require("dotenv").config();

async function sendCablesMessage(to) {
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
                        text: "Which cable or accessory category do you need?"
                    },
                    action: {
                        button: "View options",
                        sections: [
                            {
                                title: "Cables & Accessories",
                                rows: [
                                    { id: "cable_hdmi", title: "HDMI Cables" },
                                    { id: "cable_av", title: "AV & Data Cables" },
                                    { id: "cable_electrical", title: "Electrical Wires" },
                                    { id: "cable_adapters", title: "Adapters & Accessories" },
                                    { id: "cable_other", title: "Other Cable" }
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

        console.log("✅ Cables Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending cables message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

module.exports = {
    sendCablesMessage
};
