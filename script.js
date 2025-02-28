// Dog image carousel
document.addEventListener('DOMContentLoaded', function () {
    // Get elements
    const carouselContainer = document.getElementById('dogCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let dogImages = [];
    let currentIndex = 0;
    let autoplayInterval;

    // Fetch dog images from API
    async function fetchDogImages() {
        try {
            // Load multiple dog images
            const promises = [];
            for (let i = 0; i < 15; i++) {
                promises.push(fetchSingleDogImage());
            }

            const results = await Promise.allSettled(promises);

            // Filter successful results
            dogImages = results
                .filter(result => result.status === 'fulfilled' && result.value)
                .map((result, index) => ({
                    id: index + 1,
                    title: `Cute Dog #${index + 1}`,
                    imageUrl: result.value
                }));


            if (dogImages.length > 0) {
                renderCarousel();
                startAutoplay();
            } else {
                showError('No dog images found');
            }
        } catch (error) {
            console.error('Error fetching dog images:', error);
            showError('Failed to load dog images');
        }
    }

    // Get single dog image
    async function fetchSingleDogImage() {
        try {
            const response = await fetch('https://random.dog/woof.json');
            const data = await response.json();

            if (data && data.url && isImageFile(data.url)) {
                return data.url;
            } else {
                return fetchSingleDogImage();
            }
        } catch (error) {
            console.error('Error fetching single dog image:', error);
            return null;
        }
    }

    function isImageFile(url) {
        return /\.(jpg|jpeg|png|gif)$/i.test(url);
    }

    // Render carousel
    function renderCarousel() {
        const controlsElement = carouselContainer.querySelector('.carousel-controls');
        carouselContainer.innerHTML = '';
        if (controlsElement) {
            carouselContainer.appendChild(controlsElement);
        }

        dogImages.forEach((dog, index) => {
            const dogElement = document.createElement('div');
            dogElement.className = `dog-image ${index === currentIndex ? 'active' : ''}`;

            dogElement.innerHTML = `
                <img src="${dog.imageUrl}" alt="${dog.title}" class="dog-image-img" />
                <div class="dog-image-info">
                    <h3 class="dog-image-title">${dog.title}</h3>
                </div>
            `;

            carouselContainer.appendChild(dogElement);
        });
    }

    // Show error message
    function showError(message) {
        const controlsElement = carouselContainer.querySelector('.carousel-controls');
        carouselContainer.innerHTML = `<div class="loading">${message}</div>`;
        if (controlsElement) {
            carouselContainer.appendChild(controlsElement);
        }
    }

    // Start autoplay
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        autoplayInterval = setInterval(showNextImage, 5000);
    }

    // Show next image
    function showNextImage() {
        if (dogImages.length === 0) return;

        const currentImage = document.querySelector('.dog-image.active');
        if (currentImage) {
            currentImage.classList.remove('active');
        }

        currentIndex = (currentIndex + 1) % dogImages.length;

        const nextImage = document.querySelectorAll('.dog-image')[currentIndex];
        if (nextImage) {
            nextImage.classList.add('active');
        }
    }

    // Show previous image
    function showPrevImage() {
        if (dogImages.length === 0) return;

        const currentImage = document.querySelector('.dog-image.active');
        if (currentImage) {
            currentImage.classList.remove('active');
        }

        currentIndex = (currentIndex - 1 + dogImages.length) % dogImages.length;

        const prevImage = document.querySelectorAll('.dog-image')[currentIndex];
        if (prevImage) {
            prevImage.classList.add('active');
        }
    }

    // Button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            showPrevImage();
            startAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            showNextImage();
            startAutoplay();
        });
    }

    // Pause autoplay on hover
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    // Resume autoplay on mouse leave
    carouselContainer.addEventListener('mouseleave', () => {
        startAutoplay();
    });

    // Initialize
    fetchDogImages();

    // Project Dialog Functionality
    setupProjectDialogs();
});


function setupProjectDialogs() {
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');

    // Add click event to each project card
    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            const projectId = this.getAttribute('data-project-id');
            const dialog = document.getElementById(`project-dialog-${projectId}`);

            if (dialog) {
                dialog.showModal();
            }
        });
    });

    // Add close button to all dialogs
    const closeButtons = document.querySelectorAll('.dialog-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const dialog = this.closest('dialog');
            if (dialog) {
                dialog.close();
            }
        });
    });

    // Close dialog when clicking on backdrop
    const dialogs = document.querySelectorAll('.project-dialog');
    dialogs.forEach(dialog => {
        dialog.addEventListener('click', function (event) {
            // Check if the click was on the dialog backdrop (not on dialog content)
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });

    // Also add keyboard support (Escape key to close)
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const openDialog = document.querySelector('dialog[open]');
            if (openDialog) {
                openDialog.close();
            }
        }
    });
} 