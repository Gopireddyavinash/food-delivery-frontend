/**
 * CraveNest - Contact Page Controller & FAQ Accordion
 * Handles interactive FAQ accordions, contact form real-time validation,
 * ticket generation, and user feedback toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initContactForm();
  renderFaqs();
});

/**
 * Dynamically renders FAQs from CRAVENEST_DATA
 */
function renderFaqs() {
  const container = document.getElementById('faq-accordion-list');
  if (!container || !window.CRAVENEST_DATA) return;

  container.innerHTML = CRAVENEST_DATA.faqs.map((faq, idx) => `
    <div class="faq-accordion-item ${idx === 0 ? 'active' : ''}">
      <button type="button" class="faq-question-btn" aria-expanded="${idx === 0 ? 'true' : 'false'}">
        <span>${faq.question}</span>
        <i class="fa-solid fa-chevron-down faq-chevron"></i>
      </button>
      <div class="faq-answer-panel" style="${idx === 0 ? 'max-height: 200px;' : ''}">
        <p>${faq.answer}</p>
      </div>
    </div>
  `).join('');

  initFaqAccordion();
}

/**
 * Smooth Accordion expand/collapse
 */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-accordion-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    if (!btn || !panel) return;

    btn.onclick = () => {
      const isOpen = item.classList.contains('active');

      // Close other accordions
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherPanel = other.querySelector('.faq-answer-panel');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherPanel) otherPanel.style.maxHeight = null;
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        panel.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    };
  });
}

/**
 * Contact Form validation and simulated submission
 */
function initContactForm() {
  const form = document.getElementById('contact-support-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const orderIdInput = document.getElementById('contact-order-id');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showFieldError(subjectInput, 'Please select or enter an inquiry topic.');
      isValid = false;
    } else {
      clearFieldError(subjectInput);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showFieldError(messageInput, 'Please provide more details (minimum 10 characters).');
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    if (!isValid) return;

    // Simulate sending ticket
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Ticket...`;

    setTimeout(() => {
      const ticketId = 'TICK-' + Math.floor(10000 + Math.random() * 90000);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      // Show success modal or toast
      showTicketConfirmation(ticketId, nameInput.value.trim());
    }, 1000);
  });

  // Clear errors on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => clearFieldError(input));
    }
  });
}

function showFieldError(input, message) {
  const group = input.closest('.form-group');
  if (!group) return;

  group.classList.add('has-error');
  let errSpan = group.querySelector('.error-hint');
  if (!errSpan) {
    errSpan = document.createElement('span');
    errSpan.className = 'error-hint';
    group.appendChild(errSpan);
  }
  errSpan.textContent = message;
}

function clearFieldError(input) {
  const group = input.closest('.form-group');
  if (!group) return;
  group.classList.remove('has-error');
  const errSpan = group.querySelector('.error-hint');
  if (errSpan) errSpan.remove();
}

function showTicketConfirmation(ticketId, name) {
  window.showToast(`Support Ticket #${ticketId} created! Our team will contact you within 15 minutes.`, 'success', 6000);

  const container = document.getElementById('contact-form-card');
  if (container) {
    const successBox = document.createElement('div');
    successBox.className = 'ticket-success-alert';
    successBox.innerHTML = `
      <div class="alert-icon"><i class="fa-solid fa-circle-check"></i></div>
      <div class="alert-body">
        <h4>Ticket Created Successfully!</h4>
        <p>Reference ID: <strong>#${ticketId}</strong></p>
        <p>We've dispatched a copy of this confirmation to your email. Live chat agents are also notified.</p>
      </div>
    `;
    container.prepend(successBox);
    setTimeout(() => successBox.remove(), 8000);
  }
}

