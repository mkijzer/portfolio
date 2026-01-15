// Main application logic
import { triggerLightModeAnimations } from "./lightmode.js";
import { triggerDarkModeAnimations } from "./darkmode.js";
import { initAnimations } from "./animations.js";

class PortfolioApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    this.setupThemeToggle();
    this.setupNavigation();
    this.setupTitleAnimation();
    this.setupContactForm();
    this.setupModal(); // â† added here
    this.loadSavedTheme();
    this.setupCardFlip();
    initAnimations();
  }

  setupThemeToggle() {
    const toggleButton = document.querySelector("#toggle");
    if (toggleButton) {
      toggleButton.addEventListener("click", () => this.toggleMode());
    } else {
      console.error("Toggle button not found");
    }
  }

  toggleMode() {
    document.body.classList.toggle("light-mode");
    const isLightMode = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
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
        allLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
        const href = link.getAttribute("href");
        window.location.hash = href;
        const targetSection = document.querySelector(href);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });

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
        "Front-end Developer",
        "Back-end Developer",
        "Creative Problem Solver",
        "Tech Enthusiast",
      ]);
    });
  }

  setupContactForm() {
    const contactHeader = document.querySelector(".contact-header");
    const contactToggle = document.querySelector(".contact-toggle");
    const contactForm = document.querySelector(".contact-form");

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

    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        this.handleFormSubmit(e);
      });
    }
  }
  setupModal() {
    const modal = document.getElementById("contactModal");
    if (!modal) return console.error("Modal not found");

    const triggers = document.querySelectorAll(".contact-trigger");
    const closeBtn = modal.querySelector(".modal-close");
    const modalInner = modal.querySelector(".modal-inner");

    // Open modal
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
        closeBtn.classList.remove("spin"); // just in case â€” reset
        modalInner.style.animation =
          "popUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards";
      });
    });

    // Close modal with spin
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Trigger spin animation
      closeBtn.classList.add("spin");

      // Start modal fade-out
      modalInner.style.animation = "popOut 0.3s ease-in forwards";

      // Hide modal after animations finish + reset button
      setTimeout(() => {
        modal.style.display = "none";
        closeBtn.classList.remove("spin");
      }, 500);
    });
  }

  toggleContact() {
    const contactSection = document.querySelector(".contact-section");
    if (contactSection) {
      const isExpanding = !contactSection.classList.contains("expanded");
      if (isExpanding) {
        contactSection.classList.add("expanded");
        setTimeout(() => {
          const contactTop = contactSection.offsetTop;
          const windowHeight = window.innerHeight;
          const contactHeight = contactSection.offsetHeight;
          const scrollTarget = contactTop - (windowHeight - contactHeight) / 2;
          window.scrollTo({
            top: Math.max(0, scrollTarget),
            behavior: "smooth",
          });
        }, 450);
      } else {
        contactSection.classList.remove("expanded");
      }
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    if (!data.name || !data.email || !data.subject || !data.message) {
      alert("Please fill in all fields");
      return;
    }

    const submitBtn = e.target.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    setTimeout(() => {
      alert("Message sent successfully! (This is a demo)");
      e.target.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      this.toggleContact();
    }, 2000);
  }

  setupCardFlip() {
    const learnMoreBtn = document.querySelector(".btn-secondary");
    const backBtn = document.querySelector(".btn-back");
    const profileCard = document.querySelector(".profile-card");

    if (learnMoreBtn && profileCard) {
      learnMoreBtn.addEventListener("click", () => {
        profileCard.style.animation = "profileFlip 0.6s ease-in-out forwards";
        profileCard.classList.add("flipped");
      });
    }

    if (backBtn && profileCard) {
      backBtn.addEventListener("click", () => {
        profileCard.style.animation =
          "profileFlipBack 0.6s ease-in-out forwards";
        profileCard.classList.remove("flipped");
      });
    }
  }

  cycleTitles(element, titles) {
    let currentIndex = 0;

    const updateTitle = () => {
      element.textContent = titles[currentIndex];
      currentIndex = (currentIndex + 1) % titles.length;
    };

    updateTitle();
    setTimeout(() => {
      updateTitle();
      setInterval(updateTitle, 7000);
    }, 4400);
  }
}

// Global utility functions
window.scrollToSection = (sectionId) => {
  const section = document.querySelector(`#${sectionId}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Initialize app
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
