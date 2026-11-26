
/* =========================================================
   CONCEPTO INK — PAYFAST SERVERLESS PAYMENT API
   Vercel Node.js Function
   Supports www and non-www domains.
========================================================= */

const crypto = require("crypto");

const ALLOWED_ORIGINS = [
    "https://concepto-ink.com",
    "https://www.concepto-ink.com",
    "https://conceptoink.co.za",
    "https://www.conceptoink.co.za"
];

// PayFast uses PHP-style URL encoding.
function payfastEncode(value) {
    return encodeURIComponent(String(value).trim())
        .replace(/[!'()*~]/g, function (char) {
            return "%" + char.charCodeAt(0)
                .toString(16)
                .toUpperCase();
        })
        .replace(/%20/g, "+");
}

// Generate the official custom integration signature.
function generateSignature(data, passphrase) {

    let parameterString = "";

    Object.keys(data).forEach(function (key) {

        const value = data[key];

        if (value !== "" && value !== null && value !== undefined) {

            parameterString +=
                key + "=" + payfastEncode(value) + "&";

        }

    });

    parameterString = parameterString.slice(0, -1);

    if (passphrase) {
        parameterString +=
            "&passphrase=" + payfastEncode(passphrase);
    }

    return crypto
        .createHash("md5")
        .update(parameterString)
        .digest("hex");

}

module.exports = async function (req, res) {

    res.setHeader("Cache-Control", "no-store");

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed."
        });
    }

    // Only accept requests from the two Concepto Ink domains.
    const origin = req.headers.origin;

    if (!ALLOWED_ORIGINS.includes(origin)) {
        return res.status(403).json({
            success: false,
            error: "Unrecognized website domain."
        });
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    if (!merchantId || !merchantKey) {
        return res.status(500).json({
            success: false,
            error: "PayFast credentials are missing from Vercel."
        });
    }

    if (!/^\d{8}$/.test(merchantId.trim())) {
        return res.status(500).json({
            success: false,
            error: "Invalid PayFast Merchant ID."
        });
    }

    try {

        const body = typeof req.body === "string"
            ? JSON.parse(req.body)
            : req.body;

        const firstName = String(body.first_name || "").trim();
        const lastName = String(body.last_name || "").trim();
        const email = String(body.email || "").trim();
        const phone = String(body.phone || "").trim();

        const service = String(
            body.service || "General enquiry"
        ).trim();

        const notes = String(body.notes || "").trim();

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                error: "Please provide your name and email."
            });
        }

        if (
            firstName.length > 100 ||
            lastName.length > 100 ||
            email.length > 100 ||
            phone.length > 100 ||
            service.length > 255 ||
            notes.length > 255
        ) {
            return res.status(400).json({
                success: false,
                error: "One or more booking fields are too long."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email address."
            });
        }

        const paymentId = "CI-" + crypto.randomUUID();

        const itemDescription = (
            service +
            (notes ? " | Notes: " + notes : "") +
            (phone ? " | Cell: " + phone : "")
        ).slice(0, 255);

        // Use the domain the customer actually visited.
        const siteOrigin = origin;

        // Keep fields in PayFast's documented order.
        const fields = {

            merchant_id: merchantId.trim(),

            merchant_key: merchantKey.trim(),

            return_url:
                siteOrigin + "/booking-success.html",

            cancel_url:
                siteOrigin + "/booking.html",

            name_first: firstName,

            name_last: lastName,

            email_address: email,

            cell_number: phone,

            m_payment_id: paymentId,

            amount: "200.00",

            item_name: "Concepto Ink Booking Fee",

            item_description: itemDescription

        };

        // Generate the signature on the server.
        fields.signature = generateSignature(
            fields,
            passphrase
        );

        return res.status(200).json({
            success: true,
            fields: fields
        });

    } catch (error) {

        console.error(
            "Concepto Ink PayFast API error:",
            error
        );

        return res.status(500).json({
            success: false,
            error: "Unable to prepare your payment."
        });

    }

};
