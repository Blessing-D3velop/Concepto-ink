/* =========================================================
   CONCEPTO INK — CARD TILT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    var cards = document.querySelectorAll(".service-trigger, .home-card");

    cards.forEach(function (card) {
        card.addEventListener("mousemove", function (event) {
            if (window.innerWidth <= 700) return;

            var rect = card.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            var rotateX = ((y - centerY) / centerY) * -2.5;
            var rotateY = ((x - centerX) / centerX) * 2.5;

            card.style.transform =
                "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-8px)";
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    });
});
