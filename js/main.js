/**
 * Main JavaScript module for FinancePro website
 * Handles navigation, UI interactions, and common functionality
 */

// Navigation functionality
class Navigation {
    constructor() {
        this.toggle = document.querySelector('.nav__toggle');
        this.menu = document.querySelector('.nav__menu');
        this.init();
    }

    init() {
        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav')) {
                    this.closeMenu();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMenu();
                }
            });
        }
    }

    toggleMenu() {
        const isOpen = this.menu.classList.contains('nav__menu--open');
        
        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.menu.classList.add('nav__menu--open');
        this.toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.menu.classList.remove('nav__menu--open');
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}

// Toast notification system
class Toast {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 1rem;
                right: 1rem;
                z-index: 1070;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="toast__content">
                <div class="toast__icon">${icon}</div>
                <div class="toast__message">
                    <div class="toast__title">${message.title || 'Notification'}</div>
                    ${message.description ? `<div class="toast__description">${message.description}</div>` : ''}
                </div>
                <button class="toast__close" onclick="this.parentElement.parentElement.remove()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `;

        this.container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('toast--show'), 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('toast--show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };
        return icons[type] || icons.info;
    }
}

// Form validation utility
class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Real-time validation
            const inputs = this.form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    addRule(fieldName, rule) {
        this.rules[fieldName] = rule;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const rule = this.rules[fieldName];

        if (!rule) return true;

        const isValid = rule.validate(value);
        
        if (!isValid) {
            this.showFieldError(field, rule.message);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('form-input--error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('form-input--error');
        
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.form.dispatchEvent(new CustomEvent('form:valid', {
                detail: { formData: new FormData(this.form) }
            }));
        }
    }
}

// Local storage utility
class Storage {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }

    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    new Navigation();
    
    // Initialize toast system
    window.toast = new Toast();
    
    // Initialize form validation for all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const validator = new FormValidator(form);
        
        // Add common validation rules
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
            validator.addRule('email', {
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            });
        }

        const phoneInput = form.querySelector('input[type="tel"]');
        if (phoneInput) {
            validator.addRule('phone', {
                validate: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
                message: 'Please enter a valid phone number'
            });
        }

        const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        requiredInputs.forEach(input => {
            validator.addRule(input.name, {
                validate: (value) => value.trim().length > 0,
                message: 'This field is required'
            });
        });
    });
});

// Export for use in other modules
export { Navigation, Toast, FormValidator, Storage };
