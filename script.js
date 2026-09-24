document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal functionality
    const reveals = document.querySelectorAll('.reveal');

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    // Initial check and scroll listener
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // trigger once on load

    // Mobile navigation toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close the menu after tapping a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');

// Gallery state (only used when the lightbox is opened with multiple images)
let currentGalleryImages = [];
let currentGalleryIndex = 0;

function openLightbox(imageSrc, captionText) {
    // Backward-compatible single-image entry point: always resets gallery state
    // so no stale Prev/Next controls leak in from a previous openGallery() call.
    currentGalleryImages = [];
    currentGalleryIndex = 0;
    lightbox.classList.remove('has-gallery');

    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = captionText;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
}

function openGallery(images, startIndex) {
    currentGalleryImages = images;
    currentGalleryIndex = startIndex || 0;

    lightbox.classList.toggle('has-gallery', currentGalleryImages.length > 1);
    renderGalleryImage();

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
}

function renderGalleryImage() {
    const current = currentGalleryImages[currentGalleryIndex];
    lightboxImg.src = current.src;
    lightboxCaption.textContent = current.caption;
    lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
}

function showPrevImage() {
    if (currentGalleryImages.length < 2) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    renderGalleryImage();
}

function showNextImage() {
    if (currentGalleryImages.length < 2) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
    renderGalleryImage();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.classList.remove('has-gallery');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    setTimeout(() => {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
        lightboxCounter.textContent = '';
        currentGalleryImages = [];
        currentGalleryIndex = 0;
    }, 300); // Wait for transition before clearing
}

// Close lightbox on escape key press, navigate gallery with arrow keys
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        showPrevImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
        closeLightbox();
    }
});
