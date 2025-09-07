/**
 * Blog renderer for FinancePro
 * Handles loading and displaying blog posts
 */

import { Storage } from './main.js';

class BlogRenderer {
    constructor() {
        this.postsContainer = document.getElementById('blog-posts');
        this.searchInput = document.getElementById('search-input');
        this.posts = [];
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupSearch();
    }

    async loadPosts() {
        try {
            // Try to load from localStorage first
            this.posts = Storage.get('blogPosts', []);
            
            // If no posts in localStorage, load sample posts
            if (this.posts.length === 0) {
                this.posts = await this.loadSamplePosts();
                Storage.set('blogPosts', this.posts);
            }
            
            this.renderPosts(this.posts);
        } catch (error) {
            console.error('Error loading posts:', error);
            this.renderError();
        }
    }

    async loadSamplePosts() {
        // Sample blog posts data
        return [
            {
                id: 'post-1',
                title: '5 Essential Financial Planning Strategies for Small Businesses',
                excerpt: 'Learn the key financial planning strategies that can help your small business thrive and grow sustainably.',
                content: 'Financial planning is crucial for small business success...',
                category: 'Financial Planning',
                tags: ['small business', 'financial planning', 'strategy'],
                author: 'FinancePro Team',
                publishedAt: '2024-01-15',
                published: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'post-2',
                title: 'Investment Diversification: Building a Strong Portfolio',
                excerpt: 'Discover how to diversify your business investments to minimize risk and maximize returns.',
                content: 'Investment diversification is a fundamental principle...',
                category: 'Investment Guidance',
                tags: ['investment', 'diversification', 'portfolio'],
                author: 'FinancePro Team',
                publishedAt: '2024-01-10',
                published: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'post-3',
                title: 'Tax Optimization Strategies for Business Growth',
                excerpt: 'Maximize your business deductions and minimize tax liabilities with these proven strategies.',
                content: 'Tax optimization is essential for business growth...',
                category: 'Tax Management',
                tags: ['tax optimization', 'deductions', 'business growth'],
                author: 'FinancePro Team',
                publishedAt: '2024-01-05',
                published: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'post-4',
                title: 'Securing Business Loans: A Complete Guide',
                excerpt: 'Everything you need to know about securing business loans for expansion and growth.',
                content: 'Securing business loans can be challenging...',
                category: 'Business Loans',
                tags: ['business loans', 'financing', 'expansion'],
                author: 'FinancePro Team',
                publishedAt: '2024-01-01',
                published: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    renderPosts(posts) {
        if (!this.postsContainer) return;
        
        if (posts.length === 0) {
            this.postsContainer.innerHTML = '<p>No blog posts found.</p>';
            return;
        }

        this.postsContainer.innerHTML = posts.map(post => this.createPostCard(post)).join('');
    }

    createPostCard(post) {
        return `
            <div class="service-card">
                <div class="service-card__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    </svg>
                </div>
                <h3 class="service-card__title">${post.title}</h3>
                <p class="service-card__description">${post.excerpt}</p>
                <div style="margin-bottom: 1rem;">
                    <span style="background: var(--color-primary); color: white; padding: 0.25rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem;">${post.category}</span>
                </div>
                <div style="font-size: 0.875rem; color: var(--color-gray-600); margin-bottom: 1rem;">
                    By ${post.author} • ${new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <a href="/post.html?id=${post.id}" class="service-card__link">Read More</a>
            </div>
        `;
    }

    setupSearch() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filteredPosts = this.posts.filter(post => 
                    post.title.toLowerCase().includes(query) ||
                    post.excerpt.toLowerCase().includes(query) ||
                    post.category.toLowerCase().includes(query) ||
                    post.tags.some(tag => tag.toLowerCase().includes(query))
                );
                this.renderPosts(filteredPosts);
            });
        }
    }

    renderError() {
        if (this.postsContainer) {
            this.postsContainer.innerHTML = '<p>Error loading blog posts. Please try again later.</p>';
        }
    }
}

// Initialize blog renderer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogRenderer();
});
