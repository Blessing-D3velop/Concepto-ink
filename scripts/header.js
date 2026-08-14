
/* =========================================
   CONCEPTO INK
   HEADER JAVASCRIPT
========================================= */

const header = document.getElementById("siteHeader");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");


/* =========================================
   HEADER SCROLL EFFECT
========================================= */

function handleHeaderScroll() {

    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}


/* Run when scrolling */
window.addEventListener("scroll", handleHeaderScroll);


/* Run once when page loads */
handleHeaderScroll();


/* =========================================
   HAMBURGER MENU
========================================= */

hamburger.addEventListener("click", () => {

    const isOpen = hamburger.classList.toggle("active");

    mobileNav.classList.toggle("active");

    hamburger.setAttribute(
        "aria-expanded",
        isOpen
    );

});


/* =========================================
   CLOSE MOBILE MENU AFTER CLICKING LINK
========================================= */

const mobileLinks =
    document.querySelectorAll(".mobile-nav a");

mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        hamburger.classList.remove("active");

        mobileNav.classList.remove("active");

        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


/* =========================================
   CLOSE MENU WHEN RESIZING TO DESKTOP
========================================= */

window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {

        hamburger.classList.remove("active");

        mobileNav.classList.remove("active");

        hamburger.setAttribute(
            "aria-expanded",
            "false"
        );

    }

});

