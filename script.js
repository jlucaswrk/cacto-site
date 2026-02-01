/**
 * Cacto Garden - Interactive Cactus Image Generator
 * Each time you type "cacto", a real cactus photo appears with species info!
 *
 * Features:
 * - Real cactus photos from Unsplash
 * - Species identification for each cactus
 * - LocalStorage cache for images and garden state
 * - Persistent garden across sessions
 */

// ============================================
// CONFIGURATION & DATA
// ============================================

// Cactus species database with images and info
const CACTUS_SPECIES = [
    {
        id: 'saguaro',
        name: 'Saguaro',
        scientific: 'Carnegiea gigantea',
        origin: 'Arizona, EUA',
        images: [
            'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'prickly-pear',
        name: 'Palma',
        scientific: 'Opuntia ficus-indica',
        origin: 'México',
        images: [
            'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'barrel',
        name: 'Barril Dourado',
        scientific: 'Echinocactus grusonii',
        origin: 'México Central',
        images: [
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'bunny-ears',
        name: 'Orelha de Coelho',
        scientific: 'Opuntia microdasys',
        origin: 'México',
        images: [
            'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1518882605630-8eb260e67a2d?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'christmas',
        name: 'Flor de Maio',
        scientific: 'Schlumbergera truncata',
        origin: 'Brasil',
        images: [
            'https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'old-man',
        name: 'Cabeça de Velho',
        scientific: 'Cephalocereus senilis',
        origin: 'México',
        images: [
            'https://images.unsplash.com/photo-1508022713622-df2d8a7d3f5a?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1496061415655-a28529134f97?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'moon',
        name: 'Cacto Lua',
        scientific: 'Gymnocalycium mihanovichii',
        origin: 'América do Sul',
        images: [
            'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'star',
        name: 'Cacto Estrela',
        scientific: 'Astrophytum asterias',
        origin: 'Texas/México',
        images: [
            'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'zebra',
        name: 'Planta Zebra',
        scientific: 'Haworthiopsis attenuata',
        origin: 'África do Sul',
        images: [
            'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'bishop-cap',
        name: 'Mitra Episcopal',
        scientific: 'Astrophytum myriostigma',
        origin: 'México',
        images: [
            'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1446071103084-c257b5f70672?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'fairy-castle',
        name: 'Castelo de Fadas',
        scientific: 'Acanthocereus tetragonus',
        origin: 'América Central',
        images: [
            'https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        ]
    },
    {
        id: 'peyote',
        name: 'Peiote',
        scientific: 'Lophophora williamsii',
        origin: 'México/Texas',
        images: [
            'https://images.unsplash.com/photo-1551893478-d726eaf0442c?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1508022713622-df2d8a7d3f5a?w=400&h=400&fit=crop',
        ]
    },
];

// Cache configuration
const CACHE_CONFIG = {
    STORAGE_KEY: 'cacto-garden-cache',
    GARDEN_KEY: 'cacto-garden-state',
    MAX_CACHE_SIZE: 50,
    VERSION: '2.0'
};

// ============================================
// DOM ELEMENTS
// ============================================

const inputText = document.getElementById('inputText');
const cactusContainer = document.getElementById('cactusContainer');
const clearBtn = document.getElementById('clearBtn');
const cactusCount = document.getElementById('cactusCount');
const emptyState = document.getElementById('emptyState');
const particlesContainer = document.getElementById('particles');

// ============================================
// STATE MANAGEMENT
// ============================================

let currentCactusCount = 0;
let gardenCacti = []; // Array of cactus objects in the garden
let imageCache = new Map(); // URL -> blob URL cache

// ============================================
// CACHE SYSTEM (LocalStorage + Memory)
// ============================================

class CacheManager {
    constructor() {
        this.memoryCache = new Map();
        this.loadFromStorage();
    }

    // Load cache from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(CACHE_CONFIG.STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.version === CACHE_CONFIG.VERSION) {
                    // Restore image URLs (we can't store blobs in localStorage)
                    data.images.forEach(item => {
                        this.memoryCache.set(item.key, {
                            url: item.url,
                            species: item.species,
                            timestamp: item.timestamp
                        });
                    });
                    console.log(`📦 Cache loaded: ${this.memoryCache.size} images`);
                }
            }
        } catch (e) {
            console.warn('Failed to load cache:', e);
        }
    }

    // Save cache to localStorage
    saveToStorage() {
        try {
            const images = [];
            this.memoryCache.forEach((value, key) => {
                images.push({
                    key,
                    url: value.url,
                    species: value.species,
                    timestamp: value.timestamp
                });
            });

            // Limit cache size
            const limitedImages = images.slice(-CACHE_CONFIG.MAX_CACHE_SIZE);

            localStorage.setItem(CACHE_CONFIG.STORAGE_KEY, JSON.stringify({
                version: CACHE_CONFIG.VERSION,
                images: limitedImages,
                savedAt: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save cache:', e);
        }
    }

    // Add image to cache
    set(key, data) {
        this.memoryCache.set(key, {
            ...data,
            timestamp: Date.now()
        });
        this.saveToStorage();
    }

    // Get image from cache
    get(key) {
        return this.memoryCache.get(key);
    }

    // Check if image is cached
    has(key) {
        return this.memoryCache.has(key);
    }

    // Get all cached items
    getAll() {
        return Array.from(this.memoryCache.values());
    }

    // Clear cache
    clear() {
        this.memoryCache.clear();
        localStorage.removeItem(CACHE_CONFIG.STORAGE_KEY);
    }
}

// ============================================
// GARDEN STATE PERSISTENCE
// ============================================

class GardenState {
    constructor() {
        this.cacti = [];
        this.textValue = '';
        this.load();
    }

    // Load garden state from localStorage
    load() {
        try {
            const stored = localStorage.getItem(CACHE_CONFIG.GARDEN_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.version === CACHE_CONFIG.VERSION) {
                    this.cacti = data.cacti || [];
                    this.textValue = data.textValue || '';
                    console.log(`🌵 Garden restored: ${this.cacti.length} cacti`);
                }
            }
        } catch (e) {
            console.warn('Failed to load garden state:', e);
        }
    }

    // Save garden state to localStorage
    save() {
        try {
            localStorage.setItem(CACHE_CONFIG.GARDEN_KEY, JSON.stringify({
                version: CACHE_CONFIG.VERSION,
                cacti: this.cacti,
                textValue: this.textValue,
                savedAt: Date.now()
            }));
        } catch (e) {
            console.warn('Failed to save garden state:', e);
        }
    }

    // Add cactus to garden
    addCactus(cactusData) {
        this.cacti.push({
            id: Date.now() + Math.random(),
            ...cactusData,
            addedAt: Date.now()
        });
        this.save();
    }

    // Remove cactus from garden
    removeCactus(id) {
        this.cacti = this.cacti.filter(c => c.id !== id);
        this.save();
    }

    // Update text value
    updateText(text) {
        this.textValue = text;
        this.save();
    }

    // Clear garden
    clear() {
        this.cacti = [];
        this.textValue = '';
        this.save();
    }

    // Get all cacti
    getAll() {
        return this.cacti;
    }
}

// Initialize managers
const cacheManager = new CacheManager();
const gardenState = new GardenState();

// ============================================
// SPECIES SELECTION
// ============================================

function getRandomSpecies() {
    const usedSpeciesIds = gardenState.getAll().map(c => c.speciesId);

    // Try to get a species not recently used
    const availableSpecies = CACTUS_SPECIES.filter(s =>
        usedSpeciesIds.filter(id => id === s.id).length < 2
    );

    const pool = availableSpecies.length > 0 ? availableSpecies : CACTUS_SPECIES;
    return pool[Math.floor(Math.random() * pool.length)];
}

function getRandomImageForSpecies(species) {
    const images = species.images;
    return images[Math.floor(Math.random() * images.length)];
}

// ============================================
// UI COMPONENTS
// ============================================

// Create particles background
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

// Create a cactus card element
function createCactusCard(cactusData) {
    const { id, speciesId, imageUrl, species } = cactusData;

    const card = document.createElement('div');
    card.className = 'cactus-card loading';
    card.dataset.id = id;

    // Image container
    const imgContainer = document.createElement('div');
    imgContainer.className = 'cactus-image-container';

    const img = document.createElement('img');
    img.alt = species.name;

    img.onload = () => {
        card.classList.remove('loading');
        // Cache the loaded image
        cacheManager.set(imageUrl, {
            url: imageUrl,
            species: species
        });
    };

    img.onerror = () => {
        // Fallback to another image from the same species
        const fallbackUrl = getRandomImageForSpecies(species);
        if (fallbackUrl !== imageUrl) {
            img.src = fallbackUrl;
        }
    };

    img.src = imageUrl;
    imgContainer.appendChild(img);

    // Species info label
    const speciesLabel = document.createElement('div');
    speciesLabel.className = 'species-label';
    speciesLabel.innerHTML = `
        <span class="species-name">${species.name}</span>
        <span class="species-scientific">${species.scientific}</span>
    `;

    // Overlay with remove button
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
        removeCactus(card, id);
    });

    overlay.appendChild(removeBtn);

    card.appendChild(imgContainer);
    card.appendChild(speciesLabel);
    card.appendChild(overlay);

    // Click on card shows species info
    card.addEventListener('click', () => {
        showSpeciesInfo(species);
    });

    return card;
}

// Show species info tooltip/modal
function showSpeciesInfo(species) {
    // Create a temporary tooltip
    const existing = document.querySelector('.species-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'species-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <h3>${species.name}</h3>
            <p class="scientific"><em>${species.scientific}</em></p>
            <p class="origin">📍 ${species.origin}</p>
        </div>
    `;
    document.body.appendChild(tooltip);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        tooltip.classList.add('fade-out');
        setTimeout(() => tooltip.remove(), 300);
    }, 3000);
}

// ============================================
// GARDEN MANAGEMENT
// ============================================

function addNewCactus() {
    const species = getRandomSpecies();
    const imageUrl = getRandomImageForSpecies(species);

    const cactusData = {
        id: Date.now() + Math.random(),
        speciesId: species.id,
        imageUrl: imageUrl,
        species: species
    };

    // Add to state
    gardenState.addCactus(cactusData);

    // Create and add card
    const card = createCactusCard(cactusData);
    cactusContainer.appendChild(card);

    return cactusData;
}

function removeCactus(card, id) {
    card.classList.add('removing');

    setTimeout(() => {
        card.remove();
        gardenState.removeCactus(id);
        updateEmptyState();
        updateCounter();
    }, 400);
}

function updateEmptyState() {
    const hasCards = cactusContainer.querySelectorAll('.cactus-card').length > 0;
    if (hasCards) {
        emptyState.classList.add('hidden');
    } else {
        emptyState.classList.remove('hidden');
    }
}

function updateCounter() {
    const count = cactusContainer.querySelectorAll('.cactus-card:not(.removing)').length;
    cactusCount.textContent = count;
}

// ============================================
// MAIN LOGIC
// ============================================

function countCactusWords() {
    const text = inputText.value.toLowerCase();
    const regex = /cacto/g;
    const matches = text.match(regex);
    return matches ? matches.length : 0;
}

function updateCactuses() {
    const newCount = countCactusWords();
    const currentCount = cactusContainer.querySelectorAll('.cactus-card:not(.removing)').length;

    // Save text state
    gardenState.updateText(inputText.value);

    // Add new cactuses
    if (newCount > currentCount) {
        const toAdd = newCount - currentCount;
        for (let i = 0; i < toAdd; i++) {
            addNewCactus();
        }
    }
    // Remove excess cactuses
    else if (newCount < currentCount) {
        const toRemove = currentCount - newCount;
        const cards = cactusContainer.querySelectorAll('.cactus-card:not(.removing)');
        const cardsToRemove = Array.from(cards).slice(-toRemove);

        cardsToRemove.forEach((card, index) => {
            setTimeout(() => {
                const id = parseFloat(card.dataset.id);
                removeCactus(card, id);
            }, index * 100);
        });
    }

    updateCounter();
    updateEmptyState();
}

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
        gardenState.clear();
        updateCounter();
        updateEmptyState();
        inputText.focus();
    }, cards.length * 50 + 400);
}

// ============================================
// RESTORE GARDEN FROM CACHE
// ============================================

function restoreGarden() {
    const savedCacti = gardenState.getAll();
    const savedText = gardenState.textValue;

    if (savedText) {
        inputText.value = savedText;
    }

    if (savedCacti.length > 0) {
        console.log(`🌵 Restoring ${savedCacti.length} cacti from cache...`);

        savedCacti.forEach((cactusData, index) => {
            setTimeout(() => {
                const card = createCactusCard(cactusData);
                cactusContainer.appendChild(card);
                updateEmptyState();
                updateCounter();
            }, index * 100);
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    console.log('🌵 Cacto Garden v2.0 - Initializing...');

    // Create background particles
    createParticles();

    // Restore garden from cache
    restoreGarden();

    // Update UI
    updateEmptyState();
    updateCounter();

    // Focus input
    inputText.focus();

    console.log('✅ Initialization complete!');
}

// ============================================
// EVENT LISTENERS
// ============================================

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

// ============================================
// EASTER EGGS
// ============================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg: Fill garden with all species!
        inputText.value = 'cacto '.repeat(CACTUS_SPECIES.length);
        updateCactuses();

        // Celebration effect
        document.body.classList.add('celebrate');
        setTimeout(() => {
            document.body.classList.remove('celebrate');
        }, 2000);
    }
});

// ============================================
// SERVICE WORKER REGISTRATION (for offline cache)
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here for full offline support
        console.log('💾 Cache system ready');
    });
}
