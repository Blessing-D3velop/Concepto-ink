/* =========================================================
   CONCEPTO INK — HEADER JAVASCRIPT
========================================================= */

(function () {
    "use strict";

    var header = document.getElementById("siteHeader");
    var hamburger = document.getElementById("hamburger");
    var mobileNav = document.getElementById("mobileNav");

    function handleHeaderScroll() {
        if (!header) return;
        if (window.scrollY > 0) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleHeaderScroll);
    handleHeaderScroll();

    if (hamburger && mobileNav) {
        hamburger.addEventListener("click", function () {
            var isOpen = hamburger.classList.toggle("active");
            mobileNav.classList.toggle("active");
            hamburger.setAttribute("aria-expanded", isOpen);
        });

        document.querySelectorAll(".mobile-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                hamburger.classList.remove("active");
                mobileNav.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            });
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 768) {
                hamburger.classList.remove("active");
                mobileNav.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Mark the current page's nav link active (desktop + mobile)
    var current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".desktop-nav a, .mobile-nav a").forEach(function (a) {
        var href = a.getAttribute("href");
        if (href === current) {
            a.classList.add("active");
        }
    });
})();
