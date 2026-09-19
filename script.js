const menuButton = document.getElementById("menuButton");
const navigationLinks = document.getElementById("navigationLinks");
const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");
const imageButtons = document.querySelectorAll(".image-button");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById(
    "lightboxDescription"
);
const lightboxClose = document.getElementById("lightboxClose");

const currentYear = document.getElementById("currentYear");

currentYear.textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
    const menuIsOpen = navigationLinks.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        String(menuIsOpen)
    );
});

navigationLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navigationLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        galleryItems.forEach((item) => {
            const category = item.dataset.category;
            const shouldShow =
                selectedFilter === "all" ||
                category === selectedFilter;

            item.classList.toggle("hidden", !shouldShow);
        });
    });
});

function openLightbox(button) {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.dataset.title;
    lightboxTitle.textContent = button.dataset.title;
    lightboxDescription.textContent =
        button.dataset.description;

    lightbox.classList.add("visible");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");

    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.classList.remove("visible");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");

    lightboxImage.src = "";
}

imageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        openLightbox(button);
    });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        lightbox.classList.contains("visible")
    ) {
        closeLightbox();
    }
});
