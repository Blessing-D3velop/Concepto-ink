
/* =========================================================
   CONCEPTO INK — BOOKING + PAYFAST
   LIVE PAYMENT INTEGRATION
   Supports www and non-www domains.
   Booking fee: R200.00
========================================================= */

var PAYFAST_CONFIG = {
    SANDBOX: false,
    PAYMENT_API: "/api/create-booking-payment",
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
        if (serviceLabel) {
            serviceLabel.textContent =
                "General enquiry — tell us what you're after below";
        }

        if (serviceField) {
            serviceField.value = "General enquiry";
        }
    }

    var typeField = document.getElementById("bookingTypeField");

    if (typeField) {
        typeField.value = type;
    }

    var form = document.getElementById("bookingForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        var firstName = document.getElementById("bookingFirstName").value.trim();
        var lastName = document.getElementById("bookingLastName").value.trim();
        var email = document.getElementById("bookingEmail").value.trim();
        var phone = document.getElementById("bookingPhone").value.trim();

        var chosenService = serviceField
            ? serviceField.value.trim()
            : service;

        var notes = document.getElementById("bookingNotes").value.trim();

        if (!firstName || !lastName || !email) {
            alert("Please complete your name and email address.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        var paymentButton = form.querySelector(
            'button[type="submit"], input[type="submit"]'
        );

        var originalButtonText = "";

        if (paymentButton) {
            originalButtonText = paymentButton.tagName === "INPUT"
                ? paymentButton.value
                : paymentButton.textContent;

            paymentButton.disabled = true;

            if (paymentButton.tagName === "INPUT") {
                paymentButton.value = "Connecting to PayFast...";
            } else {
                paymentButton.textContent = "Connecting to PayFast...";
            }
        }

        try {

            var response = await fetch(PAYFAST_CONFIG.PAYMENT_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: phone,
                    service: chosenService,
                    notes: notes,
                    booking_type: type
                })
            });

            var result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || "Unable to prepare your payment."
                );
            }

            var payfastForm = document.createElement("form");

            payfastForm.method = "POST";

            payfastForm.action = PAYFAST_CONFIG.SANDBOX
                ? "https://sandbox.payfast.co.za/eng/process"
                : "https://www.payfast.co.za/eng/process";

            Object.keys(result.fields).forEach(function (key) {

                var input = document.createElement("input");

                input.type = "hidden";
                input.name = key;
                input.value = result.fields[key];

                payfastForm.appendChild(input);

            });

            document.body.appendChild(payfastForm);
            payfastForm.submit();

        } catch (error) {

            console.error("Concepto Ink payment error:", error);

            alert(
                error.message ||
                "Payment could not be prepared. Please try again."
            );

            if (paymentButton) {
                paymentButton.disabled = false;

                if (paymentButton.tagName === "INPUT") {
                    paymentButton.value = originalButtonText;
                } else {
                    paymentButton.textContent = originalButtonText;
                }
            }

        }

    });

    // WhatsApp fallback.
    var waLink = document.getElementById("bookingWhatsappLink");

    if (waLink) {

        waLink.addEventListener("click", function () {

            var chosenService = serviceField
                ? serviceField.value
                : service;

            var name = (
                document.getElementById("bookingFirstName").value || ""
            ).trim();

            var message =
                "Hi Concepto Ink! 👋\n\n" +
                "I'd like to enquire about booking:\n" +
                chosenService + "\n\n" +
                (name ? "My name is " + name + ".\n" : "") +
                "Please let me know the available dates and how the R200 booking fee works. Thank you!";

            waLink.href =
                "https://wa.me/" +
                PAYFAST_CONFIG.WHATSAPP_NUMBER +
                "?text=" +
                encodeURIComponent(message);

        });

    }

});
