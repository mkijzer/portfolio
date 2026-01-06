// Main application logic
import { triggerLightModeAnimations } from "./lightmode.js";
import { triggerDarkModeAnimations } from "./darkmode.js";

class PortfolioApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    this.setupThemeToggle();
    this.setupNavigation();
    this.setupTitleAnimation();
    this.setupContactForm();
    this.loadSavedTheme();
    this.setupCardFlip();
  }

  setupThemeToggle() {
    const toggleButton = document.querySelector(".mode-toggle");

    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggleMode());
    } else {
      console.error("Toggle button not found");
    }
  }

  toggleMode() {
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");

    // Save theme preference
    localStorage.setItem("theme", isLightMode ? "light" : "dark");

    // Trigger appropriate animations
    if (isLightMode) {
      triggerLightModeAnimations();
    } else {
      triggerDarkModeAnimations();
    }
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  }

  setupNavigation() {
    const currentHash = window.location.hash || "#portfolio";
    const allLinks = document.querySelectorAll(".nav-link");

    allLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        // Update active state
        allLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");

        // Update URL hash
        const href = link.getAttribute("href");
        window.location.hash = href;

        // Scroll to section if it exists
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });

      // Set initial active state
      if (link.getAttribute("href") === currentHash) {
        link.classList.add("active");
      }
    });
  }

  setupTitleAnimation() {
    const titleElements = document.querySelectorAll(".dynamic-title");

    if (titleElements.length === 0) {
      console.error("No .dynamic-title elements found");
      return;
    }

    titleElements.forEach((element) => {
      this.cycleTitles(element, [
        "Full-stack Developer",
        "UI/UX Designer",
        "Creative Problem Solver",
        "Tech Enthusiast",
      ]);
    });
  }

  setupContactForm() {
    const contactHeader = document.querySelector(".contact-header");
    const contactToggle = document.querySelector(".contact-toggle");
    const contactForm = document.querySelector(".contact-form");

    // Add click listener to both header and toggle button
    if (contactHeader) {
      contactHeader.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleContact();
      });
    }

    if (contactToggle) {
      contactToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent double firing
        this.toggleContact();
      });
    }

    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        this.handleFormSubmit(e);
      });
    }
  }

  setupCardFlip() {
    const learnMoreBtn = document.querySelector(".btn-secondary");
    const backBtn = document.querySelector(".btn-back");
    const profileCard = document.querySelector(".profile-card");

    if (learnMoreBtn && backBtn && profileCard) {
      learnMoreBtn.addEventListener("click", () => {
        profileCard.classList.add("flipped");
      });

      backBtn.addEventListener("click", () => {
        profileCard.classList.remove("flipped");
      });
    }
  }

  toggleContact() {
    const contactSection = document.querySelector(".contact-section");
    if (contactSection) {
      const isExpanding = !contactSection.classList.contains("expanded");

      if (isExpanding) {
        // First expand the form
        contactSection.classList.add("expanded");

        // Wait for animation to complete (400ms from CSS), then scroll
        setTimeout(() => {
          const contactTop = contactSection.offsetTop;
          const windowHeight = window.innerHeight;
          const contactHeight = contactSection.offsetHeight;

          // Scroll so the entire contact section is visible
          const scrollTarget = contactTop - (windowHeight - contactHeight) / 2;

          window.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: "smooth",
          });
        }, 450); // Slightly longer than CSS animation (400ms)
      } else {
        // Just collapse
        contactSection.classList.remove("expanded");
      }
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
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

    // Simulate form submission
    const submitBtn = e.target.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      alert("Message sent successfully! (This is a demo)");
      e.target.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      this.toggleContact(); // Close the form
    }, 2000);
  }

  cycleTitles(element, titles) {
    let currentIndex = 0;

    const updateTitle = () => {
      element.textContent = titles[currentIndex];
      element.setAttribute("data-text", titles[currentIndex]);
      element.classList.remove("fade");
      element.offsetHeight; // Force reflow
      element.classList.add("fade");
    };

    element.addEventListener("animationend", (e) => {
      if (e.animationName === "fadeOut") {
        currentIndex = (currentIndex + 1) % titles.length;
        setTimeout(updateTitle, 500);
      }
    });

    // Start the animation
    updateTitle();
  }
}

// Global utility functions
window.scrollToSection = (sectionId) => {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  } else {
    // For now, just scroll to top since sections aren't implemented yet
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp();
});

// Handle browser navigation
window.addEventListener("popstate", () => {
  const hash = window.location.hash || "#portfolio";
  const activeLink = document.querySelector(`[href="${hash}"]`);

  if (activeLink) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active");
    });
    activeLink.classList.add("active");
  }
});
