const axios = require("axios");
require("dotenv").config();

async function sendDisplaySizeMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "To help us recommend the right display, please enter your display screen size (e.g., 55\", 75\", etc.)." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Display Size Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display size message", err.response?.data);
    }
}

async function sendDisplayNameMessage(to) {
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
        console.log("✅ Display Name Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display name message", err.response?.data);
    }
}

async function sendDisplayCompanyNameMessage(to, name) {
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
        console.log("✅ Display Company Name Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display company name message", err.response?.data);
    }
}

async function sendDisplayPhoneMessage(to) {
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
        console.log("✅ Display Phone Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display phone message", err.response?.data);
    }
}

async function sendDisplayEmailMessage(to) {
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
        console.log("✅ Display Email Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display email message", err.response?.data);
    }
}

async function sendDisplayLocationMessage(to) {
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
        console.log("✅ Display Location Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display location message", err.response?.data);
    }
}

async function sendDisplaySummaryMessage(to, state, isEdit = false) {
    try {
        const summaryText = isEdit 
            ? `Updated. Here is the revised summary.\n\nYou're almost done! Please review your details to ensure they're accurate before submitting your inquiry.\n\n*Request:* Wholesale Displays\n*Display Solution:* ${state.displayType}\n*Display Size:* ${state.displaySize}\n*Name:* ${state.name}\n*Company:* ${state.company}\n*Phone:* ${state.phone}\n*Email:* ${state.email}\n*Location:* ${state.location}`
            : `You're almost done! Please review your details to ensure they're accurate before submitting your inquiry.\n\n*Request:* Wholesale Displays\n*Display Solution:* ${state.displayType}\n*Display Size:* ${state.displaySize}\n*Name:* ${state.name}\n*Company:* ${state.company}\n*Phone:* ${state.phone}\n*Email:* ${state.email}\n*Location:* ${state.location}`;
        
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
                            { type: "reply", reply: { id: "btn_display_submit", title: "✓ Submit request" } },
                            { type: "reply", reply: { id: "btn_display_edit", title: "✎ Edit details" } },
                            { type: "reply", reply: { id: "btn_start_over", title: "↻ Start over" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Display Summary Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display summary message", err.response?.data);
    }
}

async function sendDisplayEditMenuMessage(to) {
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
                                    { id: "edit_display_size", title: "Display Size" },
                                    { id: "edit_display_name", title: "Name" },
                                    { id: "edit_display_company", title: "Company Name" },
                                    { id: "edit_display_phone", title: "Phone" },
                                    { id: "edit_display_email", title: "Email" },
                                    { id: "edit_display_location", title: "Location" },
                                    { id: "edit_display_back", title: "Back to summary" }
                                ]
                            }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Display Edit Menu Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending display edit menu message", err.response?.data);
    }
}

async function sendDisplayCorrectedMessage(to, fieldName) {
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
        console.log(`✅ Display Corrected ${fieldName} Message Sent:`, response.data);
    } catch (err) {
        console.error(`❌ Error sending display corrected ${fieldName} message`, err.response?.data);
    }
}

module.exports = {
    sendDisplaySizeMessage,
    sendDisplayNameMessage,
    sendDisplayCompanyNameMessage,
    sendDisplayPhoneMessage,
    sendDisplayEmailMessage,
    sendDisplayLocationMessage,
    sendDisplaySummaryMessage,
    sendDisplayEditMenuMessage,
    sendDisplayCorrectedMessage
};
