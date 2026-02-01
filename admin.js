/**
 * Cacto Garden - Admin Dashboard
 * Mobile-first minimal admin panel for managing comments and reviews
 */

// ============================================
// CONFIGURATION
// ============================================

const ADMIN_CONFIG = {
    // Simple password protection (for demo purposes)
    // In production, use proper authentication!
    password: 'cacto2024',
    sessionKey: 'cacto_admin_session',
    sessionDuration: 24 * 60 * 60 * 1000 // 24 hours
};

// ============================================
// ADMIN STATE
// ============================================

const adminState = {
    isAuthenticated: false,
    comments: [],
    reviews: [],
    stats: {
        totalReviews: 0,
        totalComments: 0,
        avgRating: 0,
        totalSpecies: 0
    },
    currentModal: null,
    searchQuery: '',
    ratingFilter: 'all'
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    loginScreen: document.getElementById('loginScreen'),
    adminContainer: document.getElementById('adminContainer'),
    loginForm: document.getElementById('loginForm'),
    loginError: document.getElementById('loginError'),
    adminPassword: document.getElementById('adminPassword'),
    logoutBtn: document.getElementById('logoutBtn'),

    // Stats
    totalReviews: document.getElementById('totalReviews'),
    totalComments: document.getElementById('totalComments'),
    avgRating: document.getElementById('avgRating'),
    totalSpecies: document.getElementById('totalSpecies'),

    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    commentsBadge: document.getElementById('commentsBadge'),
    reviewsBadge: document.getElementById('reviewsBadge'),

    // Lists
    commentsList: document.getElementById('commentsList'),
    reviewsList: document.getElementById('reviewsList'),

    // Filters
    searchComments: document.getElementById('searchComments'),
    searchReviews: document.getElementById('searchReviews'),
    ratingFilter: document.getElementById('ratingFilter'),
    refreshComments: document.getElementById('refreshComments'),

    // Modal
    actionModal: document.getElementById('actionModal'),
    modalTitle: document.getElementById('modalTitle'),
    modalBody: document.getElementById('modalBody'),
    modalClose: document.getElementById('modalClose'),
    modalCancel: document.getElementById('modalCancel'),
    modalConfirm: document.getElementById('modalConfirm'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
};

// ============================================
// AUTHENTICATION
// ============================================

function checkSession() {
    const session = localStorage.getItem(ADMIN_CONFIG.sessionKey);
    if (session) {
        const { timestamp } = JSON.parse(session);
        if (Date.now() - timestamp < ADMIN_CONFIG.sessionDuration) {
            adminState.isAuthenticated = true;
            showDashboard();
            return true;
        }
        localStorage.removeItem(ADMIN_CONFIG.sessionKey);
    }
    return false;
}

function login(password) {
    if (password === ADMIN_CONFIG.password) {
        adminState.isAuthenticated = true;
        localStorage.setItem(ADMIN_CONFIG.sessionKey, JSON.stringify({
            timestamp: Date.now()
        }));
        showDashboard();
        return true;
    }
    return false;
}

function logout() {
    adminState.isAuthenticated = false;
    localStorage.removeItem(ADMIN_CONFIG.sessionKey);
    showLogin();
}

function showLogin() {
    elements.loginScreen.style.display = 'flex';
    elements.adminContainer.style.display = 'none';
    elements.adminPassword.value = '';
    elements.loginError.textContent = '';
}

function showDashboard() {
    elements.loginScreen.style.display = 'none';
    elements.adminContainer.style.display = 'flex';
    loadData();
}

// ============================================
// DATA LOADING
// ============================================

async function loadData() {
    await Promise.all([
        loadStats(),
        loadComments(),
        loadReviews()
    ]);
}

async function loadStats() {
    try {
        // Get stats from Supabase
        const statsResponse = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/global_stats`,
            {
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
                }
            }
        );

        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            if (stats && stats[0]) {
                adminState.stats = {
                    totalReviews: stats[0].total_reviews || 0,
                    totalComments: stats[0].total_comments || 0,
                    avgRating: parseFloat(stats[0].avg_rating || 0).toFixed(1),
                    totalSpecies: stats[0].unique_species_reviewed || 0
                };
            }
        }

        updateStatsDisplay();
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadComments() {
    try {
        showLoadingState(elements.commentsList, 'comentários');

        // Get ALL comments (including hidden ones for admin)
        const response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/cactus_comments?order=created_at.desc`,
            {
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
                }
            }
        );

        if (response.ok) {
            adminState.comments = await response.json();
            renderComments();
            updateBadge(elements.commentsBadge, adminState.comments.length);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
        showEmptyState(elements.commentsList, 'Erro ao carregar comentários');
    }
}

async function loadReviews() {
    try {
        showLoadingState(elements.reviewsList, 'avaliações');

        const response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/cactus_reviews?order=created_at.desc`,
            {
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
                }
            }
        );

        if (response.ok) {
            adminState.reviews = await response.json();
            renderReviews();
            updateBadge(elements.reviewsBadge, adminState.reviews.length);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        showEmptyState(elements.reviewsList, 'Erro ao carregar avaliações');
    }
}

// ============================================
// RENDERING
// ============================================

function updateStatsDisplay() {
    elements.totalReviews.textContent = adminState.stats.totalReviews;
    elements.totalComments.textContent = adminState.stats.totalComments;
    elements.avgRating.textContent = adminState.stats.avgRating;
    elements.totalSpecies.textContent = adminState.stats.totalSpecies;

    // Animate numbers
    document.querySelectorAll('.stat-number').forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = 'fadeIn 0.3s ease';
    });
}

function renderComments() {
    const query = elements.searchComments.value.toLowerCase();
    const filtered = adminState.comments.filter(comment =>
        comment.comment_text.toLowerCase().includes(query) ||
        (comment.user_name && comment.user_name.toLowerCase().includes(query))
    );

    if (filtered.length === 0) {
        showEmptyState(elements.commentsList, query ? 'Nenhum comentário encontrado' : 'Nenhum comentário ainda');
        return;
    }

    elements.commentsList.innerHTML = filtered.map(comment => createCommentCard(comment)).join('');
    attachCommentListeners();
}

function renderReviews() {
    const query = elements.searchReviews.value.toLowerCase();
    const ratingFilter = elements.ratingFilter.value;

    let filtered = adminState.reviews.filter(review =>
        (review.species_name && review.species_name.toLowerCase().includes(query)) ||
        review.species_id.toLowerCase().includes(query)
    );

    if (ratingFilter !== 'all') {
        filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    if (filtered.length === 0) {
        showEmptyState(elements.reviewsList, query || ratingFilter !== 'all' ? 'Nenhuma avaliação encontrada' : 'Nenhuma avaliação ainda');
        return;
    }

    elements.reviewsList.innerHTML = filtered.map(review => createReviewCard(review)).join('');
    attachReviewListeners();
}

function createCommentCard(comment) {
    const date = new Date(comment.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const isHidden = !comment.is_visible;

    return `
        <div class="comment-card ${isHidden ? 'hidden-item' : ''}" data-id="${comment.id}">
            <div class="card-header">
                <div class="card-info">
                    <div class="card-title">
                        <span>${comment.user_name || 'Anônimo'}</span>
                        <span class="status-badge ${isHidden ? 'hidden' : 'visible'}">
                            ${isHidden ? 'Oculto' : 'Visível'}
                        </span>
                    </div>
                    <div class="card-meta">
                        <span>📅 ${date}</span>
                        <span>🌵 ${comment.cactus_id.substring(0, 8)}...</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn hide" data-action="toggle-visibility" data-id="${comment.id}" title="${isHidden ? 'Mostrar' : 'Ocultar'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${isHidden
                                ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
                                : '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
                            }
                        </svg>
                    </button>
                    <button class="action-btn delete" data-action="delete-comment" data-id="${comment.id}" title="Excluir">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <p class="comment-text">${escapeHtml(comment.comment_text)}</p>
            </div>
        </div>
    `;
}

function createReviewCard(review) {
    const date = new Date(review.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    const stars = Array(5).fill(0).map((_, i) =>
        `<span class="star ${i < review.rating ? 'filled' : ''}">★</span>`
    ).join('');

    return `
        <div class="review-card" data-id="${review.id}">
            <div class="card-header">
                <div class="card-info">
                    <div class="card-title">
                        <span>${review.species_name || review.species_id}</span>
                        <div class="stars-display">${stars}</div>
                    </div>
                    <div class="card-meta">
                        <span>📅 ${date}</span>
                        <span>🌵 ${review.cactus_id.substring(0, 8)}...</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn delete" data-action="delete-review" data-id="${review.id}" title="Excluir">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showLoadingState(container, type) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="loader"></div>
            <p>Carregando ${type}...</p>
        </div>
    `;
}

function showEmptyState(container, message) {
    container.innerHTML = `
        <div class="empty-state">
            <span class="empty-icon">🌵</span>
            <p>${message}</p>
        </div>
    `;
}

function updateBadge(badge, count) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
}

// ============================================
// ACTIONS
// ============================================

async function toggleCommentVisibility(commentId) {
    const comment = adminState.comments.find(c => c.id === commentId);
    if (!comment) return;

    const newVisibility = !comment.is_visible;

    try {
        const response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/cactus_comments?id=eq.${commentId}`,
            {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ is_visible: newVisibility })
            }
        );

        if (response.ok) {
            comment.is_visible = newVisibility;
            renderComments();
            showToast(
                newVisibility ? 'Comentário visível novamente' : 'Comentário ocultado',
                'success'
            );
        }
    } catch (error) {
        console.error('Error toggling visibility:', error);
        showToast('Erro ao alterar visibilidade', 'error');
    }
}

async function deleteComment(commentId) {
    try {
        const response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/cactus_comments?id=eq.${commentId}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
                }
            }
        );

        if (response.ok) {
            adminState.comments = adminState.comments.filter(c => c.id !== commentId);
            renderComments();
            updateBadge(elements.commentsBadge, adminState.comments.length);
            loadStats();
            showToast('Comentário excluído', 'success');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        showToast('Erro ao excluir comentário', 'error');
    }
}

async function deleteReview(reviewId) {
    try {
        const response = await fetch(
            `${SUPABASE_CONFIG.url}/rest/v1/cactus_reviews?id=eq.${reviewId}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
                }
            }
        );

        if (response.ok) {
            adminState.reviews = adminState.reviews.filter(r => r.id !== reviewId);
            renderReviews();
            updateBadge(elements.reviewsBadge, adminState.reviews.length);
            loadStats();
            showToast('Avaliação excluída', 'success');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        showToast('Erro ao excluir avaliação', 'error');
    }
}

// ============================================
// MODAL
// ============================================

function showModal(title, body, onConfirm) {
    elements.modalTitle.textContent = title;
    elements.modalBody.innerHTML = body;
    adminState.currentModal = { onConfirm };
    elements.actionModal.classList.add('active');
}

function hideModal() {
    elements.actionModal.classList.remove('active');
    adminState.currentModal = null;
}

function confirmDeleteComment(comment) {
    showModal(
        'Excluir comentário?',
        `
            <p>Tem certeza que deseja excluir este comentário?</p>
            <div class="modal-preview">"${escapeHtml(comment.comment_text)}"</div>
            <p style="margin-top: var(--space-md); color: var(--danger); font-size: 0.8rem;">
                Esta ação não pode ser desfeita.
            </p>
        `,
        () => deleteComment(comment.id)
    );
}

function confirmDeleteReview(review) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    showModal(
        'Excluir avaliação?',
        `
            <p>Tem certeza que deseja excluir esta avaliação?</p>
            <div class="modal-preview">
                <strong>${review.species_name || review.species_id}</strong><br>
                <span style="color: var(--sand-dark);">${stars}</span>
            </div>
            <p style="margin-top: var(--space-md); color: var(--danger); font-size: 0.8rem;">
                Esta ação não pode ser desfeita.
            </p>
        `,
        () => deleteReview(review.id)
    );
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '✕'}</span>
        <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachCommentListeners() {
    elements.commentsList.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            const comment = adminState.comments.find(c => c.id === id);

            if (action === 'toggle-visibility') {
                toggleCommentVisibility(id);
            } else if (action === 'delete-comment' && comment) {
                confirmDeleteComment(comment);
            }
        });
    });
}

function attachReviewListeners() {
    elements.reviewsList.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            const review = adminState.reviews.find(r => r.id === id);

            if (action === 'delete-review' && review) {
                confirmDeleteReview(review);
            }
        });
    });
}

function initEventListeners() {
    // Login form
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = elements.adminPassword.value;

        if (!login(password)) {
            elements.loginError.textContent = 'Senha incorreta';
            elements.adminPassword.value = '';
            elements.adminPassword.focus();
        }
    });

    // Logout
    elements.logoutBtn.addEventListener('click', logout);

    // Tab switching
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;

            elements.tabBtns.forEach(b => b.classList.remove('active'));
            elements.tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${tab}Tab`).classList.add('active');
        });
    });

    // Search comments
    elements.searchComments.addEventListener('input', debounce(() => {
        renderComments();
    }, 300));

    // Search reviews
    elements.searchReviews.addEventListener('input', debounce(() => {
        renderReviews();
    }, 300));

    // Rating filter
    elements.ratingFilter.addEventListener('change', () => {
        renderReviews();
    });

    // Refresh button
    elements.refreshComments.addEventListener('click', () => {
        loadComments();
        loadStats();
    });

    // Modal events
    elements.modalClose.addEventListener('click', hideModal);
    elements.modalCancel.addEventListener('click', hideModal);
    elements.modalConfirm.addEventListener('click', () => {
        if (adminState.currentModal && adminState.currentModal.onConfirm) {
            adminState.currentModal.onConfirm();
        }
        hideModal();
    });

    // Close modal on backdrop click
    elements.actionModal.addEventListener('click', (e) => {
        if (e.target === elements.actionModal) {
            hideModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.actionModal.classList.contains('active')) {
            hideModal();
        }
    });
}

// ============================================
// UTILITIES
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();

    // Check for existing session
    if (!checkSession()) {
        showLogin();
    }
});
