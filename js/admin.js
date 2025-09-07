/**
 * Admin panel functionality for FinancePro
 * Handles admin authentication, data management, and exports
 */

import { Storage, Toast } from './main.js';

class AdminPanel {
    constructor() {
        this.loginForm = document.getElementById('admin-login-form');
        this.loginSection = document.getElementById('admin-login');
        this.adminContent = document.getElementById('admin-content');
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Check if already authenticated
        this.checkAuthStatus();
    }

    checkAuthStatus() {
        const authStatus = Storage.get('adminAuth', false);
        if (authStatus && authStatus.expires > Date.now()) {
            this.showAdminContent();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(this.loginForm);
        const password = formData.get('password');
        
        // Demo password - replace with real authentication
        if (password === 'admin123') {
            this.authenticate();
        } else {
            window.toast.show({
                title: 'Invalid Password',
                description: 'Please check your admin password and try again.'
            }, 'error');
        }
    }

    authenticate() {
        // Set authentication status (expires in 24 hours)
        const authData = {
            authenticated: true,
            expires: Date.now() + (24 * 60 * 60 * 1000)
        };
        Storage.set('adminAuth', authData);
        
        this.showAdminContent();
        
        window.toast.show({
            title: 'Admin Access Granted',
            description: 'Welcome to the admin panel.'
        }, 'success');
    }

    showAdminContent() {
        this.loginSection.style.display = 'none';
        this.adminContent.style.display = 'block';
        this.isAuthenticated = true;
        
        this.loadAdminData();
    }

    loadAdminData() {
        this.loadLeads();
        this.loadBookings();
        this.loadBlogPosts();
    }

    loadLeads() {
        const leads = Storage.get('leads', []);
        const leadsList = document.getElementById('leads-list');
        
        if (leads.length === 0) {
            leadsList.innerHTML = '<p>No leads found</p>';
            return;
        }

        leadsList.innerHTML = leads.map(lead => `
            <div style="border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1rem;">
                <h4>${lead.name}</h4>
                <p><strong>Email:</strong> ${lead.email}</p>
                <p><strong>Phone:</strong> ${lead.phone || 'N/A'}</p>
                <p><strong>Company:</strong> ${lead.company || 'N/A'}</p>
                <p><strong>Subject:</strong> ${lead.subject}</p>
                <p><strong>Date:</strong> ${new Date(lead.createdAt).toLocaleDateString()}</p>
                <p><strong>Message:</strong> ${lead.message}</p>
            </div>
        `).join('');
    }

    loadBookings() {
        const bookings = Storage.get('bookings', []);
        const bookingsList = document.getElementById('bookings-list');
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>No bookings found</p>';
            return;
        }

        bookingsList.innerHTML = bookings.map(booking => `
            <div style="border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1rem;">
                <h4>${booking.name}</h4>
                <p><strong>Email:</strong> ${booking.email}</p>
                <p><strong>Phone:</strong> ${booking.phone}</p>
                <p><strong>Company:</strong> ${booking.company || 'N/A'}</p>
                <p><strong>Service:</strong> ${booking.service}</p>
                <p><strong>Date:</strong> ${booking.preferredDate}</p>
                <p><strong>Time:</strong> ${booking.preferredTime}</p>
                <p><strong>Status:</strong> <span style="color: var(--color-primary);">${booking.status}</span></p>
                <p><strong>Message:</strong> ${booking.message || 'N/A'}</p>
            </div>
        `).join('');
    }

    loadBlogPosts() {
        const blogPosts = Storage.get('blogPosts', []);
        const blogPostsAdmin = document.getElementById('blog-posts-admin');
        
        if (blogPosts.length === 0) {
            blogPostsAdmin.innerHTML = '<p>No blog posts found</p>';
            return;
        }

        blogPostsAdmin.innerHTML = blogPosts.map(post => `
            <div style="border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1rem;">
                <h4>${post.title}</h4>
                <p><strong>Category:</strong> ${post.category}</p>
                <p><strong>Published:</strong> ${post.published ? 'Yes' : 'No'}</p>
                <p><strong>Date:</strong> ${new Date(post.createdAt).toLocaleDateString()}</p>
                <p><strong>Excerpt:</strong> ${post.excerpt}</p>
            </div>
        `).join('');
    }
}

// Export functions for global access
window.exportLeads = function() {
    const leads = Storage.get('leads', []);
    if (leads.length === 0) {
        window.toast.show({
            title: 'No Data',
            description: 'No leads to export.'
        }, 'warning');
        return;
    }
    
    const csv = convertToCSV(leads);
    downloadCSV(csv, 'leads.csv');
    
    window.toast.show({
        title: 'Export Complete',
        description: `${leads.length} leads exported successfully.`
    }, 'success');
};

window.exportBookings = function() {
    const bookings = Storage.get('bookings', []);
    if (bookings.length === 0) {
        window.toast.show({
            title: 'No Data',
            description: 'No bookings to export.'
        }, 'warning');
        return;
    }
    
    const csv = convertToCSV(bookings);
    downloadCSV(csv, 'bookings.csv');
    
    window.toast.show({
        title: 'Export Complete',
        description: `${bookings.length} bookings exported successfully.`
    }, 'success');
};

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});
