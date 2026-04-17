/**
 * CONTACT SYSTEM
 * Handles contact form, modal display, and form submission including:
 * - Expandable contact form section
 * - Contact modal with animations
 * - Form validation and submission
 * - Smart scrolling and user feedback
 */

export class ContactController {
  constructor() {
    this.init();
  }

  /**
   * Initialize contact system
   * Sets up all contact-related functionality
   */
  init() {
    this.setupContactForm();
    this.setupModal();
  }

  /**
   * Sets up contact form functionality
   * - Handles expandable contact section
   * - Manages form submission and validation
   * - Provides user feedback
   */
  setupContactForm() {
    const contactHeader = document.querySelector(".contact-header");
    const contactToggle = document.querySelector(".contact-toggle");
    const contactForm = document.querySelector(".contact-form");

    // Setup expandable contact section
    if (contactHeader) {
      contactHeader.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleContact();
      });
    }

    if (contactToggle) {
      contactToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleContact();
      });
    }

    // Setup form submission
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        this.handleFormSubmit(e);
      });
    }
  }

  /**
   * Sets up contact modal functionality
   * - Manages modal open/close states
   * - Handles animations and transitions
   * - Provides smooth user interactions
   */
  setupModal() {
    const modal = document.getElementById("contactModal");
    if (!modal) return console.error("Modal not found");

    const triggers = document.querySelectorAll(".contact-trigger");
    const closeBtn = modal.querySelector(".modal-close");
    const modalInner = modal.querySelector(".modal-inner");

    // Open modal with animation
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
        closeBtn.classList.remove("spin"); // Reset any previous animations
        modalInner.style.animation =
          "popUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
      });
    });

    // Close modal with spin animation
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Trigger spin animation on close button
      closeBtn.classList.add("spin");

      // Start modal fade-out animation
      modalInner.style.animation = "popOut 0.3s ease-in forwards";

      // Hide modal after animations complete and reset button state
      setTimeout(() => {
        modal.style.display = "none";
        closeBtn.classList.remove("spin");
      }, 500);
    });
  }

  /**
   * Toggles contact section expanded state
   * - Manages smooth accordion-style expansion
   * - Provides smart scrolling to keep content in view
   */
  toggleContact() {
    const contactSection = document.querySelector(".contact-section");
    if (contactSection) {
      const isExpanding = !contactSection.classList.contains("expanded");

      if (isExpanding) {
        contactSection.classList.add("expanded");

        // Smart scrolling after expansion animation
        setTimeout(() => {
          const contactTop = contactSection.offsetTop;
          const windowHeight = window.innerHeight;
          const contactHeight = contactSection.offsetHeight;
          const scrollTarget = contactTop - (windowHeight - contactHeight) / 2;
          window.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: "smooth",
          });
        }, 450); // Wait for CSS transition to start
      } else {
        contactSection.classList.remove("expanded");
      }
    }
  }

  /**
   * Handles contact form submission
   * - Validates form data
   * - Provides user feedback
   * - Simulates form submission (demo mode)
   * @param {Event} e - Form submission event
   */
  handleFormSubmit(e) {
    e.preventDefault();

    // Extract form data
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      alert("Please fill in all fields");
      return;
    }

    // UI feedback during submission
    const submitBtn = e.target.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate submission (replace with actual API call)
    setTimeout(() => {
      alert("Message sent successfully! (This is a demo)");
      e.target.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      this.toggleContact(); // Close the contact form
    }, 2000);
  }
}
