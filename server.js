require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const webhook = require("./routes/webhook");
app.use("/webhook", webhook);

const { sendWelcomeMessage } = require("./services/whatsapp");

// Home route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Test route
app.get("/test", async (req, res) => {
    try {
        await sendWelcomeMessage("918590301089");
        res.send("Message sent successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to send message");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});