// Main application logic
import { initAnimations } from "./animations.js";

class PortfolioApp {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    this.setupNavigation();
    this.setupTitleAnimation();
    this.setupContactForm();
    this.setupModal();
    this.setupCardFlip();
    initAnimations();
    this.loadProjects();
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
        "Modern Workflow Design",
        "Clean Code Practices",
        "Rapid Prototyping",
        "System Architecture",
        "AI-Assisted Development",
        "UX Problem Solving",
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
  async loadProjects() {
    try {
      const response = await fetch("./projects.json");
      const projectData = await response.json();
      this.renderFeaturedProjects(projectData.featured);
    } catch (error) {
      console.error("Error loading projects:", error);
      // Fallback to empty state or show error message
      this.renderFeaturedProjects([]);
    }
  }

  renderFeaturedProjects(projects) {
    const container = document.getElementById("featuredProjects");
    if (!container) {
      console.error("Featured projects container not found");
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Render each featured project
    projects.forEach((project) => {
      const projectCard = this.createFeaturedProjectCard(project);
      container.appendChild(projectCard);
    });
  }

  createFeaturedProjectCard(project) {
    const card = document.createElement("article");
    card.className = "featured-project-card";
    card.dataset.projectId = project.id;

    card.innerHTML = `
    <img 
      src="${project.image}" 
      alt="${project.title}"
      class="featured-project-image"
      loading="lazy"
    />
    <div class="featured-project-content">
      <div class="featured-project-header">
        <h3 class="featured-project-title">${project.title}</h3>
        <span class="featured-project-date">${project.date}</span>
      </div>
      <p class="featured-project-description">${project.description}</p>
      <div class="featured-tech-stack">
        ${project.techStack
          .map((tech) => `<span class="tech-badge">${tech}</span>`)
          .join("")}
      </div>
      <div class="featured-project-links">
        <a href="${project.github}" target="_blank" class="project-link">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
        ${
          project.liveDemo
            ? `
          <a href="${project.liveDemo}" target="_blank" class="project-link">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"/>
              <path d="M21 3v6h-6"/>
              <path d="M15 9l6-6"/>
            </svg>
            Live Demo
          </a>
        `
            : ""
        }
      </div>
    </div>
  `;

    // Add click handler to open project modal
    card.addEventListener("click", (e) => {
      // Don't open modal if clicking on links
      if (e.target.closest(".project-link")) return;
      this.openProjectModal(project);
    });
    return card;
  }

  async openProjectModal(selectedProject = null) {
    const response = await fetch("./projects.json");
    const projectData = await response.json();

    const modal = this.createProjectModal(projectData, selectedProject);
    document.body.appendChild(modal);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      modal.classList.add("modal-open");
    });
  }

  createProjectModal(projectData, selectedProject) {
    const modal = document.createElement("div");
    modal.className = "project-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "modal-title");
    modal.setAttribute("aria-modal", "true");

    modal.innerHTML = `
    <div class="project-modal-backdrop"></div>
    <div class="project-modal-content glass">
      <header class="project-modal-header">
        <h2 id="modal-title">Project Showcase</h2>
        <button class="project-modal-close" aria-label="Close modal">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </header>
      
      <div class="project-modal-body">
        ${this.renderProjectSections(projectData, selectedProject)}
      </div>
    </div>
  `;

    // Event listeners
    const closeBtn = modal.querySelector(".project-modal-close");
    const backdrop = modal.querySelector(".project-modal-backdrop");

    const closeModal = () => this.closeProjectModal(modal);

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    // Keyboard accessibility
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    // Focus management
    setTimeout(() => {
      closeBtn.focus();
    }, 100);

    return modal;
  }

  renderProjectSections(projectData, selectedProject) {
    const { featured, all, learning } = projectData;

    return `
    <!-- Featured Projects Section -->
    <section class="modal-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="section-icon">⭐</span>
          Featured Projects
        </h3>
        <p class="section-subtitle">My best and most recent work</p>
      </div>
      <div class="modal-projects-grid featured-grid">
        ${featured.map((project) => this.createModalProjectCard(project, "featured", selectedProject?.id === project.id)).join("")}
      </div>
    </section>

    <!-- All Projects Section -->
    ${
      all.length > 0
        ? `
    <section class="modal-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="section-icon">💼</span>
          All Projects
        </h3>
        <p class="section-subtitle">Complete portfolio of work</p>
      </div>
      <div class="modal-projects-grid all-grid">
        ${all.map((project) => this.createModalProjectCard(project, "regular")).join("")}
      </div>
    </section>`
        : ""
    }

    <!-- Learning Projects Section -->
    ${
      learning.length > 0
        ? `
    <section class="modal-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="section-icon">🎓</span>
          Learning & Practice
        </h3>
        <p class="section-subtitle">Projects that helped me grow</p>
      </div>
      <div class="modal-projects-grid learning-grid">
        ${learning.map((project) => this.createModalProjectCard(project, "learning")).join("")}
      </div>
    </section>`
        : ""
    }
  `;
  }

  createModalProjectCard(project, type, isSelected = false) {
    const isFeatured = type === "featured";
    const cardClass = `modal-project-card ${type}-card ${isSelected ? "selected" : ""}`;

    return `
    <article class="${cardClass}">
      <div class="modal-card-image-container">
        <img 
          src="${project.image}" 
          alt="${project.title}"
          class="modal-card-image"
          loading="lazy"
        />
        ${project.status ? `<span class="project-status-badge">${project.status}</span>` : ""}
      </div>
      
      <div class="modal-card-content">
        <div class="modal-card-header">
          <h4 class="modal-card-title">${project.title}</h4>
          <span class="modal-card-date">${project.date}</span>
        </div>
        
        <p class="modal-card-description">${project.description}</p>
        
        ${
          isFeatured && project.challenge
            ? `
          <div class="modal-card-details">
            <div class="modal-detail-item">
              <strong>Challenge:</strong> ${project.challenge}
            </div>
            <div class="modal-detail-item">
              <strong>Solution:</strong> ${project.solution}
            </div>
            ${
              project.learned
                ? `
              <div class="modal-detail-item">
                <strong>Key Learnings:</strong> ${project.learned.join(", ")}
              </div>
            `
                : ""
            }
          </div>
        `
            : ""
        }
        
        <div class="modal-tech-stack">
          ${project.techStack.map((tech) => `<span class="modal-tech-badge">${tech}</span>`).join("")}
        </div>
        
        <div class="modal-card-links">
          <a href="${project.github}" target="_blank" class="modal-project-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
          ${
            project.liveDemo
              ? `
            <a href="${project.liveDemo}" target="_blank" class="modal-project-link primary">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"/>
                <path d="M21 3v6h-6"/>
                <path d="M15 9l6-6"/>
              </svg>
              Live Demo
            </a>
          `
              : ""
          }
        </div>
      </div>
    </article>
  `;
  }

  closeProjectModal(modal) {
    modal.classList.add("modal-closing");
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
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
// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  window.portfolioApp = new PortfolioApp();
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
