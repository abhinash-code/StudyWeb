/**
 * Payment integration for FinancePro
 * Supports Stripe, Razorpay, and PayPal with demo mode
 */

import { Storage, Toast } from './main.js';

class PaymentManager {
    constructor() {
        this.isDemoMode = true; // Set to false for production
        this.stripe = null;
        this.razorpay = null;
        this.init();
    }

    init() {
        this.loadPaymentScripts();
        this.setupPaymentForms();
    }

    async loadPaymentScripts() {
        if (!this.isDemoMode) {
            // Load Stripe
            if (window.Stripe) {
                this.stripe = Stripe('pk_test_your_stripe_publishable_key');
            }

            // Load Razorpay
            if (window.Razorpay) {
                this.razorpay = window.Razorpay;
            }
        }
    }

    setupPaymentForms() {
        // Handle payment form submissions
        const paymentForms = document.querySelectorAll('[data-payment-form]');
        paymentForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handlePaymentSubmission(e));
        });
    }

    async handlePaymentSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const paymentData = {
            amount: parseFloat(formData.get('amount')),
            currency: formData.get('currency') || 'USD',
            service: formData.get('service'),
            customerEmail: formData.get('email'),
            customerName: formData.get('name')
        };

        const paymentMethod = formData.get('payment-method');

        try {
            if (this.isDemoMode) {
                await this.processDemoPayment(paymentData);
            } else {
                switch (paymentMethod) {
                    case 'stripe':
                        await this.processStripePayment(paymentData);
                        break;
                    case 'razorpay':
                        await this.processRazorpayPayment(paymentData);
                        break;
                    case 'paypal':
                        await this.processPayPalPayment(paymentData);
                        break;
                    default:
                        throw new Error('Invalid payment method');
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            window.toast.show({
                title: 'Payment Failed',
                description: error.message || 'Please try again or contact support.'
            }, 'error');
        }
    }

    async processDemoPayment(paymentData) {
        // Simulate payment processing
        const submitBtn = document.querySelector('[data-payment-form] button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = '<span class="loading"><span class="loading__spinner"></span>Processing...</span>';
        submitBtn.disabled = true;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create payment record
        const payment = {
            id: this.generatePaymentId(),
            ...paymentData,
            status: 'completed',
            method: 'demo',
            transactionId: 'demo_' + Date.now(),
            createdAt: new Date().toISOString()
        };

        // Store payment
        this.savePayment(payment);

        // Show success
        window.toast.show({
            title: 'Payment Successful!',
            description: `Payment of $${paymentData.amount} processed successfully.`
        }, 'success');

        // Generate invoice
        this.generateInvoice(payment);

        // Reset form
        const form = document.querySelector('[data-payment-form]');
        form.reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }

    async processStripePayment(paymentData) {
        if (!this.stripe) {
            throw new Error('Stripe not loaded');
        }

        // Create payment intent on your server
        const response = await fetch('/api/payments/create-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });

        const { clientSecret } = await response.json();

        // Confirm payment
        const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: this.stripe.elements().create('card'),
                billing_details: {
                    name: paymentData.customerName,
                    email: paymentData.customerEmail,
                },
            }
        });

        if (error) {
            throw new Error(error.message);
        }

        // Save successful payment
        const payment = {
            id: this.generatePaymentId(),
            ...paymentData,
            status: 'completed',
            method: 'stripe',
            transactionId: paymentIntent.id,
            createdAt: new Date().toISOString()
        };

        this.savePayment(payment);
        this.generateInvoice(payment);
    }

    async processRazorpayPayment(paymentData) {
        if (!this.razorpay) {
            throw new Error('Razorpay not loaded');
        }

        const options = {
            key: 'rzp_test_your_razorpay_key_id',
            amount: paymentData.amount * 100, // Amount in paise
            currency: paymentData.currency === 'USD' ? 'INR' : paymentData.currency,
            name: 'FinancePro',
            description: paymentData.service,
            image: '/images/logo.svg',
            order_id: await this.createRazorpayOrder(paymentData),
            handler: (response) => {
                // Payment successful
                const payment = {
                    id: this.generatePaymentId(),
                    ...paymentData,
                    status: 'completed',
                    method: 'razorpay',
                    transactionId: response.razorpay_payment_id,
                    createdAt: new Date().toISOString()
                };

                this.savePayment(payment);
                this.generateInvoice(payment);

                window.toast.show({
                    title: 'Payment Successful!',
                    description: `Payment of ₹${paymentData.amount} processed successfully.`
                }, 'success');
            },
            prefill: {
                name: paymentData.customerName,
                email: paymentData.customerEmail,
            },
            theme: {
                color: '#1E40AF'
            }
        };

        const razorpayInstance = new this.razorpay(options);
        razorpayInstance.open();
    }

    async processPayPalPayment(paymentData) {
        // PayPal integration would go here
        // This requires PayPal SDK and server-side integration
        throw new Error('PayPal integration not implemented yet');
    }

    async createRazorpayOrder(paymentData) {
        const response = await fetch('/api/payments/razorpay-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });

        const { orderId } = await response.json();
        return orderId;
    }

    savePayment(payment) {
        const payments = Storage.get('payments', []);
        payments.push(payment);
        Storage.set('payments', payments);
    }

    generatePaymentId() {
        return 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateInvoice(payment) {
        // Create invoice HTML for printing/downloading
        const invoiceHTML = `
            <html>
                <head>
                    <title>Invoice - FinancePro</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .invoice-details { margin-bottom: 20px; }
                        .invoice-details h3 { color: #1E40AF; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                        .total { font-weight: bold; font-size: 1.2em; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>FinancePro</h1>
                        <h2>Invoice</h2>
                        <p>Invoice #: ${payment.id}</p>
                        <p>Date: ${new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="invoice-details">
                        <h3>Bill To:</h3>
                        <p>${payment.customerName}</p>
                        <p>${payment.customerEmail}</p>
                    </div>
                    
                    <table>
                        <tr>
                            <th>Service</th>
                            <th>Amount</th>
                        </tr>
                        <tr>
                            <td>${payment.service}</td>
                            <td>$${payment.amount}</td>
                        </tr>
                        <tr class="total">
                            <td>Total</td>
                            <td>$${payment.amount}</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 30px;">
                        <p><strong>Payment Method:</strong> ${payment.method.toUpperCase()}</p>
                        <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                        <p><strong>Status:</strong> ${payment.status.toUpperCase()}</p>
                    </div>
                </body>
            </html>
        `;

        // Open invoice in new window for printing
        const printWindow = window.open('', '_blank');
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.print();
    }
}

// Payment form HTML template (to be added to pages)
const paymentFormHTML = `
    <form data-payment-form class="payment-form">
        <div class="form-group">
            <label class="form-label" for="service">Service</label>
            <select class="form-select" id="service" name="service" required>
                <option value="">Select a service</option>
                <option value="financial-planning">Financial Planning Consultation</option>
                <option value="investment-guidance">Investment Guidance Session</option>
                <option value="tax-management">Tax Management Services</option>
                <option value="business-loans">Business Loan Advisory</option>
            </select>
        </div>

        <div class="form-group">
            <label class="form-label" for="amount">Amount ($)</label>
            <input type="number" class="form-input" id="amount" name="amount" min="50" max="5000" required>
        </div>

        <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <input type="text" class="form-input" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input type="email" class="form-input" id="email" name="email" required>
        </div>

        <div class="form-group">
            <label class="form-label">Payment Method</label>
            <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                <label class="form-checkbox">
                    <input type="radio" name="payment-method" value="stripe" required>
                    <span>Stripe</span>
                </label>
                <label class="form-checkbox">
                    <input type="radio" name="payment-method" value="razorpay" required>
                    <span>Razorpay</span>
                </label>
                <label class="form-checkbox">
                    <input type="radio" name="payment-method" value="demo" checked>
                    <span>Demo Mode</span>
                </label>
            </div>
        </div>

        <button type="submit" class="btn btn--primary btn--large" style="width: 100%;">
            Pay Now
        </button>
    </form>
`;

// Initialize payment manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PaymentManager();
});

export { PaymentManager };
