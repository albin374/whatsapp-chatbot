const axios = require("axios");
require("dotenv").config();

async function sendCorporateServicesMessage(to) {
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
                        text: "Which commercial installation can we help with?"
                    },
                    action: {
                        button: "View options",
                        sections: [
                            {
                                title: "Installation Services",
                                rows: [
                                    { id: "btn_corp_tv", title: "Commercial TV Install" },
                                    { id: "btn_corp_led", title: "LED/Video Wall Install" },
                                    { id: "btn_corp_av", title: "Meeting Room AV Setup" },
                                    { id: "btn_corp_cctv", title: "CCTV Installation" }
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

        console.log("✅ Corporate Services Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending corporate services message", err.response?.data);
    }
}

async function sendSiteDescriptionMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Please briefly describe the site and the installation you need. Include the number of cameras, displays, or rooms if known." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Site Description Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending site description message", err.response?.data);
    }
}

module.exports = {
    sendCorporateServicesMessage,
    sendSiteDescriptionMessage
};
