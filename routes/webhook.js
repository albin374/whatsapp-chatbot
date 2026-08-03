const express = require("express");
const router = express.Router();
const { sendWelcomeMessage, sendProductsMessage } = require("../services/whatsapp");
const { sendRetailCategories } = require("../services/products/retail/retail");
const { sendWholesaleCategories } = require("../services/products/wholsale/wholsale");
const { sendSubmissionConfirmationMessage } = require("../services/common/submission");
const { sendMountingSolutions } = require("../services/products/wholsale/mountingSolutions");
const { sendDisplaysMessage } = require("../services/products/wholsale/displays");
const { sendCablesMessage } = require("../services/products/wholsale/cables");
const {
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
} = require("../services/products/wholsale/mountingTvDisplay");
const {
    sendDisplaySizeMessage,
    sendDisplayNameMessage,
    sendDisplayCompanyNameMessage,
    sendDisplayPhoneMessage,
    sendDisplayEmailMessage,
    sendDisplayLocationMessage,
    sendDisplaySummaryMessage,
    sendDisplayEditMenuMessage,
    sendDisplayCorrectedMessage
} = require("../services/products/wholsale/displaysFlow");
const {
    sendCableSizeMessage,
    sendCableNameMessage,
    sendCableCompanyNameMessage,
    sendCablePhoneMessage,
    sendCableEmailMessage,
    sendCableLocationMessage,
    sendCableSummaryMessage,
    sendCableEditMenuMessage,
    sendCableCorrectedMessage
} = require("../services/products/wholsale/cablesFlow");
const { 
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
} = require("../services/installation service/installation");
const { sendCorporateServicesMessage, sendSiteDescriptionMessage } = require("../services/installation service/corporate");
const { 
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
} = require("../services/customer support/support");

const userStates = {}; // In-memory store for conversational state

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
            if (userStates[from]) {
                const state = userStates[from];
                
                if (state.step === "WAITING_FOR_NAME_SUPPORT") {
                    state.name = text;
                    state.step = "WAITING_FOR_EMAIL_SUPPORT";
                    await sendSupportEmailMessage(from, text);
                    return res.sendStatus(200);
                }
                
                if (state.step === "WAITING_FOR_EMAIL_SUPPORT") {
                    state.email = text;
                    state.step = "WAITING_FOR_PHONE_SUPPORT";
                    await sendSupportPhoneMessage(from);
                    return res.sendStatus(200);
                }
                
                if (state.step === "WAITING_FOR_PHONE_SUPPORT") {
                    state.phone = text;
                    state.step = "WAITING_FOR_COUNTRY_SUPPORT";
                    await sendSupportCountryMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_COUNTRY_SUPPORT") {
                    if (text === "country_other") {
                        state.step = "WAITING_FOR_OTHER_COUNTRY_SUPPORT";
                        await sendSupportOtherCountryMessage(from);
                        return res.sendStatus(200);
                    } else if (text === "country_uae" || text === "country_ksa" || text === "country_oman") {
                        state.country = text;
                        state.step = "WAITING_FOR_CITY_SUPPORT";
                        await sendSupportCityMessage(from);
                        return res.sendStatus(200);
                    } else {
                        // In case they just type the country instead of using the list
                        if (text.toLowerCase().includes("other")) {
                            state.step = "WAITING_FOR_OTHER_COUNTRY_SUPPORT";
                            await sendSupportOtherCountryMessage(from);
                        } else {
                            state.country = text;
                            state.step = "WAITING_FOR_CITY_SUPPORT";
                            await sendSupportCityMessage(from);
                        }
                        return res.sendStatus(200);
                    }
                }

                if (state.step === "WAITING_FOR_OTHER_COUNTRY_SUPPORT") {
                    state.country = text;
                    state.step = "WAITING_FOR_CITY_SUPPORT";
                    await sendSupportCityMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CITY_SUPPORT") {
                    state.city = text;
                    state.step = "WAITING_FOR_PRODUCT_DETAILS_SUPPORT";
                    await sendSupportProductDetailsMessage(from);
                    return res.sendStatus(200);
                }

                // --- Wholesale TV Mount Flow ---
                if (state.step === "WAITING_FOR_MOUNT_TYPE") {
                    if (text === "mount_type_fixed") state.mountType = "Fixed TV Wall Mount";
                    else if (text === "mount_type_tilt") state.mountType = "Tilt TV Wall Mount";
                    else if (text === "mount_type_full") state.mountType = "Full-Motion TV Wall Mount";
                    else state.mountType = text;

                    state.step = "WAITING_FOR_MOUNT_TV_SIZE";
                    await sendMountTvSizeMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_TV_SIZE") {
                    state.tvSize = text;
                    state.step = "WAITING_FOR_MOUNT_NAME";
                    await sendMountNameMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_NAME") {
                    state.name = text;
                    state.step = "WAITING_FOR_MOUNT_COMPANY";
                    await sendMountCompanyNameMessage(from, state.name);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_COMPANY") {
                    state.company = text;
                    state.step = "WAITING_FOR_MOUNT_PHONE";
                    await sendMountPhoneMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_PHONE") {
                    state.phone = text;
                    state.step = "WAITING_FOR_MOUNT_EMAIL";
                    await sendMountEmailMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_EMAIL") {
                    state.email = text;
                    state.step = "WAITING_FOR_MOUNT_LOCATION";
                    await sendMountLocationMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_LOCATION") {
                    state.location = text;
                    state.step = "WAITING_FOR_MOUNT_SUBMIT";
                    await sendMountSummaryMessage(from, state);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_SUBMIT") {
                    if (text === "btn_mount_submit") {
                        const name = state.name || "Customer";
                        delete userStates[from];
                        await sendSubmissionConfirmationMessage(from, name, "product catalogue", "PE");
                    } else if (text === "btn_mount_edit") {
                        state.step = "WAITING_FOR_MOUNT_EDIT_SELECTION";
                        await sendMountEditMenuMessage(from);
                    } else if (text === "btn_start_over") {
                        delete userStates[from];
                        await sendWelcomeMessage(from);
                    }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_MOUNT_EDIT_SELECTION") {
                    if (text === "edit_mount_type") { state.step = "WAITING_FOR_CORRECTED_MOUNT_TYPE"; await sendMountTypeMessage(from, true); }
                    else if (text === "edit_mount_tvsize") { state.step = "WAITING_FOR_CORRECTED_MOUNT_TV_SIZE"; await sendMountCorrectedMessage(from, "TV screen size"); }
                    else if (text === "edit_mount_name") { state.step = "WAITING_FOR_CORRECTED_MOUNT_NAME"; await sendMountCorrectedMessage(from, "full name"); }
                    else if (text === "edit_mount_company") { state.step = "WAITING_FOR_CORRECTED_MOUNT_COMPANY"; await sendMountCorrectedMessage(from, "company name"); }
                    else if (text === "edit_mount_phone") { state.step = "WAITING_FOR_CORRECTED_MOUNT_PHONE"; await sendMountCorrectedMessage(from, "contact number"); }
                    else if (text === "edit_mount_email") { state.step = "WAITING_FOR_CORRECTED_MOUNT_EMAIL"; await sendMountCorrectedMessage(from, "business email"); }
                    else if (text === "edit_mount_location") { state.step = "WAITING_FOR_CORRECTED_MOUNT_LOCATION"; await sendMountCorrectedMessage(from, "location"); }
                    else if (text === "edit_mount_back") { state.step = "WAITING_FOR_MOUNT_SUBMIT"; await sendMountSummaryMessage(from, state); }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CORRECTED_MOUNT_TYPE") {
                    if (text === "mount_type_fixed") state.mountType = "Fixed TV Wall Mount";
                    else if (text === "mount_type_tilt") state.mountType = "Tilt TV Wall Mount";
                    else if (text === "mount_type_full") state.mountType = "Full-Motion TV Wall Mount";
                    else state.mountType = text;
                    state.step = "WAITING_FOR_MOUNT_SUBMIT";
                    await sendMountSummaryMessage(from, state, true);
                    return res.sendStatus(200);
                }
                
                if (state.step === "WAITING_FOR_CORRECTED_MOUNT_TV_SIZE") { state.tvSize = text; state.step = "WAITING_FOR_MOUNT_SUBMIT"; await sendMountSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_MOUNT_NAME") { state.name = text; state.step = "WAITING_FOR_MOUNT_SUBMIT"; await sendMountSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_MOUNT_COMPANY") { state.company = text; state.step = "WAITING_FOR_MOUNT_SUBMIT"; await sendMountSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_MOUNT_PHONE") { state.phone = text; state.step = "WAITING_FOR_MOUNT_SUBMIT"; await sendMountSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_MOUNT_EMAIL") { state.email = text; state.step = "WAITING_FOR_MOUNT_SUBMIT"; await sendMountSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_MOUNT_LOCATION") { state.location = text; state.step = "WAITING_FOR_MOUNT_SUBMIT"; await sendMountSummaryMessage(from, state, true); return res.sendStatus(200); }
                // --- End Wholesale TV Mount Flow ---

                // --- Wholesale Display Flow ---
                if (state.step === "WAITING_FOR_DISPLAY_SIZE") {
                    state.displaySize = text;
                    state.step = "WAITING_FOR_DISPLAY_NAME";
                    await sendDisplayNameMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_DISPLAY_NAME") {
                    state.name = text;
                    state.step = "WAITING_FOR_DISPLAY_COMPANY";
                    await sendDisplayCompanyNameMessage(from, state.name);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_DISPLAY_COMPANY") {
                    state.company = text;
                    state.step = "WAITING_FOR_DISPLAY_PHONE";
                    await sendDisplayPhoneMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_DISPLAY_PHONE") {
                    state.phone = text;
                    state.step = "WAITING_FOR_DISPLAY_EMAIL";
                    await sendDisplayEmailMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_DISPLAY_EMAIL") {
                    state.email = text;
                    state.step = "WAITING_FOR_DISPLAY_LOCATION";
                    await sendDisplayLocationMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_DISPLAY_LOCATION") {
                    state.location = text;
                    state.step = "WAITING_FOR_DISPLAY_SUBMIT";
                    await sendDisplaySummaryMessage(from, state);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_DISPLAY_SUBMIT") {
                    if (text === "btn_display_submit") {
                        const name = state.name || "Customer";
                        delete userStates[from];
                        await sendSubmissionConfirmationMessage(from, name, "product catalogue", "PE");
                    } else if (text === "btn_display_edit") {
                        state.step = "WAITING_FOR_DISPLAY_EDIT_SELECTION";
                        await sendDisplayEditMenuMessage(from);
                    } else if (text === "btn_start_over") {
                        delete userStates[from];
                        await sendWelcomeMessage(from);
                    }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_DISPLAY_EDIT_SELECTION") {
                    if (text === "edit_display_size") { state.step = "WAITING_FOR_CORRECTED_DISPLAY_SIZE"; await sendDisplayCorrectedMessage(from, "display screen size"); }
                    else if (text === "edit_display_name") { state.step = "WAITING_FOR_CORRECTED_DISPLAY_NAME"; await sendDisplayCorrectedMessage(from, "full name"); }
                    else if (text === "edit_display_company") { state.step = "WAITING_FOR_CORRECTED_DISPLAY_COMPANY"; await sendDisplayCorrectedMessage(from, "company name"); }
                    else if (text === "edit_display_phone") { state.step = "WAITING_FOR_CORRECTED_DISPLAY_PHONE"; await sendDisplayCorrectedMessage(from, "contact number"); }
                    else if (text === "edit_display_email") { state.step = "WAITING_FOR_CORRECTED_DISPLAY_EMAIL"; await sendDisplayCorrectedMessage(from, "business email"); }
                    else if (text === "edit_display_location") { state.step = "WAITING_FOR_CORRECTED_DISPLAY_LOCATION"; await sendDisplayCorrectedMessage(from, "location"); }
                    else if (text === "edit_display_back") { state.step = "WAITING_FOR_DISPLAY_SUBMIT"; await sendDisplaySummaryMessage(from, state); }
                    return res.sendStatus(200);
                }
                
                if (state.step === "WAITING_FOR_CORRECTED_DISPLAY_SIZE") { state.displaySize = text; state.step = "WAITING_FOR_DISPLAY_SUBMIT"; await sendDisplaySummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_DISPLAY_NAME") { state.name = text; state.step = "WAITING_FOR_DISPLAY_SUBMIT"; await sendDisplaySummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_DISPLAY_COMPANY") { state.company = text; state.step = "WAITING_FOR_DISPLAY_SUBMIT"; await sendDisplaySummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_DISPLAY_PHONE") { state.phone = text; state.step = "WAITING_FOR_DISPLAY_SUBMIT"; await sendDisplaySummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_DISPLAY_EMAIL") { state.email = text; state.step = "WAITING_FOR_DISPLAY_SUBMIT"; await sendDisplaySummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_DISPLAY_LOCATION") { state.location = text; state.step = "WAITING_FOR_DISPLAY_SUBMIT"; await sendDisplaySummaryMessage(from, state, true); return res.sendStatus(200); }
                // --- End Wholesale Display Flow ---

                // --- Wholesale Cables Flow ---
                if (state.step === "WAITING_FOR_CABLE_SIZE") {
                    state.cableSize = text;
                    state.step = "WAITING_FOR_CABLE_NAME";
                    await sendCableNameMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CABLE_NAME") {
                    state.name = text;
                    state.step = "WAITING_FOR_CABLE_COMPANY";
                    await sendCableCompanyNameMessage(from, state.name);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CABLE_COMPANY") {
                    state.company = text;
                    state.step = "WAITING_FOR_CABLE_PHONE";
                    await sendCablePhoneMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CABLE_PHONE") {
                    state.phone = text;
                    state.step = "WAITING_FOR_CABLE_EMAIL";
                    await sendCableEmailMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CABLE_EMAIL") {
                    state.email = text;
                    state.step = "WAITING_FOR_CABLE_LOCATION";
                    await sendCableLocationMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CABLE_LOCATION") {
                    state.location = text;
                    state.step = "WAITING_FOR_CABLE_SUBMIT";
                    await sendCableSummaryMessage(from, state);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CABLE_SUBMIT") {
                    if (text === "btn_cable_submit") {
                        const name = state.name || "Customer";
                        delete userStates[from];
                        await sendSubmissionConfirmationMessage(from, name, "product catalogue", "PE");
                    } else if (text === "btn_cable_edit") {
                        state.step = "WAITING_FOR_CABLE_EDIT_SELECTION";
                        await sendCableEditMenuMessage(from);
                    } else if (text === "btn_start_over") {
                        delete userStates[from];
                        await sendWelcomeMessage(from);
                    }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CABLE_EDIT_SELECTION") {
                    if (text === "edit_cable_size") { state.step = "WAITING_FOR_CORRECTED_CABLE_SIZE"; await sendCableCorrectedMessage(from, "requirements"); }
                    else if (text === "edit_cable_name") { state.step = "WAITING_FOR_CORRECTED_CABLE_NAME"; await sendCableCorrectedMessage(from, "full name"); }
                    else if (text === "edit_cable_company") { state.step = "WAITING_FOR_CORRECTED_CABLE_COMPANY"; await sendCableCorrectedMessage(from, "company name"); }
                    else if (text === "edit_cable_phone") { state.step = "WAITING_FOR_CORRECTED_CABLE_PHONE"; await sendCableCorrectedMessage(from, "contact number"); }
                    else if (text === "edit_cable_email") { state.step = "WAITING_FOR_CORRECTED_CABLE_EMAIL"; await sendCableCorrectedMessage(from, "business email"); }
                    else if (text === "edit_cable_location") { state.step = "WAITING_FOR_CORRECTED_CABLE_LOCATION"; await sendCableCorrectedMessage(from, "location"); }
                    else if (text === "edit_cable_back") { state.step = "WAITING_FOR_CABLE_SUBMIT"; await sendCableSummaryMessage(from, state); }
                    return res.sendStatus(200);
                }
                
                if (state.step === "WAITING_FOR_CORRECTED_CABLE_SIZE") { state.cableSize = text; state.step = "WAITING_FOR_CABLE_SUBMIT"; await sendCableSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_CABLE_NAME") { state.name = text; state.step = "WAITING_FOR_CABLE_SUBMIT"; await sendCableSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_CABLE_COMPANY") { state.company = text; state.step = "WAITING_FOR_CABLE_SUBMIT"; await sendCableSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_CABLE_PHONE") { state.phone = text; state.step = "WAITING_FOR_CABLE_SUBMIT"; await sendCableSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_CABLE_EMAIL") { state.email = text; state.step = "WAITING_FOR_CABLE_SUBMIT"; await sendCableSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_CABLE_LOCATION") { state.location = text; state.step = "WAITING_FOR_CABLE_SUBMIT"; await sendCableSummaryMessage(from, state, true); return res.sendStatus(200); }
                // --- End Wholesale Cables Flow ---

                if (state.step === "WAITING_FOR_PRODUCT_DETAILS_SUPPORT") {
                    state.productDetails = text;
                    state.step = "WAITING_FOR_SUBMIT_SUPPORT";
                    await sendSupportSummaryMessage(from, state);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_SUBMIT_SUPPORT") {
                    if (text === "btn_submit_request") {
                        const name = state.name || "Customer";
                        delete userStates[from];
                        await sendSubmissionConfirmationMessage(from, name, "customer support", "CS");
                    } else if (text === "btn_edit_details") {
                        state.step = "WAITING_FOR_EDIT_SELECTION_SUPPORT";
                        await sendSupportEditMenuMessage(from);
                    } else if (text === "btn_start_over") {
                        // Start over completely by returning to the main menu
                        delete userStates[from];
                        await sendWelcomeMessage(from);
                    }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_EDIT_SELECTION_SUPPORT") {
                    if (text === "edit_name") { state.step = "WAITING_FOR_CORRECTED_NAME_SUPPORT"; await sendSupportCorrectedMessage(from, "full name"); }
                    else if (text === "edit_email") { state.step = "WAITING_FOR_CORRECTED_EMAIL_SUPPORT"; await sendSupportCorrectedMessage(from, "email address"); }
                    else if (text === "edit_phone") { state.step = "WAITING_FOR_CORRECTED_PHONE_SUPPORT"; await sendSupportCorrectedMessage(from, "phone number"); }
                    else if (text === "edit_country") { state.step = "WAITING_FOR_CORRECTED_COUNTRY_SUPPORT"; await sendSupportCorrectedMessage(from, "country"); }
                    else if (text === "edit_city") { state.step = "WAITING_FOR_CORRECTED_CITY_SUPPORT"; await sendSupportCorrectedMessage(from, "city"); }
                    else if (text === "edit_issue") { state.step = "WAITING_FOR_CORRECTED_ISSUE_SUPPORT"; await sendSupportCorrectedMessage(from, "issue details"); }
                    else if (text === "edit_back") { state.step = "WAITING_FOR_SUBMIT_SUPPORT"; await sendSupportSummaryMessage(from, state); }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_CORRECTED_NAME_SUPPORT") { state.name = text; state.step = "WAITING_FOR_SUBMIT_SUPPORT"; await sendSupportSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_EMAIL_SUPPORT") { state.email = text; state.step = "WAITING_FOR_SUBMIT_SUPPORT"; await sendSupportSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_PHONE_SUPPORT") { state.phone = text; state.step = "WAITING_FOR_SUBMIT_SUPPORT"; await sendSupportSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_COUNTRY_SUPPORT") { state.country = text; state.step = "WAITING_FOR_SUBMIT_SUPPORT"; await sendSupportSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_CITY_SUPPORT") { state.city = text; state.step = "WAITING_FOR_SUBMIT_SUPPORT"; await sendSupportSummaryMessage(from, state, true); return res.sendStatus(200); }
                if (state.step === "WAITING_FOR_CORRECTED_ISSUE_SUPPORT") { state.productDetails = text; state.step = "WAITING_FOR_SUBMIT_SUPPORT"; await sendSupportSummaryMessage(from, state, true); return res.sendStatus(200); }

                if (state.step === "WAITING_FOR_TV_SIZE") {
                    if (text === "btn_tv_upto_65") state.tvSize = "Upto 65 inches";
                    else if (text === "btn_tv_65_to_75") state.tvSize = "65-75 inches";
                    else if (text === "btn_tv_above_75") state.tvSize = "Above 75 inches";
                    else state.tvSize = text;
                    
                    if (state.tvSize) {
                        state.step = "WAITING_FOR_INSTALL_NAME";
                        await sendInstallNameMessage(from);
                        return res.sendStatus(200);
                    }
                }
                
                if (state.step === "WAITING_FOR_SITE_DESCRIPTION") {
                    state.siteDescription = text;
                    state.step = "WAITING_FOR_INSTALL_NAME";
                    await sendInstallNameMessage(from);
                    return res.sendStatus(200);
                }
                
                if (state.step === "WAITING_FOR_INSTALL_NAME") {
                    state.name = text;
                    state.step = "WAITING_FOR_INSTALL_PHONE";
                    await sendInstallPhoneMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_INSTALL_PHONE") {
                    state.phone = text;
                    state.step = "WAITING_FOR_INSTALL_DATE";
                    await sendInstallDateMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_INSTALL_DATE") {
                    if (text === "btn_date_today") {
                        const today = new Date();
                        const options = { month: 'short', day: 'numeric' };
                        state.date = `Today, ${today.toLocaleDateString('en-US', options)}`;
                        state.step = "WAITING_FOR_INSTALL_TIME";
                        await sendInstallTimeMessage(from);
                    } else if (text === "btn_date_tomorrow") {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const options = { month: 'short', day: 'numeric' };
                        state.date = `Tomorrow, ${tomorrow.toLocaleDateString('en-US', options)}`;
                        state.step = "WAITING_FOR_INSTALL_TIME";
                        await sendInstallTimeMessage(from);
                    } else if (text === "btn_date_other") {
                        state.step = "WAITING_FOR_INSTALL_CUSTOM_DATE";
                        await sendInstallCustomDateMessage(from);
                    } else {
                        state.date = text;
                        state.step = "WAITING_FOR_INSTALL_TIME";
                        await sendInstallTimeMessage(from);
                    }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_INSTALL_CUSTOM_DATE") {
                    state.date = text;
                    state.step = "WAITING_FOR_INSTALL_TIME";
                    await sendInstallTimeMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_INSTALL_TIME") {
                    if (text === "btn_time_morning") state.time = "Morning, 8am–12pm";
                    else if (text === "btn_time_afternoon") state.time = "Afternoon, 12pm–5pm";
                    else if (text === "btn_time_evening") state.time = "Evening, 5pm–8pm";
                    else state.time = text;

                    if (state.serviceType === "TV Installation" || state.serviceType === "Commercial TV Install") {
                        state.step = "WAITING_FOR_INSTALL_BRACKET";
                        await sendInstallBracketMessage(from);
                    } else {
                        state.step = "WAITING_FOR_INSTALL_LOCATION";
                        await sendInstallLocationMessage(from);
                    }
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_INSTALL_BRACKET") {
                    if (text === "btn_bracket_yes") state.bracket = "Yes";
                    else if (text === "btn_bracket_no") state.bracket = "No";
                    else state.bracket = text;

                    state.step = "WAITING_FOR_INSTALL_LOCATION";
                    await sendInstallLocationMessage(from);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_INSTALL_LOCATION") {
                    state.location = text;
                    state.step = "WAITING_FOR_INSTALL_SUBMIT";
                    await sendInstallSummaryMessage(from, state);
                    return res.sendStatus(200);
                }

                if (state.step === "WAITING_FOR_INSTALL_SUBMIT") {
                    if (text === "btn_install_submit") {
                        const name = state.name || "Customer";
                        delete userStates[from];
                        await sendSubmissionConfirmationMessage(from, name, "installation", "IN");
                    } else if (text === "btn_install_edit") {
                        state.step = "WAITING_FOR_INSTALL_EDIT_SELECTION";
                        await sendInstallEditMenuMessage(from);
                    } else if (text === "btn_start_over") {
                        delete userStates[from];
                        await sendWelcomeMessage(from);
                    }
                    return res.sendStatus(200);
                }

            }

            if (userStates[from]?.step === "WAITING_FOR_INSTALL_EDIT_SELECTION") {
                const state = userStates[from];
                if (text === "edit_install_name") { state.step = "WAITING_FOR_CORRECTED_INSTALL_NAME"; await sendInstallCorrectedMessage(from, "full name"); }
                else if (text === "edit_install_phone") { state.step = "WAITING_FOR_CORRECTED_INSTALL_PHONE"; await sendInstallCorrectedMessage(from, "phone number"); }
                else if (text === "edit_install_date") { state.step = "WAITING_FOR_CORRECTED_INSTALL_DATE"; await sendInstallDateMessage(from, true); }
                else if (text === "edit_install_time") { state.step = "WAITING_FOR_CORRECTED_INSTALL_TIME"; await sendInstallTimeMessage(from, true); }
                else if (text === "edit_install_bracket") { state.step = "WAITING_FOR_CORRECTED_INSTALL_BRACKET"; await sendInstallBracketMessage(from, true); }
                else if (text === "edit_install_location") { state.step = "WAITING_FOR_CORRECTED_INSTALL_LOCATION"; await sendInstallCorrectedMessage(from, "location"); }
                else if (text === "edit_install_back") { state.step = "WAITING_FOR_INSTALL_SUBMIT"; await sendInstallSummaryMessage(from, state); }
                return res.sendStatus(200);
            }

            if (userStates[from]?.step === "WAITING_FOR_CORRECTED_INSTALL_NAME") { userStates[from].name = text; userStates[from].step = "WAITING_FOR_INSTALL_SUBMIT"; await sendInstallSummaryMessage(from, userStates[from], true); return res.sendStatus(200); }
            if (userStates[from]?.step === "WAITING_FOR_CORRECTED_INSTALL_PHONE") { userStates[from].phone = text; userStates[from].step = "WAITING_FOR_INSTALL_SUBMIT"; await sendInstallSummaryMessage(from, userStates[from], true); return res.sendStatus(200); }
            
            if (userStates[from]?.step === "WAITING_FOR_CORRECTED_INSTALL_DATE") { 
                if (text === "btn_date_today") {
                    const today = new Date();
                    const options = { month: 'short', day: 'numeric' };
                    userStates[from].date = `Today, ${today.toLocaleDateString('en-US', options)}`;
                } else if (text === "btn_date_tomorrow") {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const options = { month: 'short', day: 'numeric' };
                    userStates[from].date = `Tomorrow, ${tomorrow.toLocaleDateString('en-US', options)}`;
                } else if (text === "btn_date_other") {
                    userStates[from].step = "WAITING_FOR_CORRECTED_INSTALL_CUSTOM_DATE";
                    await sendInstallCustomDateMessage(from);
                    return res.sendStatus(200);
                } else {
                    userStates[from].date = text;
                }
                userStates[from].step = "WAITING_FOR_INSTALL_SUBMIT"; 
                await sendInstallSummaryMessage(from, userStates[from], true); 
                return res.sendStatus(200); 
            }

            if (userStates[from]?.step === "WAITING_FOR_CORRECTED_INSTALL_CUSTOM_DATE") { 
                userStates[from].date = text; 
                userStates[from].step = "WAITING_FOR_INSTALL_SUBMIT"; 
                await sendInstallSummaryMessage(from, userStates[from], true); 
                return res.sendStatus(200); 
            }

            if (userStates[from]?.step === "WAITING_FOR_CORRECTED_INSTALL_TIME") { 
                if (text === "btn_time_morning") userStates[from].time = "Morning, 8am–12pm";
                else if (text === "btn_time_afternoon") userStates[from].time = "Afternoon, 12pm–5pm";
                else if (text === "btn_time_evening") userStates[from].time = "Evening, 5pm–8pm";
                else userStates[from].time = text; 
                userStates[from].step = "WAITING_FOR_INSTALL_SUBMIT"; 
                await sendInstallSummaryMessage(from, userStates[from], true); 
                return res.sendStatus(200); 
            }
            
            if (userStates[from]?.step === "WAITING_FOR_CORRECTED_INSTALL_BRACKET") { 
                if (text === "btn_bracket_yes") userStates[from].bracket = "Yes";
                else if (text === "btn_bracket_no") userStates[from].bracket = "No";
                else userStates[from].bracket = text; 
                userStates[from].step = "WAITING_FOR_INSTALL_SUBMIT"; 
                await sendInstallSummaryMessage(from, userStates[from], true); 
                return res.sendStatus(200); 
            }
            if (userStates[from]?.step === "WAITING_FOR_CORRECTED_INSTALL_LOCATION") { userStates[from].location = text; userStates[from].step = "WAITING_FOR_INSTALL_SUBMIT"; await sendInstallSummaryMessage(from, userStates[from], true); return res.sendStatus(200); }

            if (text.toLowerCase() === "hi" || text === "btn_start_new") {
                await sendWelcomeMessage(from);
            } else if (text === "btn_talk_sales") {
                await sendWelcomeMessage(from); // Redirect to welcome for now, or handle sales
            } else if (text === "btn_products") {
                await sendProductsMessage(from);
            } else if (text === "btn_retail") {
                userStates[from] = { customerType: "Retail" };
                await sendRetailCategories(from);
            } else if (text === "btn_wholesale") {
                userStates[from] = { customerType: "Wholesale" };
                await sendWholesaleCategories(from);
            } else if (text === "btn_mounts") {
                await sendMountingSolutions(from);
            } else if (text === "btn_displays") {
                await sendDisplaysMessage(from);
            } else if (text === "btn_cables") {
                await sendCablesMessage(from);
            } else if (text === "btn_install") {
                await sendInstallationMessage(from);
            } else if (text === "btn_support") {
                userStates[from] = { step: "WAITING_FOR_NAME_SUPPORT" };
                await sendSupportMessage(from);
            } else if (text === "btn_install_consumer") {
                userStates[from] = { step: "WAITING_FOR_SERVICE", customerType: "Consumer" };
                await sendInstallationServicesMessage(from);
            } else if (text === "btn_install_corporate") {
                userStates[from] = { step: "WAITING_FOR_SERVICE", customerType: "Corporate" };
                await sendCorporateServicesMessage(from);
            } else if (text === "btn_install_tv") {
                if (!userStates[from]) userStates[from] = { customerType: "Unknown" };
                userStates[from].serviceType = "TV Installation";
                userStates[from].step = "WAITING_FOR_TV_SIZE";
                await sendTVSizeMessage(from);
            } else if (text === "btn_corp_tv") {
                if (!userStates[from]) userStates[from] = { customerType: "Corporate" };
                userStates[from].serviceType = "Commercial TV Install";
                userStates[from].step = "WAITING_FOR_TV_SIZE";
                await sendTVSizeMessage(from);
            } else if (text === "btn_corp_led" || text === "btn_corp_av" || text === "btn_corp_cctv") {
                if (!userStates[from]) userStates[from] = { customerType: "Corporate" };
                
                if (text === "btn_corp_led") userStates[from].serviceType = "LED / Video Wall Installation";
                if (text === "btn_corp_av") userStates[from].serviceType = "Meeting Room AV Setup";
                if (text === "btn_corp_cctv") userStates[from].serviceType = "CCTV Installation";
                
                userStates[from].step = "WAITING_FOR_SITE_DESCRIPTION";
                await sendSiteDescriptionMessage(from);
            } else if (text === "mount_tv_display") {
                userStates[from] = { step: "WAITING_FOR_MOUNT_TYPE" };
                await sendMountTypeMessage(from);
            } else if (["mount_tv_ceiling", "mount_monitor", "mount_motorized", "mount_tv_floor", "mount_other"].includes(text)) {
                userStates[from] = { step: "WAITING_FOR_MOUNT_TV_SIZE" };
                if (text === "mount_tv_ceiling") userStates[from].mountType = "TV Ceiling Mount";
                if (text === "mount_monitor") userStates[from].mountType = "Monitor & Desktop Mount";
                if (text === "mount_motorized") userStates[from].mountType = "Motorized Mount";
                if (text === "mount_tv_floor") userStates[from].mountType = "TV Floor Stand";
                if (text === "mount_other") userStates[from].mountType = "Other Mounting Solution";
                await sendMountTvSizeMessage(from);
            } else if (["display_led", "display_interactive", "display_videowall", "display_signage", "display_other"].includes(text)) {
                userStates[from] = { step: "WAITING_FOR_DISPLAY_SIZE" };
                if (text === "display_led") userStates[from].displayType = "LED Display Solution";
                if (text === "display_interactive") userStates[from].displayType = "Interactive Display";
                if (text === "display_videowall") userStates[from].displayType = "Video Wall";
                if (text === "display_signage") userStates[from].displayType = "Digital Signage";
                if (text === "display_other") userStates[from].displayType = "Other Display";
                await sendDisplaySizeMessage(from);
            } else if (["cable_hdmi", "cable_av", "cable_electrical", "cable_adapters", "cable_other"].includes(text)) {
                userStates[from] = { step: "WAITING_FOR_CABLE_SIZE" };
                if (text === "cable_hdmi") userStates[from].cableType = "HDMI Cables";
                if (text === "cable_av") userStates[from].cableType = "AV & Data Cables";
                if (text === "cable_electrical") userStates[from].cableType = "Electrical Wires";
                if (text === "cable_adapters") userStates[from].cableType = "Adapters & Accessories";
                if (text === "cable_other") userStates[from].cableType = "Other Cable";
                await sendCableSizeMessage(from);
            }
        }

    } catch (err) {
        console.error(err);
    }

    res.sendStatus(200);
});
module.exports = router;