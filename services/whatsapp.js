const axios = require("axios");
require("dotenv").config();

async function sendWelcomeMessage(to) {
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
                        text: `Welcome to Skill Tech.

I'm your AI Assistant, ready to assist you with product information, quotations, technical support, and order inquiries. How may I help you today?`
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_products",
                                    title: "📦 Product Enquiry"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_install",
                                    title: "🛠️ Installation"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_support",
                                    title: "🎧 Customer Support"
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

        console.log("✅ Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending welcome message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function sendProductsMessage(to) {
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
                        text: "I'll help you find the best product for your needs.\n\nAre you interested in:"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_wholesale",
                                    title: "🏢 Wholesale (Bulk)"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "btn_retail",
                                    title: "🛍️ Retail (Indiv)"
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

        console.log("✅ Products Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending products message");
        console.error("Status:", err.response?.status);
        console.error(
            "Response:",
            JSON.stringify(err.response?.data, null, 2)
        );
    }
}

async function sendProductDetailsMessage(to, product) {
    try {
        let messageText = `*${product.name}*\n`;
        messageText += `SKU: ${product.sku}\n`;
        if (product.mainCategory) messageText += `Category: ${product.mainCategory} > ${product.subCategory}\n\n`;
        
        if (product.screen_size) messageText += `📏 Screen Size: ${product.screen_size}\n`;
        if (product.weight_capacity) messageText += `⚖️ Weight: ${product.weight_capacity}\n`;
        if (product.max_vesa) messageText += `🔧 VESA: ${product.max_vesa}\n`;
        
        const buttons = [];
        if (product.data_sheet_url) {
            buttons.push({
                type: "reply",
                reply: { id: `dl_doc_${product.id}`, title: "📄 Data Sheet" }
            });
        }
        if (product.image_url) {
            buttons.push({
                type: "reply",
                reply: { id: `dl_img_${product.id}`, title: "🖼️ View Image" }
            });
        }
        buttons.push({
            type: "reply",
            reply: { id: `dl_vid_${product.id}`, title: "▶️ Watch Video" }
        });

        let payload;
        if (buttons.length > 0) {
            payload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: { text: messageText },
                    action: { buttons: buttons }
                }
            };
        } else {
            payload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: { body: messageText }
            };
        }

        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Product Message Sent:", response.data);
        return response.data;

    } catch (err) {
        console.error("❌ Error sending product message");
        console.error("Response:", JSON.stringify(err.response?.data, null, 2));
    }
}

async function sendProductMedia(to, relativePath, mediaType, filename) {
    try {
        const fullUrl = `${process.env.PUBLIC_URL}/${relativePath}`;
        console.log(`Sending media from: ${fullUrl}`);
        
        let mediaObject = { link: fullUrl };
        if (filename && mediaType === "document") {
            mediaObject.filename = filename; // Only documents support custom filenames in WhatsApp
        }

        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: mediaType, // "document" or "image"
            [mediaType]: mediaObject
        };

        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(`✅ Product ${mediaType} Sent:`, response.data);
        return response.data;

    } catch (err) {
        console.error(`❌ Error sending ${mediaType}`);
        console.error("Response:", JSON.stringify(err.response?.data, null, 2));
    }
}

async function sendProductVideoLink(to, youtubeUrl) {
    try {
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: {
                preview_url: true, // This enables the rich video preview in WhatsApp
                body: `Here is the product video you requested:\n\n${youtubeUrl}`
            }
        };

        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ Video Link Sent:", response.data);
        return response.data;
    } catch (err) {
        console.error("❌ Error sending video link:", err.response?.data || err.message);
    }
}

async function sendTextMessage(to, textContent) {
    try {
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "text",
            text: { body: textContent }
        };

        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error("❌ Error sending text message:", err.response?.data || err.message);
    }
}

async function sendProductListMessage(to, products) {
    try {
        // WhatsApp list rows max 10
        const rows = products.slice(0, 10).map((p) => {
            return {
                id: p.sku || `PROD_${p.id}`,
                title: (p.name || "Product").substring(0, 24),
                description: (`SKU: ${p.sku}` || "").substring(0, 72)
            };
        });

        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: to,
            type: "interactive",
            interactive: {
                type: "list",
                header: { type: "text", text: "Products" },
                body: { text: "We couldn't find an exact match for your search. Here are some of our available products:" },
                footer: { text: "Select a product below" },
                action: {
                    button: "View Catalog",
                    sections: [
                        {
                            title: "Available Products",
                            rows: rows
                        }
                    ]
                }
            }
        };

        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error("❌ Error sending product list:", err.response?.data || err.message);
    }
}

module.exports = {
    sendWelcomeMessage,
    sendProductsMessage,
    sendProductDetailsMessage,
    sendProductMedia,
    sendProductVideoLink,
    sendTextMessage,
    sendProductListMessage
};