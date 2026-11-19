
const crypto = require("crypto");

const SITE_ORIGIN = "https://www.concepto-ink.com";

function phpUrlEncode(value) {
    return encodeURIComponent(String(value).trim())
        .replace(/[!'()~]/g, function (char) {
            return "%" + char.charCodeAt(0).toString(16).toUpperCase();
        })
        .replace(/\*/g, "*")
        .replace(/%[0-9a-f]{2}/gi, function (match) {
            return match.toUpperCase();
        })
        .replace(/%20/g, "+");
}

function generateSignature(data, passphrase) {

    const parameterString = Object.keys(data)
        .filter(key => data[key] !== "")
        .map(key => key + "=" + phpUrlEncode(data[key]))
        .join("&");

    const signatureString = passphrase
        ? parameterString + "&passphrase=" + phpUrlEncode(passphrase)
        : parameterString;

    return crypto
        .createHash("md5")
        .update(signatureString)
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

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    if (!merchantId || !merchantKey) {
        return res.status(500).json({
            success: false,
            error: "PayFast merchant credentials are not configured."
        });
    }

    if (!/^\d{8}$/.test(merchantId.trim())) {
        return res.status(500).json({
            success: false,
            error: "Invalid PayFast Merchant ID configuration."
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

        const service = String(body.service || "General enquiry")
            .trim();

        const notes = String(body.notes || "").trim();

        if (!firstName || !lastName || !email || !phone) {
            return res.status(400).json({
                success: false,
                error: "Please complete all required booking fields."
            });
        }

        if (
            firstName.length > 100 ||
            lastName.length > 100 ||
            email.length > 100 ||
            phone.length > 100
        ) {
            return res.status(400).json({
                success: false,
                error: "One or more customer fields are too long."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email address."
            });
        }

        if (service.length > 255 || notes.length > 255) {
            return res.status(400).json({
                success: false,
                error: "Booking information is too long."
            });
        }

        const paymentId = "CI-" + crypto.randomUUID();

        const itemDescription = (
            service +
            (notes ? " | Notes: " + notes : "") +
            " | Cell: " + phone
        ).slice(0, 255);

        // Keep fields in PayFast's documented custom
        // integration signature order.
        const fields = {

            merchant_id: merchantId.trim(),

            merchant_key: merchantKey.trim(),

            return_url:
                SITE_ORIGIN + "/booking-success.html",

            cancel_url:
                SITE_ORIGIN + "/booking.html",

            name_first: firstName,

            name_last: lastName,

            email_address: email,

            cell_number: phone,

            m_payment_id: paymentId,

            amount: "200.00",

            item_name: "Concepto Ink Booking Fee",

            item_description: itemDescription

        };

        // Generate the signature using the merchant
        // passphrase stored securely in Vercel.
        fields.signature = generateSignature(
            fields,
            passphrase
        );

        return res.status(200).json({
            success: true,
            fields: fields
        });

    } catch (error) {

        console.error("PayFast payment preparation error:", error);

        return res.status(500).json({
            success: false,
            error: "Unable to prepare your PayFast payment."
        });

    }

};
