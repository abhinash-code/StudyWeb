/**
 * Booking functionality for FinancePro
 * Handles appointment scheduling and form submission
 */

import { Storage, Toast } from './main.js';

class BookingManager {
    constructor() {
        this.form = document.getElementById('booking-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormHandlers();
            this.setupDateValidation();
        }
    }

    setupFormHandlers() {
        this.form.addEventListener('form:valid', (e) => {
            this.handleBookingSubmission(e.detail.formData);
        });
    }

    setupDateValidation() {
        const dateInput = document.getElementById('preferred-date');
        if (dateInput) {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            
            // Set maximum date to 3 months from now
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
        }
    }

    async handleBookingSubmission(formData) {
        const bookingData = {
            id: this.generateId(),
            service: formData.get('service'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            company: formData.get('company'),
            preferredDate: formData.get('preferred-date'),
            preferredTime: formData.get('preferred-time'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            // Show loading state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"><span class="loading__spinner"></span>Booking...</span>';
            submitBtn.disabled = true;

            // Simulate API call delay
            await this.simulateApiCall();

            // Store booking locally (replace with real API call)
            this.saveBooking(bookingData);

            // Show success message
            window.toast.show({
                title: 'Booking Confirmed!',
                description: 'We\'ll contact you soon to confirm your appointment details.'
            }, 'success');

            // Reset form
            this.form.reset();

            // TODO: Integrate with real calendar service
            this.scheduleCalendarEvent(bookingData);

        } catch (error) {
            console.error('Booking error:', error);
            window.toast.show({
                title: 'Booking Failed',
                description: 'Please try again or contact us directly.'
            }, 'error');
        } finally {
            // Reset button state
            const submitBtn = this.form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Book Free Consultation';
            submitBtn.disabled = false;
        }
    }

    saveBooking(bookingData) {
        const bookings = Storage.get('bookings', []);
        bookings.push(bookingData);
        Storage.set('bookings', bookings);
    }

    generateId() {
        return 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    async simulateApiCall() {
        // Simulate network delay
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    scheduleCalendarEvent(bookingData) {
        // TODO: Integrate with Calendly, Google Calendar, or other calendar service
        console.log('Calendar event would be created:', bookingData);
        
        // For demo purposes, create a calendar invite template
        const eventDetails = {
            title: `FinancePro Consultation - ${bookingData.service}`,
            description: `Consultation with ${bookingData.name} (${bookingData.email})\n\nService: ${bookingData.service}\nCompany: ${bookingData.company || 'N/A'}\nMessage: ${bookingData.message || 'N/A'}`,
            startTime: `${bookingData.preferredDate}T${bookingData.preferredTime}:00`,
            duration: 60 // 1 hour
        };

        // Store calendar event for admin to see
        const calendarEvents = Storage.get('calendarEvents', []);
        calendarEvents.push(eventDetails);
        Storage.set('calendarEvents', calendarEvents);
    }
}

// Initialize booking manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookingManager();
});
