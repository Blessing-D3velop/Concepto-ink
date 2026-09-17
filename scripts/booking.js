/* =========================================================
   CONCEPTO INK — BOOKING + PAYFAST
   ---------------------------------------------------------
   Currently running in SANDBOX mode. The client's live
   PayFast account (16965295) is still going through document
   verification — PayFast returns a 400 "merchant account not
   able to receive payments" until that's approved.

   Your integration itself is confirmed correct (PayFast
   recognized the Merchant ID and got as far as checking
   account status, which only happens once the request is
   valid). Nothing to fix here — just waiting on PayFast.

   TO GO LIVE ONCE VERIFIED: swap the two blocks below —
   comment out SANDBOX CONFIG, uncomment LIVE CONFIG.
========================================================= */

// ---- LIVE CONFIG (client's real PayFast account) ----
// Uncomment this block and comment out SANDBOX CONFIG below
// once PayFast confirms document verification is complete.
//
// var PAYFAST_CONFIG = {
//     SANDBOX: false,
//     MERCHANT_ID: "16965295",
//     MERCHANT_KEY: "xjajknapajdjk",
//     RETURN_URL: "https://concepto-ink.vercel.app/booking-success.html",
//     CANCEL_URL: "https://concepto-ink.vercel.app/booking.html",
//     NOTIFY_URL: "https://concepto-ink.vercel.app/booking-notify.php",
//     BOOKING_FEE: "200.00",
//     WHATSAPP_NUMBER: "27835319734"
// };

// ---- SANDBOX CONFIG (active now — safe to test, no real money) ----
var PAYFAST_CONFIG = {
    SANDBOX: true,

    MERCHANT_ID: "16965295",       // PayFast's public sandbox test ID
    MERCHANT_KEY: "xjajknapajdjk", // PayFast's public sandbox test key

    RETURN_URL: "https://concepto-ink.vercel.app/booking-success.html",
    CANCEL_URL: "https://concepto-ink.vercel.app/booking.html",

    // ⚠️ NOT YET FUNCTIONAL: this site is static hosting (Vercel),
    // so there's no server here to receive PayFast's ITN
    // (Instant Transaction Notification) POST. PayFast will still
    // try to call this URL after every payment and will just get
    // a 404 — that does NOT stop the payment or the customer's
    // redirect back to booking-success.html, but it does mean
    // there's no automatic server-side "payment confirmed" record.
    // Fix later with a small Vercel serverless function at
    // /api/booking-notify (Vercel supports Node functions natively —
    // ask if you want this built), then point this at:
    // "https://concepto-ink.vercel.app/api/booking-notify"
    NOTIFY_URL: "https://concepto-ink.vercel.app/booking-notify.php",

    BOOKING_FEE: "200.00",
    WHATSAPP_NUMBER: "27835319734"
};

document.addEventListener("DOMContentLoaded", function () {

    var params = new URLSearchParams(window.location.search);
    var service = params.get("service") || "";
    var type = params.get("type") || "tattoo";

    if (type === "beauty") {
        document.body.classList.add("theme-beauty");
    }

    var serviceLabel = document.getElementById("bookingServiceLabel");
    var serviceField = document.getElementById("bookingServiceField");

    if (service) {
        if (serviceLabel) serviceLabel.textContent = service;
        if (serviceField) serviceField.value = service;
    } else {
        if (serviceLabel) serviceLabel.textContent = "General enquiry — tell us what you're after below";
        if (serviceField) serviceField.value = "General enquiry";
    }

    var typeField = document.getElementById("bookingTypeField");
    if (typeField) typeField.value = type;

    var form = document.getElementById("bookingForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var firstName = document.getElementById("bookingFirstName").value.trim();
        var lastName = document.getElementById("bookingLastName").value.trim();
        var email = document.getElementById("bookingEmail").value.trim();
        var phone = document.getElementById("bookingPhone").value.trim();
        var chosenService = serviceField ? serviceField.value : service;
        var notes = document.getElementById("bookingNotes").value.trim();

        var paymentId = "CI-" + Date.now();

        var itemDescription = chosenService + (notes ? " | Notes: " + notes : "") + (phone ? " | Cell: " + phone : "");

        var payfastUrl = PAYFAST_CONFIG.SANDBOX
            ? "https://sandbox.payfast.co.za/eng/process"
            : "https://www.payfast.co.za/eng/process";

        var fields = {
            merchant_id: PAYFAST_CONFIG.MERCHANT_ID,
            merchant_key: PAYFAST_CONFIG.MERCHANT_KEY,
            return_url: PAYFAST_CONFIG.RETURN_URL,
            cancel_url: PAYFAST_CONFIG.CANCEL_URL,
            notify_url: PAYFAST_CONFIG.NOTIFY_URL,

            name_first: firstName,
            name_last: lastName,
            email_address: email,
            cell_number: phone,

            m_payment_id: paymentId,
            amount: PAYFAST_CONFIG.BOOKING_FEE,
            item_name: "Concepto Ink Booking Fee",
            item_description: itemDescription.slice(0, 255)
        };

        var payfastForm = document.createElement("form");
        payfastForm.method = "POST";
        payfastForm.action = payfastUrl;

        Object.keys(fields).forEach(function (key) {
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = fields[key];
            payfastForm.appendChild(input);
        });

        document.body.appendChild(payfastForm);
        payfastForm.submit();
    });

    // WhatsApp fallback link — pulls in whatever the person has
    // typed so far, so it's useful even before they submit.
    var waLink = document.getElementById("bookingWhatsappLink");
    if (waLink) {
        waLink.addEventListener("click", function (e) {
            var chosenService = serviceField ? serviceField.value : service;
            var name = (document.getElementById("bookingFirstName").value || "").trim();

            var message =
                "Hi Concepto Ink! 👋%0A%0A" +
                "I'd like to enquire about booking:%0A*" + encodeURIComponent(chosenService) + "*%0A%0A" +
                (name ? "My name is " + encodeURIComponent(name) + ".%0A" : "") +
                "Please let me know the available dates and how the R200 booking fee works. Thank you!";

            waLink.href = "https://wa.me/" + PAYFAST_CONFIG.WHATSAPP_NUMBER + "?text=" + message;
        });
    }
});
