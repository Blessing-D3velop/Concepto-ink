/* =========================================================
   CONCEPTO INK
   TATTOO GALLERY LIGHTBOX
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.getElementById("tattooGallery");
    const lightbox = document.getElementById("tattooLightbox");
    const lightboxImage = document.getElementById("tattooLightboxImage");
    const counter = document.getElementById("tattooLightboxCounter");

    const closeButton = document.getElementById("tattooLightboxClose");
    const previousButton = document.getElementById("tattooLightboxPrev");
    const nextButton = document.getElementById("tattooLightboxNext");

    const backdrop = document.querySelector(
        ".tattoo-lightbox-backdrop"
    );


    if (
        !gallery ||
        !lightbox ||
        !lightboxImage ||
        !counter
    ) {
        return;
    }


    /* =====================================================
       GET ALL GALLERY IMAGES
    ===================================================== */

    const galleryItems = Array.from(
        gallery.querySelectorAll(
            "[data-gallery-image]"
        )
    );


    const totalImages = galleryItems.length;


    let currentIndex = 0;


    /* =====================================================
       UPDATE IMAGE
    ===================================================== */

    function updateLightbox(index) {

        if (!totalImages) {
            return;
        }


        /*
         * Loop back to the beginning
         */

        if (index < 0) {
            currentIndex = totalImages - 1;
        }

        else if (index >= totalImages) {
            currentIndex = 0;
        }

        else {
            currentIndex = index;
        }


        const currentItem =
            galleryItems[currentIndex];


        const image =
            currentItem.querySelector("img");


        const imageSource =
            currentItem.dataset.galleryImage ||
            image?.src;


        const imageAlt =
            image?.alt ||
            "Concepto Ink tattoo artwork";


        /*
         * Fade old image
         */

        lightboxImage.style.opacity = "0";


        setTimeout(() => {

            lightboxImage.src =
                imageSource;

            lightboxImage.alt =
                imageAlt;

            counter.textContent =
                `${currentIndex + 1} / ${totalImages}`;


            /*
             * Make sure image has loaded
             */

            lightboxImage.onload = () => {

                lightboxImage.style.opacity =
                    "1";

            };

        }, 120);

    }


    /* =====================================================
       OPEN LIGHTBOX
    ===================================================== */

    function openLightbox(index) {

        currentIndex = index;

        updateLightbox(currentIndex);


        lightbox.classList.add("active");

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Stop background scrolling
         */

        document.body.style.overflow =
            "hidden";


        /*
         * Focus close button
         */

        setTimeout(() => {

            closeButton?.focus();

        }, 100);

    }


    /* =====================================================
       CLOSE LIGHTBOX
    ===================================================== */

    function closeLightbox() {

        lightbox.classList.remove(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";


        /*
         * Clear image after animation
         */

        setTimeout(() => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                lightboxImage.src = "";

            }

        }, 400);

    }


    /* =====================================================
       NEXT IMAGE
    ===================================================== */

    function nextImage() {

        updateLightbox(
            currentIndex + 1
        );

    }


    /* =====================================================
       PREVIOUS IMAGE
    ===================================================== */

    function previousImage() {

        updateLightbox(
            currentIndex - 1
        );

    }


    /* =====================================================
       CLICK GALLERY IMAGES
    ===================================================== */

    galleryItems.forEach(
        (item, index) => {

            item.addEventListener(
                "click",
                () => {

                    openLightbox(index);

                }
            );

        }
    );


    /* =====================================================
       BUTTON EVENTS
    ===================================================== */

    closeButton?.addEventListener(
        "click",
        closeLightbox
    );


    nextButton?.addEventListener(
        "click",
        nextImage
    );


    previousButton?.addEventListener(
        "click",
        previousImage
    );


    /* =====================================================
       BACKDROP CLOSE
    ===================================================== */

    backdrop?.addEventListener(
        "click",
        closeLightbox
    );


    /* =====================================================
       KEYBOARD CONTROLS
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {
                return;
            }


            if (event.key === "Escape") {

                closeLightbox();

            }


            if (event.key === "ArrowRight") {

                nextImage();

            }


            if (event.key === "ArrowLeft") {

                previousImage();

            }

        }
    );


    /* =====================================================
       TOUCH / SWIPE SUPPORT
    ===================================================== */

    let touchStartX = 0;
    let touchEndX = 0;


    lightbox.addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    lightbox.addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;


            const swipeDistance =
                touchEndX - touchStartX;


            /*
             * Swipe left = next
             */

            if (swipeDistance < -50) {

                nextImage();

            }


            /*
             * Swipe right = previous
             */

            if (swipeDistance > 50) {

                previousImage();

            }

        },
        { passive: true }
    );


});