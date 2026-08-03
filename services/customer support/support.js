const axios = require("axios");
require("dotenv").config();

async function sendSupportMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: "I’m sorry you need assistance. Let’s get the right support team involved. What is your full name?"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Support Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending support message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function sendSupportEmailMessage(to, name) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: `Thank you, ${name}. Enter your email address?`
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Support Email Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending support email message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function sendSupportPhoneMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: "Enter your phone number?"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("✅ Support Phone Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending support phone message", err.response?.data);
    }
}

async function sendSupportCountryMessage(to) {
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
                        text: "Which country are you contacting us from?"
                    },
                    action: {
                        button: "Select Country",
                        sections: [
                            {
                                title: "Countries",
                                rows: [
                                    { id: "country_uae", title: "🇦🇪 United Arab Emirates" },
                                    { id: "country_ksa", title: "🇸🇦 Saudi Arabia" },
                                    { id: "country_oman", title: "🇴🇲 Oman" },
                                    { id: "country_other", title: "🌍 Other country" }
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
        console.log("✅ Support Country Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending support country message", err.response?.data);
    }
}

async function sendSupportOtherCountryMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: "Please type your country name."
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("✅ Support Other Country Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending support other country message", err.response?.data);
    }
}

async function sendSupportCityMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: "Which city are you located in?"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("✅ Support City Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending support city message", err.response?.data);
    }
}

async function sendSupportProductDetailsMessage(to) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: "Please tell us what you're looking for. Mention the product name, model number, or any details that can help us assist you"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("✅ Support Product Details Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending support product details message", err.response?.data);
    }
}

async function sendSupportSummaryMessage(to, state, isEdit = false) {
    try {
        const textBody = isEdit 
            ? "Updated. Here is the revised summary.\n\nYou're almost done! Please review your details to ensure they're accurate before submitting your inquiry." 
            : "Thank you — I’ve analysed your message and prepared it for the support team.\n\n*AI*\nThis may be a technical or warranty issue. It would be routed to technical support for diagnosis.\n\nYou're almost done! Please review your details to ensure they're accurate before submitting your inquiry.";

        // First message: Analysis/Update text
        await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    body: textBody
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Second message: Summary with buttons
        const summaryText = `*REVIEW BEFORE SUBMITTING*\n*Support request summary*\n\n*Request:* Customer Support\n*Name:* ${state.name}\n*Email:* ${state.email}\n*Phone:* ${state.phone}\n*Country:* ${state.country}\n*City:* ${state.city}\n*Issue:* ${state.productDetails}`;
        
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
                        text: summaryText
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_submit_request",
                                    title: "✓ Submit request"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_edit_details",
                                    title: "✎ Edit details"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_start_over",
                                    title: "↻ Start over"
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
        console.log("✅ Support Summary Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending support summary message", err.response?.data);
    }
}

async function sendSupportEditMenuMessage(to) {
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
                                    { id: "edit_name", title: "Name" },
                                    { id: "edit_email", title: "Email" },
                                    { id: "edit_phone", title: "Phone" },
                                    { id: "edit_country", title: "Country" },
                                    { id: "edit_city", title: "City" },
                                    { id: "edit_issue", title: "Issue" },
                                    { id: "edit_back", title: "Back to summary" }
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
        console.log("✅ Support Edit Menu Message Sent:", response.data);
    } catch (err) {
        console.error("❌ Error sending support edit menu message", err.response?.data);
    }
}

async function sendSupportCorrectedMessage(to, fieldName) {
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
        console.log(`✅ Support Corrected ${fieldName} Message Sent:`, response.data);
    } catch (err) {
        console.error(`❌ Error sending support corrected ${fieldName} message`, err.response?.data);
    }
}

module.exports = {
    sendSupportMessage,
    sendSupportEmailMessage,
    sendSupportPhoneMessage,
    sendSupportCountryMessage,
    sendSupportOtherCountryMessage,
    sendSupportCityMessage,
    sendSupportProductDetailsMessage,
    sendSupportSummaryMessage,
    sendSupportEditMenuMessage,
    sendSupportCorrectedMessage
};
