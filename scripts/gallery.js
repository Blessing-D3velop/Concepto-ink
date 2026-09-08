/* =========================================================
   CONCEPTO INK — COMBINED GALLERY JS
   Filters the grid by category and powers the lightbox,
   which always cycles the full filtered set.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    var grid = document.getElementById("galleryGrid");
    var lightbox = document.getElementById("galleryLightbox");
    if (!grid || !lightbox) return;

    var filterButtons = document.querySelectorAll(".gallery-filter");
    var allItems = Array.from(grid.querySelectorAll(".gallery-item"));

    var lightboxImg = lightbox.querySelector(".gallery-lightbox-stage img");
    var counter = lightbox.querySelector(".gallery-counter");
    var closeBtn = lightbox.querySelector(".gallery-lightbox-close");
    var prevBtn = lightbox.querySelector(".gallery-lightbox-prev");
    var nextBtn = lightbox.querySelector(".gallery-lightbox-next");

    var visibleItems = allItems.slice();
    var currentIndex = 0;

    function applyFilter(category) {
        visibleItems = [];
        allItems.forEach(function (item, i) {
            var match = category === "all" || item.dataset.category === category;
            item.classList.toggle("hidden", !match);
            if (match) visibleItems.push(item);
        });
    }

    filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterButtons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            applyFilter(btn.dataset.filter);
        });
    });

    function show(index) {
        currentIndex = (index + visibleItems.length) % visibleItems.length;
        var img = visibleItems[currentIndex].querySelector("img");
        lightboxImg.style.opacity = "0";
        setTimeout(function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            counter.textContent = (currentIndex + 1) + " / " + visibleItems.length;
            lightboxImg.style.opacity = "1";
        }, 100);
    }

    function open(index) {
        show(index);
        lightbox.classList.add("active");
        document.body.classList.add("gallery-open");
    }

    function close() {
        lightbox.classList.remove("active");
        document.body.classList.remove("gallery-open");
    }

    grid.addEventListener("click", function (e) {
        var item = e.target.closest(".gallery-item");
        if (!item || item.classList.contains("hidden")) return;
        var index = visibleItems.indexOf(item);
        if (index === -1) return;
        open(index);
    });

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
    nextBtn.addEventListener("click", function () { show(currentIndex + 1); });

    lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(currentIndex - 1);
        if (e.key === "ArrowRight") show(currentIndex + 1);
    });

    // swipe support
    var touchStartX = 0;
    lightbox.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].screenX - touchStartX;
        if (dx < -50) show(currentIndex + 1);
        if (dx > 50) show(currentIndex - 1);
    }, { passive: true });
});
