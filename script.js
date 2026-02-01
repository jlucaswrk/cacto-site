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
const cactusContainerDesktop = document.getElementById('cactusContainerDesktop');
const cactusContainerMobile = document.getElementById('cactusContainerMobile');
const clearBtn = document.getElementById('clearBtn');
const cactusCount = document.getElementById('cactusCount');
const emptyState = document.getElementById('emptyState');
const emptyStateDesktop = document.getElementById('emptyStateDesktop');
const emptyStateMobile = document.getElementById('emptyStateMobile');
const particlesContainer = document.getElementById('particles');

// Get active container based on screen size
function getActiveContainer() {
    return window.innerWidth <= 640 ? cactusContainerMobile : cactusContainerDesktop;
}

// Get active empty state based on screen size
function getActiveEmptyState() {
    return window.innerWidth <= 640 ? emptyStateMobile : emptyStateDesktop;
}

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
// CACTUS REVIEWS & METADATA SYSTEM
// Com integração Supabase para sincronização na nuvem
// ============================================

class CactusMetadata {
    constructor() {
        this.storage = {
            key: 'cacto-metadata-v1'
        };
        this.metadata = new Map();
        this.sessionId = this.getOrCreateSessionId();
        this.supabaseEnabled = typeof supabase !== 'undefined';
        this.load();
    }

    // Gerar ou recuperar ID de sessão único
    getOrCreateSessionId() {
        let sessionId = localStorage.getItem('cacto-session-id');
        if (!sessionId) {
            sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('cacto-session-id', sessionId);
        }
        return sessionId;
    }

    // Load metadata from localStorage (e sincronizar com Supabase se disponível)
    load() {
        try {
            const stored = localStorage.getItem(this.storage.key);
            if (stored) {
                const data = JSON.parse(stored);
                this.metadata = new Map(data);
                console.log('📝 Metadata carregado:', this.metadata.size, 'cactos com comentários');
            }
        } catch (e) {
            console.warn('Failed to load metadata:', e);
        }
    }

    // Save metadata to localStorage E Supabase
    save() {
        try {
            const data = Array.from(this.metadata.entries());
            localStorage.setItem(this.storage.key, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save metadata:', e);
        }
    }

    // Get metadata for a cactus
    getMetadata(cactusId) {
        return this.metadata.get(String(cactusId)) || {
            rating: 0,
            comments: [],
            createdAt: Date.now()
        };
    }

    // Set rating for a cactus (salva local + Supabase)
    setRating(cactusId, rating, speciesData = null) {
        const metadata = this.getMetadata(cactusId);
        metadata.rating = Math.max(0, Math.min(5, rating));
        metadata.updatedAt = Date.now();
        this.metadata.set(String(cactusId), metadata);
        this.save();

        // Sincronizar com Supabase
        if (this.supabaseEnabled) {
            this.syncRatingToSupabase(cactusId, rating, speciesData);
        }

        this.notifyMilestone(`⭐ Cacto avaliado com ${metadata.rating} estrelas!`);
        return metadata;
    }

    // Sincronizar rating com Supabase
    async syncRatingToSupabase(cactusId, rating, speciesData) {
        try {
            const reviewData = {
                cactus_id: String(cactusId),
                species_id: speciesData?.id || 'unknown',
                species_name: speciesData?.name || 'Desconhecido',
                rating: rating,
                user_session_id: this.sessionId
            };

            await supabase.createReview(reviewData);
            console.log('☁️ Rating sincronizado com Supabase:', rating);
        } catch (error) {
            console.warn('Falha ao sincronizar rating com Supabase:', error);
        }
    }

    // Add comment to a cactus (salva local + Supabase)
    addComment(cactusId, comment) {
        const metadata = this.getMetadata(cactusId);
        const newComment = {
            id: Date.now(),
            text: comment,
            createdAt: Date.now()
        };
        metadata.comments.push(newComment);
        metadata.updatedAt = Date.now();
        this.metadata.set(String(cactusId), metadata);
        this.save();

        // Sincronizar com Supabase
        if (this.supabaseEnabled) {
            this.syncCommentToSupabase(cactusId, comment);
        }

        this.notifyMilestone(`💬 Comentário adicionado! Total: ${metadata.comments.length} comentários`);
        return newComment;
    }

    // Sincronizar comentário com Supabase
    async syncCommentToSupabase(cactusId, commentText) {
        try {
            const commentData = {
                cactus_id: String(cactusId),
                comment_text: commentText,
                user_session_id: this.sessionId,
                user_name: 'Jardineiro Anônimo'
            };

            await supabase.createComment(commentData);
            console.log('☁️ Comentário sincronizado com Supabase');
        } catch (error) {
            console.warn('Falha ao sincronizar comentário com Supabase:', error);
        }
    }

    // Remove comment from a cactus
    removeComment(cactusId, commentId) {
        const metadata = this.getMetadata(cactusId);
        metadata.comments = metadata.comments.filter(c => c.id !== commentId);
        metadata.updatedAt = Date.now();
        this.metadata.set(String(cactusId), metadata);
        this.save();
        this.notifyMilestone(`🗑️ Comentário removido`);
    }

    // Get all metadata
    getAll() {
        return Array.from(this.metadata.values());
    }

    // Get stats (local + cloud)
    getStats() {
        const allMetadata = this.getAll();
        const totalRatings = allMetadata.filter(m => m.rating > 0).length;
        const totalComments = allMetadata.reduce((sum, m) => sum + m.comments.length, 0);
        const avgRating = totalRatings > 0
            ? (allMetadata.reduce((sum, m) => sum + m.rating, 0) / totalRatings).toFixed(1)
            : 0;

        return {
            totalRatings,
            totalComments,
            avgRating
        };
    }

    // Notify milestone reached
    notifyMilestone(message) {
        const event = new CustomEvent('milestone', { detail: { message } });
        document.dispatchEvent(event);
    }

    // Clear all metadata
    clear() {
        this.metadata.clear();
        localStorage.removeItem(this.storage.key);
    }
}

const cactusMetadata = new CactusMetadata();

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

// Create a cactus card element with stars in footer
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

    // Card Footer (contains species label + stars)
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    // Species info label
    const speciesLabel = document.createElement('div');
    speciesLabel.className = 'species-label';
    speciesLabel.innerHTML = `
        <span class="species-name">${species.name}</span>
        <span class="species-scientific">${species.scientific}</span>
    `;

    // Card Stars - Interactive inline rating
    const metadata = cactusMetadata.getMetadata(id);
    const cardStars = document.createElement('div');
    cardStars.className = 'card-stars';
    cardStars.dataset.cactusId = id;

    // Create 5 stars
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.dataset.rating = i;
        star.innerHTML = '★';

        if (i <= metadata.rating) {
            star.classList.add('filled');
        }

        // Click to rate directly from card
        star.addEventListener('click', (e) => {
            e.stopPropagation();
            const newRating = i === metadata.rating ? 0 : i;
            cactusMetadata.setRating(id, newRating, species);
            updateCardStars(id, newRating);
        });

        cardStars.appendChild(star);
    }

    cardFooter.appendChild(speciesLabel);
    cardFooter.appendChild(cardStars);

    // Overlay with action buttons
    const overlay = document.createElement('div');
    overlay.className = 'cactus-card-overlay';

    // Review button (shows comments & rating modal)
    const reviewBtn = document.createElement('button');
    reviewBtn.className = 'review-btn';
    reviewBtn.innerHTML = '💬';
    reviewBtn.setAttribute('aria-label', 'Adicionar comentário');

    reviewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showReviewModal(id, species);
    });

    // Remove button
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

    overlay.appendChild(reviewBtn);
    overlay.appendChild(removeBtn);

    // Assemble card
    card.appendChild(imgContainer);
    card.appendChild(cardFooter);
    card.appendChild(overlay);

    // Click on card shows species info (but not if clicking buttons/stars)
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('.star')) {
            showSpeciesInfo(species);
        }
    });

    return card;
}

// Update stars display on card
function updateCardStars(cactusId, rating) {
    const cardStars = document.querySelector(`.card-stars[data-cactus-id="${cactusId}"]`);
    if (cardStars) {
        cardStars.querySelectorAll('.star').forEach((star, idx) => {
            star.classList.toggle('filled', idx < rating);
        });
    }
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
// CACTUS REVIEW MODAL
// ============================================

function showReviewModal(cactusId, species) {
    // Remove existing modal if any
    const existing = document.querySelector('.review-modal-overlay');
    if (existing) existing.remove();

    const metadata = cactusMetadata.getMetadata(cactusId);
    let currentRating = metadata.rating || 0;
    const comments = metadata.comments || [];

    // Rating feedback messages
    const ratingMessages = [
        '',
        '😕 Precisa melhorar',
        '🙂 Razoável',
        '😊 Bom cacto!',
        '🤩 Ótimo cacto!',
        '🌟 Cacto perfeito!'
    ];

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'review-modal-overlay';

    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'review-modal';

    // Modal content wrapper (for scrolling)
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'modal-content-wrapper';

    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <h2>${species.name}</h2>
        <p class="modal-subtitle">${species.scientific}</p>
    `;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', () => {
        overlay.classList.add('closing');
        setTimeout(() => overlay.remove(), 300);
    });
    header.appendChild(closeBtn);

    // Rating section
    const ratingSection = document.createElement('div');
    ratingSection.className = 'rating-section';
    ratingSection.innerHTML = '<h3>Avaliação</h3>';

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-container';

    // Rating feedback element
    const ratingFeedback = document.createElement('div');
    ratingFeedback.className = 'rating-feedback';
    if (currentRating > 0) {
        ratingFeedback.textContent = ratingMessages[currentRating];
        ratingFeedback.classList.add('visible');
    }

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('button');
        star.className = 'star-btn';
        star.innerHTML = '★';
        star.dataset.rating = i;
        star.classList.toggle('active', i <= currentRating);

        // Hover effect for stars
        star.addEventListener('mouseenter', () => {
            starsContainer.querySelectorAll('.star-btn').forEach((s, idx) => {
                s.style.color = idx < i ? 'var(--sand)' : '';
            });
        });

        star.addEventListener('mouseleave', () => {
            starsContainer.querySelectorAll('.star-btn').forEach((s, idx) => {
                s.style.color = '';
            });
        });

        star.addEventListener('click', () => {
            const newRating = i === currentRating ? 0 : i;
            currentRating = newRating;
            cactusMetadata.setRating(cactusId, newRating, species);

            // Update stars display
            starsContainer.querySelectorAll('.star-btn').forEach((s, idx) => {
                s.classList.toggle('active', idx < newRating);
            });

            // Update feedback text
            if (newRating > 0) {
                ratingFeedback.textContent = ratingMessages[newRating];
                ratingFeedback.classList.add('visible');
            } else {
                ratingFeedback.classList.remove('visible');
            }

            // Update card rating indicator
            updateCardRating(cactusId, newRating);
        });

        starsContainer.appendChild(star);
    }

    ratingSection.appendChild(starsContainer);
    ratingSection.appendChild(ratingFeedback);

    // Comments section
    const commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section';
    commentsSection.innerHTML = '<h3>Comentários</h3>';

    // Comments list
    const commentsList = document.createElement('div');
    commentsList.className = 'comments-list';

    function renderComments() {
        commentsList.innerHTML = '';

        if (comments.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'no-comments';
            empty.innerHTML = 'Nenhum comentário ainda.<br>Seja o primeiro!';
            commentsList.appendChild(empty);
        } else {
            comments.forEach(comment => {
                const commentItem = createCommentElement(comment, cactusId, commentsList);
                commentsList.appendChild(commentItem);
            });

            // Scroll to bottom
            setTimeout(() => {
                commentsList.scrollTop = commentsList.scrollHeight;
            }, 100);
        }
    }

    function createCommentElement(comment, cactusId, listElement) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';

        const commentText = document.createElement('p');
        commentText.className = 'comment-text';
        commentText.textContent = comment.text;

        const commentMeta = document.createElement('div');
        commentMeta.className = 'comment-meta';

        const commentTime = new Date(comment.createdAt);
        const now = new Date();
        const diffMs = now - commentTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeStr;
        if (diffMins < 1) {
            timeStr = 'Agora';
        } else if (diffMins < 60) {
            timeStr = `${diffMins}min atrás`;
        } else if (diffHours < 24) {
            timeStr = `${diffHours}h atrás`;
        } else if (diffDays < 7) {
            timeStr = `${diffDays}d atrás`;
        } else {
            timeStr = commentTime.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short'
            });
        }

        const timeSpan = document.createElement('span');
        timeSpan.className = 'comment-time';
        timeSpan.textContent = timeStr;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'comment-remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('aria-label', 'Remover comentário');

        removeBtn.addEventListener('click', () => {
            cactusMetadata.removeComment(cactusId, comment.id);
            commentItem.classList.add('removing');

            setTimeout(() => {
                // Remove from local array
                const idx = comments.findIndex(c => c.id === comment.id);
                if (idx > -1) comments.splice(idx, 1);

                commentItem.remove();

                // Update empty state
                if (listElement.querySelectorAll('.comment-item').length === 0) {
                    const empty = document.createElement('div');
                    empty.className = 'no-comments';
                    empty.innerHTML = 'Nenhum comentário ainda.<br>Seja o primeiro!';
                    listElement.appendChild(empty);
                }
            }, 250);
        });

        commentMeta.appendChild(timeSpan);
        commentMeta.appendChild(removeBtn);
        commentItem.appendChild(commentText);
        commentItem.appendChild(commentMeta);

        return commentItem;
    }

    // Add comment form FIRST (before comments list)
    const commentForm = document.createElement('form');
    commentForm.className = 'comment-form';

    // Input wrapper for floating char count
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'comment-input-wrapper';

    const textarea = document.createElement('textarea');
    textarea.className = 'comment-input';
    textarea.placeholder = 'Escreva seu comentário...';
    textarea.maxLength = 500;

    const charCount = document.createElement('div');
    charCount.className = 'char-count';
    charCount.textContent = '0/500';

    textarea.addEventListener('input', () => {
        const length = textarea.value.length;
        charCount.textContent = `${length}/500`;

        // Update char count style based on length
        charCount.classList.remove('warning', 'limit');
        if (length >= 450) {
            charCount.classList.add('limit');
        } else if (length >= 400) {
            charCount.classList.add('warning');
        }
    });

    inputWrapper.appendChild(textarea);
    inputWrapper.appendChild(charCount);

    // Form actions
    const formActions = document.createElement('div');
    formActions.className = 'comment-form-actions';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-comment-btn';
    submitBtn.textContent = 'Enviar';

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = textarea.value.trim();

        if (text) {
            // Add sending state
            submitBtn.classList.add('sending');
            submitBtn.textContent = '';

            // Simulate brief delay for UX
            setTimeout(() => {
                const newComment = cactusMetadata.addComment(cactusId, text);
                comments.push(newComment);

                // Remove no-comments message
                const noComments = commentsList.querySelector('.no-comments');
                if (noComments) noComments.remove();

                // Create and add new comment element
                const commentElement = createCommentElement(newComment, cactusId, commentsList);
                commentsList.appendChild(commentElement);

                // Scroll to new comment
                setTimeout(() => {
                    commentsList.scrollTop = commentsList.scrollHeight;
                }, 100);

                // Reset form
                textarea.value = '';
                charCount.textContent = '0/500';
                charCount.classList.remove('warning', 'limit');
                submitBtn.classList.remove('sending');
                submitBtn.textContent = 'Enviar';
                textarea.focus();
            }, 200);
        }
    });

    formActions.appendChild(submitBtn);
    commentForm.appendChild(inputWrapper);
    commentForm.appendChild(formActions);

    // Add form FIRST, then comments list
    commentsSection.appendChild(commentForm);
    renderComments();
    commentsSection.appendChild(commentsList);

    // Assemble modal
    contentWrapper.appendChild(header);
    contentWrapper.appendChild(ratingSection);
    contentWrapper.appendChild(commentsSection);
    modal.appendChild(contentWrapper);
    overlay.appendChild(modal);

    // Close on overlay click (but not on modal)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 300);
        }
    });

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 300);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Re-enable scroll when modal closes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.removedNodes) {
                mutation.removedNodes.forEach((node) => {
                    if (node === overlay) {
                        document.body.style.overflow = '';
                        observer.disconnect();
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true });

    document.body.appendChild(overlay);

    // Focus textarea after modal opens
    setTimeout(() => textarea.focus(), 400);
}

// Helper function to update card rating indicator (now updates card stars)
function updateCardRating(cactusId, rating) {
    // Update the stars in card footer
    updateCardStars(cactusId, rating);
}

// ============================================
// iOS KEYBOARD HANDLER (Visual Viewport API)
// ============================================

class iOSKeyboardHandler {
    constructor() {
        this.isKeyboardVisible = false;
        this.keyboardHeight = 0;
        this.initialViewportHeight = window.innerHeight;
        this.init();
    }

    init() {
        // Check if Visual Viewport API is available (iOS 13+)
        if (window.visualViewport) {
            console.log('📱 Visual Viewport API disponível - iOS keyboard handling ativado');

            // Use resize and scroll events
            window.visualViewport.addEventListener('resize', this.handleViewportChange.bind(this));
            window.visualViewport.addEventListener('scroll', this.handleViewportChange.bind(this));

            // Also listen for focus events on inputs
            document.addEventListener('focusin', this.handleFocusIn.bind(this));
            document.addEventListener('focusout', this.handleFocusOut.bind(this));
        } else {
            console.log('📱 Visual Viewport API não disponível');
        }

        // Set CSS custom property for initial viewport height
        this.updateCSSProperties(0);
    }

    handleViewportChange() {
        if (!window.visualViewport) return;

        const currentHeight = window.visualViewport.height;
        const offsetTop = window.visualViewport.offsetTop;

        // Calculate keyboard height
        // On iOS, when keyboard opens, visualViewport.height shrinks
        const heightDiff = this.initialViewportHeight - currentHeight - offsetTop;
        this.keyboardHeight = Math.max(0, heightDiff);

        // Determine if keyboard is visible (threshold of 100px to avoid false positives)
        const wasVisible = this.isKeyboardVisible;
        this.isKeyboardVisible = this.keyboardHeight > 100;

        // Update CSS custom property
        this.updateCSSProperties(this.isKeyboardVisible ? this.keyboardHeight : 0);

        // Add/remove class on body
        if (this.isKeyboardVisible && !wasVisible) {
            document.body.classList.add('keyboard-visible');
            console.log('⌨️ Keyboard aberto - altura:', this.keyboardHeight);
        } else if (!this.isKeyboardVisible && wasVisible) {
            document.body.classList.remove('keyboard-visible');
            console.log('⌨️ Keyboard fechado');
        }
    }

    handleFocusIn(e) {
        const isInput = e.target.matches('input, textarea, [contenteditable]');
        if (isInput) {
            document.body.classList.add('input-focused');
            // Small delay to let iOS open the keyboard
            setTimeout(() => this.handleViewportChange(), 300);
        }
    }

    handleFocusOut(e) {
        const isInput = e.target.matches('input, textarea, [contenteditable]');
        if (isInput) {
            // Delay to check if focus moved to another input
            setTimeout(() => {
                const activeEl = document.activeElement;
                if (!activeEl || !activeEl.matches('input, textarea, [contenteditable]')) {
                    document.body.classList.remove('input-focused');
                    this.updateCSSProperties(0);
                }
            }, 100);
        }
    }

    updateCSSProperties(keyboardHeight) {
        // Set CSS custom property for keyboard height
        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);

        // Also set safe keyboard offset (accounts for safe area)
        const safeOffset = keyboardHeight > 0 ? keyboardHeight : 0;
        document.documentElement.style.setProperty('--keyboard-offset', `${safeOffset}px`);
    }
}

// Initialize iOS keyboard handler
const iosKeyboardHandler = new iOSKeyboardHandler();

// ============================================
// MILESTONE SYSTEM
// ============================================

class MilestoneTracker {
    constructor() {
        this.milestones = [];
        this.container = document.createElement('div');
        this.container.className = 'milestones-container';
        document.body.appendChild(this.container);
    }

    showMilestone(message) {
        const milestone = document.createElement('div');
        milestone.className = 'milestone-notification';
        milestone.textContent = message;

        this.container.appendChild(milestone);

        // Trigger animation
        setTimeout(() => milestone.classList.add('show'), 10);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            milestone.classList.remove('show');
            setTimeout(() => milestone.remove(), 300);
        }, 3000);

        console.log('🏆 Milestone:', message);
    }

    trackAction(action, data) {
        const stats = cactusMetadata.getStats();
        const cactiCount = gardenState.getAll().length;

        // Different milestones based on action
        switch (action) {
            case 'rating':
                if (stats.totalRatings === 1) {
                    this.showMilestone('🌟 Primeiro cacto avaliado!');
                } else if (stats.totalRatings % 5 === 0) {
                    this.showMilestone(`🎉 ${stats.totalRatings} cactos avaliados!`);
                }
                break;

            case 'comment':
                if (stats.totalComments === 1) {
                    this.showMilestone('📝 Primeiro comentário adicionado!');
                } else if (stats.totalComments % 10 === 0) {
                    this.showMilestone(`💬 ${stats.totalComments} comentários no total!`);
                }
                break;

            case 'cactus-added':
                if (cactiCount === 1) {
                    this.showMilestone('🌵 Seu primeiro cacto plantado!');
                } else if (cactiCount % 5 === 0) {
                    this.showMilestone(`🌵 Você tem ${cactiCount} cactos agora!`);
                } else if (cactiCount % 10 === 0) {
                    this.showMilestone(`🚀 Incrível! ${cactiCount} cactos no jardim!`);
                }
                break;

            case 'cactus-removed':
                this.showMilestone('🗑️ Cacto removido');
                break;

            case 'avg-rating':
                if (stats.avgRating >= 4.5) {
                    this.showMilestone('⭐⭐⭐⭐⭐ Avaliação média excelente!');
                } else if (stats.avgRating >= 4) {
                    this.showMilestone('⭐⭐⭐⭐ Ótima avaliação média!');
                }
                break;
        }
    }
}

const milestoneTracker = new MilestoneTracker();

// Listen for milestone events
document.addEventListener('milestone', (e) => {
    const { message } = e.detail;
    if (message.includes('⭐')) {
        milestoneTracker.trackAction('rating');
    } else if (message.includes('💬')) {
        milestoneTracker.trackAction('comment');
    }
});

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

    // Create and add card to both containers (they'll show/hide based on screen size)
    const card = createCactusCard(cactusData);
    const activeContainer = getActiveContainer();
    activeContainer.appendChild(card);

    // Also add to fallback container for compatibility
    const cardClone = createCactusCard(cactusData);
    const inactiveContainer = activeContainer === cactusContainerDesktop ? cactusContainerMobile : cactusContainerDesktop;
    inactiveContainer.appendChild(cardClone);

    // Track milestone
    const cactiCount = gardenState.getAll().length;
    milestoneTracker.trackAction('cactus-added', { count: cactiCount });

    return cactusData;
}

function removeCactus(card, id) {
    card.classList.add('removing');

    setTimeout(() => {
        card.remove();
        gardenState.removeCactus(id);
        updateEmptyState();
        updateCounter();
        milestoneTracker.trackAction('cactus-removed');
    }, 400);
}

function updateEmptyState() {
    // Check both containers
    const desktopCards = cactusContainerDesktop.querySelectorAll('.cactus-card').length;
    const mobileCards = cactusContainerMobile.querySelectorAll('.cactus-card').length;
    const hasCards = desktopCards > 0 || mobileCards > 0;

    if (hasCards) {
        emptyStateDesktop?.classList.add('hidden');
        emptyStateMobile?.classList.add('hidden');
    } else {
        emptyStateDesktop?.classList.remove('hidden');
        emptyStateMobile?.classList.remove('hidden');
    }
}

function updateCounter() {
    // Count from both containers
    const desktopCount = cactusContainerDesktop.querySelectorAll('.cactus-card:not(.removing)').length;
    const mobileCount = cactusContainerMobile.querySelectorAll('.cactus-card:not(.removing)').length;
    const total = Math.max(desktopCount, mobileCount);
    cactusCount.textContent = total;
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
    // Clear from both containers
    const desktopCards = cactusContainerDesktop.querySelectorAll('.cactus-card');
    const mobileCards = cactusContainerMobile.querySelectorAll('.cactus-card');
    const allCards = Array.from(desktopCards).concat(Array.from(mobileCards));

    allCards.forEach((card, index) => {
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
                // Add to both containers for seamless mobile/desktop switching
                const cardDesktop = createCactusCard(cactusData);
                cactusContainerDesktop.appendChild(cardDesktop);

                const cardMobile = createCactusCard(cactusData);
                cactusContainerMobile.appendChild(cardMobile);

                updateEmptyState();
                updateCounter();
            }, index * 100);
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

// ============================================
// STATISTICS WIDGET
// ============================================

function createStatsWidget() {
    const widget = document.createElement('div');
    widget.className = 'stats-widget';
    widget.id = 'stats-widget';

    function updateStats() {
        const stats = cactusMetadata.getStats();
        const cactiCount = gardenState.getAll().length;

        widget.innerHTML = `
            <div class="stats-content">
                <div class="stat-item">
                    <span class="stat-icon">🌵</span>
                    <span class="stat-value">${cactiCount}</span>
                    <span class="stat-label">Cactos</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">⭐</span>
                    <span class="stat-value">${stats.totalRatings}</span>
                    <span class="stat-label">Avaliados</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">💬</span>
                    <span class="stat-value">${stats.totalComments}</span>
                    <span class="stat-label">Comentários</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">✨</span>
                    <span class="stat-value">${stats.avgRating}</span>
                    <span class="stat-label">Média</span>
                </div>
            </div>
        `;
    }

    updateStats();

    // Update stats whenever metadata changes
    const originalNotify = cactusMetadata.notifyMilestone;
    cactusMetadata.notifyMilestone = function(message) {
        originalNotify.call(this, message);
        updateStats();
    };

    return widget;
}

function init() {
    console.log('🌵 Cacto Garden v2.0 - Initializing...');

    // Create background particles
    createParticles();

    // Create stats widget
    const statsWidget = createStatsWidget();
    document.body.appendChild(statsWidget);

    // Restore garden from cache
    restoreGarden();

    // Update UI
    updateEmptyState();
    updateCounter();

    // Focus input
    inputText.focus();

    console.log('✅ Initialization complete!');
    console.log('📊 Stats widget created');
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

// Handle responsive container switching
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 640;
    const desktopShould = !isMobile;
    const mobileShould = isMobile;

    if (desktopShould) {
        cactusContainerDesktop.classList.remove('hidden');
        cactusContainerMobile.classList.add('hidden');
    } else {
        cactusContainerDesktop.classList.add('hidden');
        cactusContainerMobile.classList.remove('hidden');
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
