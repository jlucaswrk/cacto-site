/**
 * Cacto Garden - Interactive Cactus Image Generator
 * Each time you type "cacto", a real cactus photo appears!
 */

// DOM Elements
const inputText = document.getElementById('inputText');
const cactusContainer = document.getElementById('cactusContainer');
const clearBtn = document.getElementById('clearBtn');
const cactusCount = document.getElementById('cactusCount');
const emptyState = document.getElementById('emptyState');
const particlesContainer = document.getElementById('particles');

// State
let currentCactusCount = 0;
let usedImageIds = new Set();
let imageCache = [];

// Cactus image sources - Using Unsplash Source API (free, no key required)
// Multiple search terms to get variety
const cactusSearchTerms = [
    'cactus',
    'succulent',
    'desert-plant',
    'cactus-flower',
    'prickly-pear',
    'saguaro'
];

// Fallback images (Unsplash direct links - free to use)
const fallbackImages = [
    'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1508022713622-df2d8a7d3f5a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1496061415655-a28529134f97?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518882605630-8eb260e67a2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=400&fit=crop',
];

// Initialize
function init() {
    createParticles();
    inputText.focus();
    preloadImages();
}

// Create floating particles
function createParticles() {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particlesContainer.appendChild(particle);
    }
}

// Preload some images for faster experience
function preloadImages() {
    const preloadCount = 5;
    for (let i = 0; i < preloadCount; i++) {
        const img = new Image();
        img.src = getRandomCactusImage();
        imageCache.push(img.src);
    }
}

// Get a random cactus image URL
function getRandomCactusImage() {
    // Use Unsplash Source API for random images
    const searchTerm = cactusSearchTerms[Math.floor(Math.random() * cactusSearchTerms.length)];
    const randomSig = Math.random().toString(36).substring(7);

    // Try Unsplash Source first (random image each time)
    const unsplashUrl = `https://source.unsplash.com/400x400/?${searchTerm}&sig=${randomSig}`;

    // Return with fallback strategy
    return unsplashUrl;
}

// Get fallback image
function getFallbackImage() {
    const availableImages = fallbackImages.filter(img => !usedImageIds.has(img));
    if (availableImages.length === 0) {
        usedImageIds.clear();
        return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    }
    const selected = availableImages[Math.floor(Math.random() * availableImages.length)];
    usedImageIds.add(selected);
    return selected;
}

// Count occurrences of "cacto" (case-insensitive)
function countCactusWords() {
    const text = inputText.value.toLowerCase();
    const regex = /cacto/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

// Create a cactus card element
function createCactusCard() {
    const card = document.createElement('div');
    card.className = 'cactus-card loading';

    const img = document.createElement('img');
    img.alt = 'Cactus';

    // Try primary source, fallback if fails
    const primaryUrl = getRandomCactusImage();
    const fallbackUrl = getFallbackImage();

    img.onload = () => {
        card.classList.remove('loading');
    };

    img.onerror = () => {
        // Use fallback image
        img.src = fallbackUrl;
    };

    img.src = primaryUrl;

    // Create overlay with remove button
    const overlay = document.createElement('div');
    overlay.className = 'cactus-card-overlay';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    `;
    removeBtn.setAttribute('aria-label', 'Remover cacto');

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeCactus(card);
    });

    overlay.appendChild(removeBtn);
    card.appendChild(img);
    card.appendChild(overlay);

    // Click on card also removes it
    card.addEventListener('click', () => {
        removeCactus(card);
    });

    return card;
}

// Remove a cactus with animation
function removeCactus(card) {
    card.classList.add('removing');
    setTimeout(() => {
        card.remove();
        updateEmptyState();
    }, 400);
}

// Update empty state visibility
function updateEmptyState() {
    const hasCards = cactusContainer.querySelectorAll('.cactus-card').length > 0;
    if (hasCards) {
        emptyState.classList.add('hidden');
    } else {
        emptyState.classList.remove('hidden');
    }
}

// Update cactuses based on word count
function updateCactuses() {
    const newCount = countCactusWords();

    // Update counter
    cactusCount.textContent = newCount;

    // Add new cactuses
    if (newCount > currentCactusCount) {
        const toAdd = newCount - currentCactusCount;
        for (let i = 0; i < toAdd; i++) {
            const card = createCactusCard();
            cactusContainer.appendChild(card);
        }
    }
    // Remove excess cactuses
    else if (newCount < currentCactusCount) {
        const toRemove = currentCactusCount - newCount;
        const cards = cactusContainer.querySelectorAll('.cactus-card:not(.removing)');
        const cardsToRemove = Array.from(cards).slice(-toRemove);

        cardsToRemove.forEach((card, index) => {
            setTimeout(() => {
                removeCactus(card);
            }, index * 100);
        });
    }

    currentCactusCount = newCount;
    updateEmptyState();
}

// Clear everything
function clearGarden() {
    const cards = cactusContainer.querySelectorAll('.cactus-card');

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('removing');
            setTimeout(() => card.remove(), 400);
        }, index * 50);
    });

    setTimeout(() => {
        inputText.value = '';
        currentCactusCount = 0;
        cactusCount.textContent = '0';
        usedImageIds.clear();
        updateEmptyState();
        inputText.focus();
    }, cards.length * 50 + 400);
}

// Event Listeners
inputText.addEventListener('input', updateCactuses);
clearBtn.addEventListener('click', clearGarden);

// Keyboard shortcut: Ctrl/Cmd + Enter to clear
inputText.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        clearGarden();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Add some fun easter eggs
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg: Fill garden with cacti!
        inputText.value = 'cacto '.repeat(12);
        updateCactuses();

        // Add celebration effect
        document.body.style.animation = 'none';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10);
    }
});
