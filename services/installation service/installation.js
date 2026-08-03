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
                                    title: "🏢 Corporate/project"
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
        console.error("❌ Error sending installation services message", err.response?.data);
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
        console.error("❌ Error sending TV size message", err.response?.data);
    }
}

async function sendInstallNameMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Enter your full name?" }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Name Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install name message", err.response?.data);
    }
}

async function sendInstallPhoneMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Enter your phone number?" }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Phone Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install phone message", err.response?.data);
    }
}

async function sendInstallDateMessage(to, isEdit = false) {
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const options = { month: 'short', day: 'numeric' };
        const todayStr = `Today - ${today.toLocaleDateString('en-US', options)}`;
        const tomorrowStr = `Tomorrow - ${tomorrow.toLocaleDateString('en-US', options)}`;

        const textMessage = isEdit ? "Please enter the corrected preferred date." : "Which date would you prefer for the installation?";

        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: textMessage },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_date_today", title: todayStr } },
                            { type: "reply", reply: { id: "btn_date_tomorrow", title: tomorrowStr } },
                            { type: "reply", reply: { id: "btn_date_other", title: "🗓️ Type another date" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Date Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install date message", err.response?.data);
    }
}

async function sendInstallCustomDateMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Please type your preferred installation date." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Custom Date Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install custom date message", err.response?.data);
    }
}

async function sendInstallTimeMessage(to, isEdit = false) {
    try {
        const textMessage = isEdit ? "Please enter the corrected available time." : "What time window is most convenient?";
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: textMessage },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_time_morning", title: "Morning - 8am–12pm" } },
                            { type: "reply", reply: { id: "btn_time_afternoon", title: "Afternoon - 12pm–5pm" } },
                            { type: "reply", reply: { id: "btn_time_evening", title: "Evening - 5pm–8pm" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Time Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install time message", err.response?.data);
    }
}

async function sendInstallBracketMessage(to, isEdit = false) {
    try {
        const textMessage = isEdit ? "Please enter the corrected bracket requirement." : "Do you need Skill Tech to supply a suitable TV bracket?";
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: textMessage },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_bracket_yes", title: "Yes, I need" } },
                            { type: "reply", reply: { id: "btn_bracket_no", title: "No, I already have" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Bracket Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install bracket message", err.response?.data);
    }
}

async function sendInstallLocationMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Please enter the installation area, city, or brief address." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Location Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install location message", err.response?.data);
    }
}

async function sendInstallSummaryMessage(to, state, isEdit = false) {
    try {
        const textBody = isEdit 
            ? "Updated. Here is the revised summary.\n\nYou're almost done! Please review your details to ensure they're accurate before submitting your inquiry." 
            : "You're almost done! Please review your details to ensure they're accurate before submitting your inquiry.";

        await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: textBody }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );

        const tvSizeLine = state.tvSize ? `\n*TV / display size:* ${state.tvSize}` : "";
        const siteDescLine = state.siteDescription ? `\n*Site details:* ${state.siteDescription}` : "";
        const bracketLine = state.bracket ? `\n*Bracket:* ${state.bracket}` : "";
        const summaryText = `*REVIEW BEFORE SUBMITTING*\n*Installation booking summary*\n\n*Request:* Installation Service\n*Customer:* ${state.customerType}\n*Service:* ${state.serviceType}${tvSizeLine}${siteDescLine}\n*Name:* ${state.name}\n*Phone:* ${state.phone}\n*Preferred date:* ${state.date}\n*Available time:* ${state.time}${bracketLine}\n*Location:* ${state.location}`;
        
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: summaryText },
                    action: {
                        buttons: [
                            { type: "reply", reply: { id: "btn_install_submit", title: "✓ Submit request" } },
                            { type: "reply", reply: { id: "btn_install_edit", title: "✎ Edit details" } },
                            { type: "reply", reply: { id: "btn_start_over", title: "↻ Start over" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Install Summary Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install summary message", err.response?.data);
    }
}

async function sendInstallEditMenuMessage(to) {
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
                        text: "Which detail would you like to change?"
                    },
                    action: {
                        button: "Select detail",
                        sections: [
                            {
                                title: "Options",
                                rows: [
                                    { id: "edit_install_name", title: "Name" },
                                    { id: "edit_install_phone", title: "Phone" },
                                    { id: "edit_install_date", title: "Preferred date" },
                                    { id: "edit_install_time", title: "Available time" },
                                    { id: "edit_install_bracket", title: "Bracket" },
                                    { id: "edit_install_location", title: "Location" },
                                    { id: "edit_install_back", title: "Back to summary" }
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
        console.log("✅ Install Edit Menu Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending install edit menu message", err.response?.data);
    }
}

async function sendInstallCorrectedMessage(to, fieldName) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: `Please enter the corrected ${fieldName}.`
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(`✅ Install Corrected ${fieldName} Message Sent:`, response.data);
    } catch (err) {
        console.error(`❌ Error sending install corrected ${fieldName} message`, err.response?.data);
    }
}

module.exports = {
    sendInstallationMessage,
    sendInstallationServicesMessage,
    sendTVSizeMessage,
    sendInstallNameMessage,
    sendInstallPhoneMessage,
    sendInstallDateMessage,
    sendInstallCustomDateMessage,
    sendInstallTimeMessage,
    sendInstallBracketMessage,
    sendInstallLocationMessage,
    sendInstallSummaryMessage,
    sendInstallEditMenuMessage,
    sendInstallCorrectedMessage
};
