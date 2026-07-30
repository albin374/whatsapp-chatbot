const axios = require("axios");
require("dotenv").config();

async function sendMountingSolutions(to) {
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
                        text: "Please choose the mounting solution that best fits your requirements."
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: { id: "mount_tv_display", title: "📺 TV & Display" } // Keeping under 20 chars
                            },
                            {
                                type: "reply",
                                reply: { id: "mount_tv_ceiling", title: "↕️ TV Ceiling Mounts" }
                            },
                            {
                                type: "reply",
                                reply: { id: "mount_monitor", title: "🖥️ Monitor & Desktop" }
                            },
                            {
                                type: "reply",
                                reply: { id: "mount_motorized", title: "⚙️ Motorized Mounts" }
                            },
                            {
                                type: "reply",
                                reply: { id: "mount_tv_floor", title: "🛒 TV Floor Stands" }
                            },
                            {
                                type: "reply",
                                reply: { id: "mount_other", title: "➕ Other Solutions" }
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

        console.log("✅ Mounting Solutions Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending mounting solutions message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

module.exports = {
    sendMountingSolutions
};
