const axios = require("axios");
require("dotenv").config();

async function sendMountTypeMessage(to, isEdit = false) {
    try {
        const textMessage = isEdit ? "Please enter the corrected mount type." : "What type of TV wall mount are you looking for?";
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
                            { type: "reply", reply: { id: "mount_type_fixed", title: "Fixed TV Wall Mount" } },
                            { type: "reply", reply: { id: "mount_type_tilt", title: "Tilt TV Wall Mount" } },
                            { type: "reply", reply: { id: "mount_type_full", title: "Full-Motion Mount" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Mount Type Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount type message", err.response?.data);
    }
}

async function sendMountTvSizeMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: "To help us recommend the right mount, please enter your TV screen size (e.g., 55\", 75\", etc.)." }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Mount TV Size Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount tv size message", err.response?.data);
    }
}

async function sendMountNameMessage(to) {
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
        console.log("✅ Mount Name Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount name message", err.response?.data);
    }
}

async function sendMountCompanyNameMessage(to, name) {
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
        console.log("✅ Mount Company Name Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount company name message", err.response?.data);
    }
}

async function sendMountPhoneMessage(to) {
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
        console.log("✅ Mount Phone Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount phone message", err.response?.data);
    }
}

async function sendMountEmailMessage(to) {
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
        console.log("✅ Mount Email Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount email message", err.response?.data);
    }
}

async function sendMountLocationMessage(to) {
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
        console.log("✅ Mount Location Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount location message", err.response?.data);
    }
}

async function sendMountSummaryMessage(to, state, isEdit = false) {
    try {
        const summaryText = isEdit 
            ? `Updated. Here is the revised summary.\n\nYou're almost done! Please review your details to ensure they're accurate before submitting your inquiry.\n\n*Request:* Wholesale TV Mounts\n*Mount Type:* ${state.mountType}\n*TV Size:* ${state.tvSize}\n*Name:* ${state.name}\n*Company:* ${state.company}\n*Phone:* ${state.phone}\n*Email:* ${state.email}\n*Location:* ${state.location}`
            : `You're almost done! Please review your details to ensure they're accurate before submitting your inquiry.\n\n*Request:* Wholesale TV Mounts\n*Mount Type:* ${state.mountType}\n*TV Size:* ${state.tvSize}\n*Name:* ${state.name}\n*Company:* ${state.company}\n*Phone:* ${state.phone}\n*Email:* ${state.email}\n*Location:* ${state.location}`;
        
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
                            { type: "reply", reply: { id: "btn_mount_submit", title: "✓ Submit request" } },
                            { type: "reply", reply: { id: "btn_mount_edit", title: "✎ Edit details" } },
                            { type: "reply", reply: { id: "btn_start_over", title: "↻ Start over" } }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Mount Summary Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount summary message", err.response?.data);
    }
}

async function sendMountEditMenuMessage(to) {
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
                                    { id: "edit_mount_type", title: "Mount Type" },
                                    { id: "edit_mount_tvsize", title: "TV Size" },
                                    { id: "edit_mount_name", title: "Name" },
                                    { id: "edit_mount_company", title: "Company Name" },
                                    { id: "edit_mount_phone", title: "Phone" },
                                    { id: "edit_mount_email", title: "Email" },
                                    { id: "edit_mount_location", title: "Location" },
                                    { id: "edit_mount_back", title: "Back to summary" }
                                ]
                            }
                        ]
                    }
                }
            },
            { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
        );
        console.log("✅ Mount Edit Menu Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending mount edit menu message", err.response?.data);
    }
}

async function sendMountCorrectedMessage(to, fieldName) {
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
        console.log(`✅ Mount Corrected ${fieldName} Message Sent:`, response.data);
    } catch (err) {
        console.error(`❌ Error sending mount corrected ${fieldName} message`, err.response?.data);
    }
}

module.exports = {
    sendMountTypeMessage,
    sendMountTvSizeMessage,
    sendMountNameMessage,
    sendMountCompanyNameMessage,
    sendMountPhoneMessage,
    sendMountEmailMessage,
    sendMountLocationMessage,
    sendMountSummaryMessage,
    sendMountEditMenuMessage,
    sendMountCorrectedMessage
};
