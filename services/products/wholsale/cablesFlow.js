const axios = require("axios");
require("dotenv").config();

async function sendCableSizeMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "To help us recommend the right cable, please enter your requirements (e.g., length, quantity, etc.)." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Size Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable size message", err.response?.data);
    }
}

async function sendCableNameMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Please enter your full name." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Name Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable name message", err.response?.data);
    }
}

async function sendCableCompanyNameMessage(to, name) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: `Thank you, ${name}. Please enter your company name.` }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Company Name Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable company name message", err.response?.data);
    }
}

async function sendCablePhoneMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Please enter your contact number, including the country code." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Phone Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable phone message", err.response?.data);
    }
}

async function sendCableEmailMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Please enter your business email address." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Email Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable email message", err.response?.data);
    }
}

async function sendCableLocationMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "Lastly, please enter your location." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Location Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable location message", err.response?.data);
    }
}

async function sendCableSummaryMessage(to, state, isEdit = false) {
    try {
        const summaryText = isEdit 
            ? `Updated. Here is the revised summary.\n\nYou're almost done! Please review your details to ensure they're accurate before submitting your inquiry.\n\n*Request:* Wholesale Cables\n*Cable Solution:* ${state.cableType}\n*Requirements:* ${state.cableSize}\n*Name:* ${state.name}\n*Company:* ${state.company}\n*Phone:* ${state.phone}\n*Email:* ${state.email}\n*Location:* ${state.location}`
            : `You're almost done! Please review your details to ensure they're accurate before submitting your inquiry.\n\n*Request:* Wholesale Cables\n*Cable Solution:* ${state.cableType}\n*Requirements:* ${state.cableSize}\n*Name:* ${state.name}\n*Company:* ${state.company}\n*Phone:* ${state.phone}\n*Email:* ${state.email}\n*Location:* ${state.location}`;
        
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
                            { type: "reply", reply: { id: "btn_cable_submit", title: "✓ Submit request" } },
                            { type: "reply", reply: { id: "btn_cable_edit", title: "✎ Edit details" } },
                            { type: "reply", reply: { id: "btn_start_over", title: "↻ Start over" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Summary Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable summary message", err.response?.data);
    }
}

async function sendCableEditMenuMessage(to) {
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
                    body: { text: "Which detail would you like to change?" },
                    action: {
                        button: "Select detail",
                        sections: [
                            {
                                title: "Options",
                                rows: [
                                    { id: "edit_cable_size", title: "Requirements" },
                                    { id: "edit_cable_name", title: "Name" },
                                    { id: "edit_cable_company", title: "Company Name" },
                                    { id: "edit_cable_phone", title: "Phone" },
                                    { id: "edit_cable_email", title: "Email" },
                                    { id: "edit_cable_location", title: "Location" },
                                    { id: "edit_cable_back", title: "Back to summary" }
                                ]
                            }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Cable Edit Menu Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending cable edit menu message", err.response?.data);
    }
}

async function sendCableCorrectedMessage(to, fieldName) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: `Please enter the corrected ${fieldName}.` }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log(`✅ Cable Corrected ${fieldName} Message Sent:`, response.data);
    } catch (err) {
        console.error(`❌ Error sending cable corrected ${fieldName} message`, err.response?.data);
    }
}

module.exports = {
    sendCableSizeMessage,
    sendCableNameMessage,
    sendCableCompanyNameMessage,
    sendCablePhoneMessage,
    sendCableEmailMessage,
    sendCableLocationMessage,
    sendCableSummaryMessage,
    sendCableEditMenuMessage,
    sendCableCorrectedMessage
};
