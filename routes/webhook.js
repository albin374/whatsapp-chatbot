const express = require("express");
const router = express.Router();
const { sendWelcomeMessage, sendProductsMessage } = require("../services/whatsapp");
const { sendWholesaleCategories } = require("../services/products/wholsale/wholsale");
const { sendMountingSolutions } = require("../services/products/wholsale/mountingSolutions");
const { sendInstallationMessage, sendInstallationServicesMessage, sendTVSizeMessage } = require("../services/installation service/installation");
const { sendSupportMessage } = require("../services/customer support/support");
// Verification
router.get("/", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        console.log("✅ Webhook Verified");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

// Incoming WhatsApp events
router.post("/", async (req, res) => {
    console.log("🔥 POST RECEIVED");
    console.log(JSON.stringify(req.body, null, 2));

    try {
        const message =
            req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (!message) {
            return res.sendStatus(200);
        }

        const from = message.from;
        let text = message.text?.body;

        if (message.type === "interactive") {
            if (message.interactive?.type === "button_reply") {
                text = message.interactive.button_reply.id;
            } else if (message.interactive?.type === "list_reply") {
                text = message.interactive.list_reply.id;
            }
        }

        console.log("Message From:", from);
        console.log("Message:", text);

        if (text) {
            if (text.toLowerCase() === "hi") {
                await sendWelcomeMessage(from);
            } else if (text === "btn_products") {
                await sendProductsMessage(from);
            } else if (text === "btn_wholesale") {
                await sendWholesaleCategories(from);
            } else if (text === "btn_mounts") {
                await sendMountingSolutions(from);
            } else if (text === "btn_install") {
                await sendInstallationMessage(from);
            } else if (text === "btn_support") {
                await sendSupportMessage(from);
            } else if (text === "btn_install_consumer" || text === "btn_install_corporate") {
                await sendInstallationServicesMessage(from);
            } else if (text === "btn_install_tv") {
                await sendTVSizeMessage(from);
            }
        }

    } catch (err) {
        console.error(err);
    }

    res.sendStatus(200);
});
module.exports = router;