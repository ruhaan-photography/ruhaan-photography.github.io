document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.getElementById("menuButton");
    const navigationLinks = document.getElementById("navigationLinks");
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    if (menuButton && navigationLinks) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigationLinks.classList.toggle("open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });

        navigationLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navigationLinks.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Hero slideshow
    const slides = Array.from(document.querySelectorAll(".slide"));
    const previousSlideButton = document.getElementById("previousSlide");
    const nextSlideButton = document.getElementById("nextSlide");
    const slideIndicators = document.getElementById("slideIndicators");

    let activeSlideIndex = 0;
    let slideshowTimer = null;

    function showSlide(index) {
        if (!slides.length) return;

        activeSlideIndex = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === activeSlideIndex);
        });

        if (slideIndicators) {
            slideIndicators.querySelectorAll(".slide-indicator").forEach((indicator, indicatorIndex) => {
                indicator.classList.toggle("active", indicatorIndex === activeSlideIndex);
            });
        }
    }

    function startSlideshow() {
        window.clearInterval(slideshowTimer);

        if (slides.length > 1) {
            slideshowTimer = window.setInterval(() => {
                showSlide(activeSlideIndex + 1);
            }, 5000);
        }
    }

    if (slideIndicators && slides.length) {
        slides.forEach((slide, index) => {
            const indicator = document.createElement("button");
            indicator.type = "button";
            indicator.className = "slide-indicator";
            indicator.setAttribute("aria-label", `Show photograph ${index + 1}`);
            indicator.addEventListener("click", () => {
                showSlide(index);
                startSlideshow();
            });
            slideIndicators.appendChild(indicator);
        });
    }

    if (previousSlideButton) {
        previousSlideButton.addEventListener("click", () => {
            showSlide(activeSlideIndex - 1);
            startSlideshow();
        });
    }

    if (nextSlideButton) {
        nextSlideButton.addEventListener("click", () => {
            showSlide(activeSlideIndex + 1);
            startSlideshow();
        });
    }

    showSlide(0);
    startSlideshow();

    // Gallery filtering and pagination
    const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
    const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    const pagination = document.getElementById("pagination");
    const gallerySection = document.getElementById("gallery");
    const itemsPerPage = 3;

    let selectedFilter = "all";
    let currentPage = 1;

    function getFilteredItems() {
        return galleryItems.filter((item) => {
            return selectedFilter === "all" || item.dataset.category === selectedFilter;
        });
    }

    function makePageButton(label, targetPage, isActive = false, isDisabled = false) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "page-button";
        button.textContent = label;
        button.disabled = isDisabled;

        if (isActive) {
            button.classList.add("active");
            button.setAttribute("aria-current", "page");
        }

        button.addEventListener("click", () => {
            if (button.disabled) return;
            currentPage = targetPage;
            renderGallery();

            if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });

        return button;
    }

    function renderPagination(totalPages) {
        if (!pagination) return;

        pagination.innerHTML = "";

        if (totalPages <= 1) return;

        pagination.appendChild(
            makePageButton("Previous", currentPage - 1, false, currentPage === 1)
        );

        for (let page = 1; page <= totalPages; page += 1) {
            pagination.appendChild(
                makePageButton(String(page), page, page === currentPage, false)
            );
        }

        pagination.appendChild(
            makePageButton("Next", currentPage + 1, false, currentPage === totalPages)
        );
    }

    function renderGallery() {
        const filteredItems = getFilteredItems();
        const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));

        currentPage = Math.min(Math.max(currentPage, 1), totalPages);

        galleryItems.forEach((item) => {
            item.classList.add("filter-hidden");
            item.classList.add("pagination-hidden");
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const visibleItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

        visibleItems.forEach((item) => {
            item.classList.remove("filter-hidden");
            item.classList.remove("pagination-hidden");
        });

        renderPagination(totalPages);
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectedFilter = button.dataset.filter || "all";
            currentPage = 1;

            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            renderGallery();
        });
    });

    renderGallery();

    // Gallery lightbox
    const imageButtons = Array.from(document.querySelectorAll(".image-button"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxDescription = document.getElementById("lightboxDescription");
    const lightboxClose = document.getElementById("lightboxClose");

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove("visible");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        if (lightboxImage) lightboxImage.src = "";
    }

    imageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (!lightbox || !lightboxImage) return;

            lightboxImage.src = button.dataset.image || "";
            lightboxImage.alt = button.dataset.title || "Selected photograph";
            if (lightboxTitle) lightboxTitle.textContent = button.dataset.title || "";
            if (lightboxDescription) {
                lightboxDescription.textContent = button.dataset.description || "";
            }

            lightbox.classList.add("visible");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");
            if (lightboxClose) lightboxClose.focus();
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener("click", closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeLightbox();
    });
});
