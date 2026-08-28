const galleryItems = document.querySelectorAll(".gallery-item");
const galleryModal = document.getElementById("galleryModal");
const galleryModalImage = document.getElementById("galleryModalImage");
const galleryClose = document.getElementById("galleryClose");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const galleryCounter = document.getElementById("galleryCounter");

const galleryImages = Array.from(galleryItems).map(item =>
    item.querySelector("img").src
);

let galleryIndex = 0;

function openGallery(index) {
    galleryIndex = index;
    galleryModalImage.src = galleryImages[galleryIndex];
    galleryCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
    galleryModal.classList.add("active");
    document.body.classList.add("gallery-open");
}

function closeGallery() {
    galleryModal.classList.remove("active");
    document.body.classList.remove("gallery-open");
}

function showPrevious() {
    galleryIndex =
        (galleryIndex - 1 + galleryImages.length) %
        galleryImages.length;

    galleryModalImage.src = galleryImages[galleryIndex];
    galleryCounter.textContent =
        `${galleryIndex + 1} / ${galleryImages.length}`;
}

function showNext() {
    galleryIndex =
        (galleryIndex + 1) %
        galleryImages.length;

    galleryModalImage.src = galleryImages[galleryIndex];
    galleryCounter.textContent =
        `${galleryIndex + 1} / ${galleryImages.length}`;
}

galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        openGallery(index);
    });
});

galleryClose.addEventListener("click", closeGallery);
galleryPrev.addEventListener("click", showPrevious);
galleryNext.addEventListener("click", showNext);

galleryModal.addEventListener("click", event => {
    if (event.target === galleryModal) {
        closeGallery();
    }
});

document.addEventListener("keydown", event => {
    if (!galleryModal.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeGallery();
    }

    if (event.key === "ArrowLeft") {
        showPrevious();
    }

    if (event.key === "ArrowRight") {
        showNext();
    }
});