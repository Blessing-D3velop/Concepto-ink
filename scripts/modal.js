/* =========================================================
   CONCEPTO INK — SERVICE POPUP ENGINE
   [data-modal-open="modalId"] opens .service-modal#modalId
   [data-modal-close] or backdrop click or Escape closes it
   [data-booking] buttons inside a modal route to booking.html
   with the chosen service prefilled via query string.
========================================================= */

(function () {
    "use strict";

    var openModal = null;

    function lockScroll() { document.body.classList.add("service-modal-open"); }
    function unlockScroll() { document.body.classList.remove("service-modal-open"); }

    function open(id) {
        var modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        lockScroll();
        openModal = modal;
        var closeBtn = modal.querySelector(".service-modal-close");
        if (closeBtn) closeBtn.focus();
    }

    function close(modal) {
        if (!modal) return;
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        unlockScroll();
        openModal = null;
    }

    document.addEventListener("click", function (e) {
        var trigger = e.target.closest("[data-modal-open]");
        if (trigger) {
            e.preventDefault();
            open(trigger.getAttribute("data-modal-open"));
            return;
        }

        var closer = e.target.closest("[data-modal-close]");
        if (closer) {
            close(closer.closest(".service-modal"));
            return;
        }

        // click on the dark backdrop (not the panel) closes it
        if (e.target.classList && e.target.classList.contains("service-modal")) {
            close(e.target);
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && openModal) {
            close(openModal);
        }
    });

    // Route "Book This" buttons (inside modals or on standalone
    // piercing/price rows) to booking.html with the service and
    // theme prefilled.
    document.addEventListener("click", function (e) {
        var bookBtn = e.target.closest("[data-booking]");
        if (!bookBtn) return;

        var service = bookBtn.getAttribute("data-booking");
        var theme = document.body.classList.contains("theme-beauty") ? "beauty" : "tattoo";
        var url = "booking.html?service=" + encodeURIComponent(service) + "&type=" + theme;
        window.location.href = url;
    });
})();
