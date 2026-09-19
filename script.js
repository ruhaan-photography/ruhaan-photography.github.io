const menuButton = document.getElementById("menuButton");
const navigationLinks = document.getElementById("navigationLinks");

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
);

const pagination = document.getElementById("pagination");
const gallerySection = document.getElementById("gallery");

const imageButtons = document.querySelectorAll(".image-button");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxDescription = document.getElementById(
    "lightboxDescription"
);
const lightboxClose = document.getElementById("lightboxClose");

const currentYear = document.getElementById("currentYear");

/* Footer year */

currentYear.textContent = new Date().getFullYear();

/* Mobile navigation */

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

/* Hero slideshow */

const slides = Array.from(docum*nt.querySelectorAll(".slide"));
co*st previousSlideButton =
    docum*nt.getElementById("previousSlide")*
const nextSlideButton =
    docum*nt.getElementById("nextSlide");
co*st slideIndicators =
    document.*etElementById("slideIndicators");
*let activeSlideIndex = 0;
let slid*showTimer;

function createSlideIn*icators() {
    slideIndicators.in*erHTML = "";

    slides.forEach((*lide, index) => {
        const in*icator = document.createElement("b*tton");

        indicator.type = *button";
        indicator.classNa*e = "slide-indicator";
        ind*cator.setAttribute(
            "a*ia-label",
            `Show photo*raph ${index + 1}`
        );

   *    if (index === activeSlideIndex* {
            indicator.classList*add("active");
        }

        *ndicator.addEventListener("click",*() => {
            showSlide(inde*);
            restartSlideshow();*        });

        slideIndicators.appendChild(indicator);
    });
}

function showSlide(index) {
    if (index < 0) {
        activeSlideIndex = slides.length - 1;
    } else if (index >= slides.length) {
        activeSlideIndex = 0;
    } else {
        activeSlideIndex = index;
    }

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle(
            "active",
            slideIndex === activeSlideIndex
        );
    });

    const indicators =
        slideIndicators.querySelectorAll(".slide-indicator");

    indicators.forEach((indicator, indicatorIndex) => {
        indicator.classList.toggle(
            "active",
            indicatorIndex === activeSlideIndex
        );
    });
}

function startSlideshow() {
    slideshowTimer = window.setInterval(() => {
        showSlide(activeSlideIndex + 1);
    }, 5500);
}

function restartSlideshow() {
    window.clearInterval(slideshowTimer);
    startSlideshow();
}

previousSlideButton.addEventListener("click", () => {
    showSlide(activeSlideIndex - 1);
    restartSlideshow();
});

nextSlideButton.addEventListener("click", () => {
    showSlide(activeSlideIndex + 1);
    restartSlideshow();
});

createSlideIndicators();
showSlide(0);
startSlideshow();

/* Gallery filters and pagination */

const itemsPerPage = 6;

let selectedFilter = "all";
let currentPage = 1;

function getFilteredItems() {
    return galleryItems.filter((item) => {
        return (
            selectedFilter === "all" ||
            item.dataset.category === selectedFilter
        );
    });
}

function renderGallery() {
    const filteredItems = getFilteredItems();
    const totalPages = Math.max(
        1,
        Math.ceil(filteredItems.length / itemsPerPage)
    );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    galleryItems.forEach((item) => {
        const matchesFilter =
            selectedFilter === "all" ||
            item.dataset.category === selectedFilter;

        item.classList.toggle(
            "filter-hidden",
            !matchesFilter
        );

        item.classList.add("pagination-hidden");
    });

    filteredItems
        .slice(startIndex, endIndex)
        .forEach((item) => {
            item.classList.remove("pagination-hidden");
        });

    renderPagination(totalPages);
}

function createPageButton(
    label,
    pageNumber,
    options = {}
) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "page-button";
    button.textContent = label;

    if (options.active) {
        button.classList.add("active");
        button.setAttribute("aria-current", "page");
    }

    if (options.disabled) {
        button.disabled = true;
    }

    button.addEventListener("click", () => {
        currentPage = pageNumber;
        renderGallery();

        gallerySection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    return button;
}

function renderPagination(totalPages) {
    pagination.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }

    pagination.appendChild(
        createPageButton(
            "Previous",
            currentPage - 1,
            {
                disabled: currentPage === 1
            }
        )
    );

    for (let page = 1; page <= totalPages; page += 1) {
        pagination.appendChild(
            createPageButton(
                String(page),
                page,
                {
                    active: page === currentPage
                }
            )
        );
    }

    pagination.appendChild(
        createPageButton(
            "Next",
            currentPage + 1,
            {
                disabled: currentPage === totalPages
            }
        )
    );
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectedFilter = button.dataset.filter;
        currentPage = 1;

        filterButtons.forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderGallery();
    });
});

renderGallery();

/* Gallery lightbox */

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
