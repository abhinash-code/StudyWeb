/**
 * Client dashboard functionality for FinancePro
 * Handles client authentication and dashboard features
 */

import { Storage, Toast } from './main.js';

class ClientDashboard {
    constructor() {
        this.loginForm = document.getElementById('client-login-form');
        this.loginSection = document.getElementById('login-section');
        this.dashboardContent = document.getElementById('dashboard-content');
        this.demoLoginLink = document.getElementById('demo-login');
        this.init();
    }

    init() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (this.demoLoginLink) {
            this.demoLoginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.useDemoAccount();
            });
        }
        
        // Check if already logged in
        this.checkAuthStatus();
    }

    checkAuthStatus() {
        const authStatus = Storage.get('clientAuth', false);
        if (authStatus && authStatus.expires > Date.now()) {
            this.showDashboard();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(this.loginForm);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Simple demo authentication
        if (email && password) {
            this.authenticate(email);
        } else {
            window.toast.show({
                title: 'Login Failed',
                description: 'Please enter both email and password.'
            }, 'error');
        }
    }

    useDemoAccount() {
        const demoEmail = 'demo@financepro.com';
        this.authenticate(demoEmail);
    }

    authenticate(email) {
        // Set authentication status (expires in 24 hours)
        const authData = {
            authenticated: true,
            email: email,
            expires: Date.now() + (24 * 60 * 60 * 1000)
        };
        Storage.set('clientAuth', authData);
        
        this.showDashboard();
        
        window.toast.show({
            title: 'Welcome Back!',
            description: 'You have successfully logged into your dashboard.'
        }, 'success');
    }

    showDashboard() {
        this.loginSection.style.display = 'none';
        this.dashboardContent.style.display = 'block';
        
        this.loadDashboardData();
    }

    loadDashboardData() {
        this.loadUpcomingAppointments();
        this.loadRecentInvoices();
    }

    loadUpcomingAppointments() {
        const bookings = Storage.get('bookings', []);
        const appointmentsContainer = document.getElementById('upcoming-appointments');
        
        // Filter bookings for this client (demo: show all)
        const clientBookings = bookings.filter(booking => 
            booking.status === 'confirmed' || booking.status === 'pending'
        );
        
        if (clientBookings.length === 0) {
            appointmentsContainer.innerHTML = '<p>No upcoming appointments</p>';
            return;
        }

        appointmentsContainer.innerHTML = clientBookings.map(booking => `
            <div style="border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1rem;">
                <h4>${booking.service} Consultation</h4>
                <p><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${booking.preferredTime}</p>
                <p><strong>Status:</strong> <span style="color: var(--color-primary);">${booking.status}</span></p>
            </div>
        `).join('');
    }

    loadRecentInvoices() {
        const invoicesContainer = document.getElementById('recent-invoices');
        
        // Sample invoice data
        const sampleInvoices = [
            {
                id: 'INV-001',
                amount: '$500.00',
                service: 'Financial Planning Consultation',
                date: '2024-01-15',
                status: 'Paid'
            },
            {
                id: 'INV-002',
                amount: '$750.00',
                service: 'Tax Management Services',
                date: '2024-01-10',
                status: 'Paid'
            }
        ];
        
        invoicesContainer.innerHTML = sampleInvoices.map(invoice => `
            <div style="border: 1px solid var(--color-gray-200); border-radius: var(--radius-lg); padding: 1rem; margin-bottom: 1rem;">
                <h4>Invoice ${invoice.id}</h4>
                <p><strong>Amount:</strong> ${invoice.amount}</p>
                <p><strong>Service:</strong> ${invoice.service}</p>
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span style="color: var(--color-success);">${invoice.status}</span></p>
            </div>
        `).join('');
    }
}

// PDF generation function for sample report
window.generateSampleReport = function() {
    try {
        // Create a simple PDF using browser's print functionality
        const reportContent = `
            <html>
                <head>
                    <title>Financial Report - FinancePro</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .section { margin-bottom: 20px; }
                        .section h3 { color: #1E40AF; border-bottom: 2px solid #1E40AF; padding-bottom: 5px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>FinancePro</h1>
                        <h2>Financial Summary Report</h2>
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                    </div>
                    
                    <div class="section">
                        <h3>Portfolio Performance</h3>
                        <table>
                            <tr><th>Asset Class</th><th>Value</th><th>Return</th></tr>
                            <tr><td>Stocks</td><td>$25,000</td><td>+12.5%</td></tr>
                            <tr><td>Bonds</td><td>$15,000</td><td>+4.2%</td></tr>
                            <tr><td>Cash</td><td>$5,000</td><td>+2.1%</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <h3>Financial Goals Progress</h3>
                        <table>
                            <tr><th>Goal</th><th>Target</th><th>Current</th><th>Progress</th></tr>
                            <tr><td>Emergency Fund</td><td>$10,000</td><td>$8,500</td><td>85%</td></tr>
                            <tr><td>Retirement Savings</td><td>$50,000</td><td>$32,000</td><td>64%</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <h3>Recommendations</h3>
                        <ul>
                            <li>Consider increasing emergency fund contributions</li>
                            <li>Review retirement allocation strategy</li>
                            <li>Schedule quarterly portfolio review</li>
                        </ul>
                    </div>
                </body>
            </html>
        `;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(reportContent);
        printWindow.document.close();
        printWindow.print();
        
        window.toast.show({
            title: 'Report Generated',
            description: 'Your financial report has been prepared for printing/download.'
        }, 'success');
        
    } catch (error) {
        console.error('Error generating report:', error);
        window.toast.show({
            title: 'Report Error',
            description: 'Unable to generate report. Please try again.'
        }, 'error');
    }
};

// Initialize client dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ClientDashboard();
});
