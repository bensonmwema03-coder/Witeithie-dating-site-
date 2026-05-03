import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// M-Pesa Configuration
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE;
const passkey = process.env.MPESA_PASSKEY;
const callbackUrl = process.env.MPESA_CALLBACK_URL;

async function getMpesaToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("M-Pesa Token Error:", error);
    throw new Error("Failed to get M-Pesa token");
  }
}

// API Routes
app.post("/api/mpesa/stkpush", async (req, res) => {
  const { phoneNumber, amount, userId } = req.body;

  if (!phoneNumber || !amount || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Format phone number to 254...
  let formattedPhone = phoneNumber.replace(/^(?:\+254|0)/, "254");
  if (!formattedPhone.startsWith("254")) {
    formattedPhone = `254${formattedPhone}`;
  }

  try {
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: `Witeithie-${userId.slice(0, 5)}`,
        TransactionDesc: "Subscription Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate STK Push" });
  }
});

// Callback endpoint (Safaricom will POST here)
app.post("/api/mpesa/callback", (req, res) => {
  const callbackData = req.body;
  console.log("M-Pesa Callback Received:", JSON.stringify(callbackData, null, 2));
  
  // Note: In real production, you'd match CheckoutRequestID to the user 
  // and update their subscription status in Firestore here.
  // Since we can't easily perform Firestore writes from a regular server without firebase-admin
  // and this is a preview, we'd ideally use a Cloud Function or similar.
  // For now, we'll log it.
  
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
