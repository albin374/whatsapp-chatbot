const axios = require("axios");
require("dotenv").config();

async function sendInstallationMessage(to) {
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
                        text: "I can help arrange an installation visit. Are you booking as a consumer or for a company?"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_install_consumer",
                                    title: "👤 Consumer"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_install_corporate",
                                    title: "🏢 Corporate"
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

        console.log("✅ Installation Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending installation message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function sendInstallationServicesMessage(to) {
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
                        text: "Which installation service do you need?"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_install_tv",
                                    title: "📺 TV Installation"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_install_cctv",
                                    title: "📹 CCTV Install"
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

        console.log("✅ Installation Services Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending installation services message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function sendTVSizeMessage(to) {
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
                        text: "What is the size of the TV or display?"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_tv_upto_65",
                                    title: "Upto 65 inches"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_tv_65_to_75",
                                    title: "65-75 inches"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_tv_above_75",
                                    title: "Above 75 inches"
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

        console.log("✅ TV Size Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending TV size message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

module.exports = {
    sendInstallationMessage,
    sendInstallationServicesMessage,
    sendTVSizeMessage
};
