// =========================================================
// CONCEPTO INK
// TATTOO SERVICES JAVASCRIPT
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const WHATSAPP_NUMBER = "27835319734";


    // =====================================================
    // SERVICE TABS
    // =====================================================

    const tabs = document.querySelectorAll("[data-service-tab]");
    const panels = document.querySelectorAll("[data-service-panel]");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            const target = tab.dataset.serviceTab;

            tabs.forEach(item => {
                item.classList.remove("active");
            });

            panels.forEach(panel => {
                panel.classList.remove("active");
            });

            tab.classList.add("active");

            const targetPanel = document.querySelector(
                `[data-service-panel="${target}"]`
            );

            if (targetPanel) {
                targetPanel.classList.add("active");
            }

        });

    });


    // =====================================================
    // WHATSAPP BOOKING
    // =====================================================

    const bookingButtons = document.querySelectorAll(
        "[data-booking]"
    );


    bookingButtons.forEach(button => {

        button.addEventListener("click", () => {

            const service = button.dataset.booking;

            const message =
                `Hi Concepto Ink! 👋%0A%0A` +
                `I would like to enquire about booking:%0A` +
                `*${service}*%0A%0A` +
                `Please let me know the available dates and ` +
                `any information I need to provide. Thank you!`;

            const whatsappURL =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        });

    });


    // =====================================================
    // WHATSAPP CTA
    // =====================================================

    const whatsappCTA = document.querySelector(
        ".services-whatsapp"
    );


    if (whatsappCTA) {

        whatsappCTA.addEventListener("click", () => {

            const message =
                `Hi Concepto Ink! 👋%0A%0A` +
                `I would like to enquire about booking ` +
                `a tattoo or piercing.%0A%0A` +
                `Please let me know your available dates.`;

            whatsappCTA.href =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

        });

    }


    // =====================================================
    // CARD MOUSE TILT
    // =====================================================

    const cards = document.querySelectorAll(
        ".service-card"
    );


    cards.forEach(card => {

        card.addEventListener("mousemove", event => {

            if (window.innerWidth <= 700) {
                return;
            }

            const rect = card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -2.5;

            const rotateY =
                ((x - centerX) / centerX) * 2.5;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-9px)`;

        });


        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

});