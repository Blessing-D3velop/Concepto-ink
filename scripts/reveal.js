/* =========================================================
   CONCEPTO INK — SCROLL REVEAL ENGINE
   Any element with data-reveal="fade-up|fade-in|zoom-in|
   slide-left|slide-right|image" animates in once visible.
   Group children with data-reveal-group on the parent to
   auto-stagger them.
========================================================= */

(function () {
    "use strict";

    function initStaggers() {
        document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
            var children = group.querySelectorAll("[data-reveal]");
            children.forEach(function (child, i) {
                child.style.setProperty("--reveal-delay", (i * 110) + "ms");
            });
        });
    }

    function initReveal() {
        var items = document.querySelectorAll("[data-reveal]");
        if (!items.length) return;

        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("in-view"); });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
        );

        items.forEach(function (el) { observer.observe(el); });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initStaggers();
        initReveal();

        var main = document.querySelector("main");
        if (main) main.classList.add("page-enter");
    });
})();
