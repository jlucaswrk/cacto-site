/**
 * Supabase Configuration for Cacto Garden
 *
 * IMPORTANTE: Substitua pelos seus valores reais do Supabase!
 * Você pode encontrar essas informações em:
 * https://app.supabase.com/project/{project-id}/settings/api
 */

// Configuração do Supabase (valores públicos - seguros para frontend)
const SUPABASE_CONFIG = {
    url: 'https://adlunhrnrchtyngnqbvk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkbHVuaHJucmNodHluZ25xYnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTUyNzgsImV4cCI6MjA4NTM5MTI3OH0.Uj4Yx3z8KSCszbweVUp3S_T9qDlRkXO6dWCdwRSU-OE'
};

// ============================================
// SUPABASE CLIENT HELPER
// ============================================

class SupabaseClient {
    constructor(config) {
        this.url = config.url;
        this.anonKey = config.anonKey;
        this.headers = {
            'apikey': this.anonKey,
            'Authorization': `Bearer ${this.anonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    // Método genérico para requisições
    async request(table, method = 'GET', data = null, query = '') {
        const url = `${this.url}/rest/v1/${table}${query}`;
        const options = {
            method,
            headers: this.headers
        };

        if (data && (method === 'POST' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Supabase error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Supabase request failed:', error);
            throw error;
        }
    }

    // ============================================
    // REVIEWS API
    // ============================================

    async getReviews(cactusId) {
        return this.request('cactus_reviews', 'GET', null, `?cactus_id=eq.${cactusId}`);
    }

    async createReview(reviewData) {
        return this.request('cactus_reviews', 'POST', reviewData);
    }

    async updateReview(reviewId, updateData) {
        return this.request('cactus_reviews', 'PATCH', updateData, `?id=eq.${reviewId}`);
    }

    async upsertReview(reviewData) {
        // Usar upsert para criar ou atualizar
        const headers = { ...this.headers, 'Prefer': 'resolution=merge-duplicates,return=representation' };
        const url = `${this.url}/rest/v1/cactus_reviews`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(reviewData)
            });
            return await response.json();
        } catch (error) {
            console.error('Upsert review failed:', error);
            throw error;
        }
    }

    // ============================================
    // COMMENTS API
    // ============================================

    async getComments(cactusId) {
        return this.request('cactus_comments', 'GET', null,
            `?cactus_id=eq.${cactusId}&is_visible=eq.true&order=created_at.desc`);
    }

    async createComment(commentData) {
        return this.request('cactus_comments', 'POST', commentData);
    }

    async deleteComment(commentId) {
        return this.request('cactus_comments', 'DELETE', null, `?id=eq.${commentId}`);
    }

    // ============================================
    // STATS API
    // ============================================

    async getGlobalStats() {
        return this.request('global_stats', 'GET');
    }

    async getSpeciesPopularity(limit = 10) {
        return this.request('species_popularity', 'GET', null,
            `?order=times_planted.desc&limit=${limit}`);
    }

    async incrementSpeciesPlanted(speciesId) {
        // Incrementar contador de espécie plantada
        const current = await this.request('species_popularity', 'GET', null,
            `?species_id=eq.${speciesId}`);

        if (current && current[0]) {
            return this.request('species_popularity', 'PATCH', {
                times_planted: current[0].times_planted + 1,
                last_planted: new Date().toISOString()
            }, `?species_id=eq.${speciesId}`);
        }
        return null;
    }
}

// Exportar instância singleton
const supabase = new SupabaseClient(SUPABASE_CONFIG);

// Exemplo de uso:
//
// // Criar uma avaliação
// await supabase.createReview({
//     cactus_id: 'unique-cactus-id',
//     species_id: 'saguaro',
//     species_name: 'Saguaro',
//     rating: 5,
//     user_session_id: 'session-123'
// });
//
// // Adicionar comentário
// await supabase.createComment({
//     cactus_id: 'unique-cactus-id',
//     comment_text: 'Lindo cacto!',
//     user_session_id: 'session-123'
// });
//
// // Buscar estatísticas
// const stats = await supabase.getGlobalStats();
