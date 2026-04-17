/**
 * PROJECT SYSTEM
 * Handles project data loading, rendering, and modal display including:
 * - Project data fetching from JSON
 * - Featured project card rendering
 * - Project modal creation and management
 * - Project showcase with different categories
 */

import { ImageGalleryController } from "./image-gallery.js";

export class ProjectController {
  constructor() {
    this.gallery = new ImageGalleryController();
  }

  /**
   * Initialize project system
   * Sets up project loading functionality
   */
  init() {
    this.loadProjects();
  }

  /**
   * Loads project data from JSON file
   * - Fetches project data asynchronously
   * - Handles loading errors gracefully
   * - Renders featured projects on the main page
   */
  async loadProjects() {
    try {
      const response = await fetch("./projects.json");
      const projectData = await response.json();
      this.renderFeaturedProjects(projectData.featured);
    } catch (error) {
      console.error("Error loading projects:", error);
      // Fallback to empty state rather than breaking the page
      this.renderFeaturedProjects([]);
    }
  }

  /**
   * Renders featured projects on the main page
   * - Clears existing content
   * - Creates project cards dynamically
   * - Handles missing container gracefully
   * @param {Array} projects - Array of project objects to render
   */
  renderFeaturedProjects(projects) {
    const container = document.getElementById("featuredProjects");
    if (!container) {
      console.error("Featured projects container not found");
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Render each featured project as a card
    projects.forEach((project) => {
      const projectCard = this.createFeaturedProjectCard(project);
      container.appendChild(projectCard);
    });
  }

  /**
   * Creates a single featured project card
   * - Builds card HTML with project data
   * - Adds click handlers for modal opening
   * - Prevents modal opening when clicking links
   * @param {Object} project - Project data object
   * @returns {HTMLElement} Complete project card element
   */
  createFeaturedProjectCard(project) {
    const card = document.createElement("article");
    card.className = "featured-project-card";
    card.dataset.projectId = project.id;

    // Build card HTML with project data
    card.innerHTML = `
    <div class="featured-project-image-container">
      
  <div class="featured-project-image-container">
    <img 
        src="${project.images[0]}"
        alt="${project.title}"
        class="featured-project-image"
        loading="lazy"
      />
    </div>
    <div class="featured-project-content">
      <div class="featured-project-header">
        <h3 class="featured-project-title">${project.title}</h3>
      </div>
      <p class="featured-project-description">${project.description}</p>
      <div class="featured-tech-stack">
        ${this.renderTechStack(project.techStack)}
      </div>
      <div class="featured-project-links">
        ${this.renderProjectLinks(project)}
      </div>
    </div>
  `;

    // Attach tech stack expand handler
    this.attachTechExpandHandler(card);

    // Attach image gallery
    this.gallery.attachGalleryToCard(card, project.images);

    // Add click handler to open project modal
    card.addEventListener("click", (e) => {
      // Don't open modal if clicking on links, buttons, or images
      if (
        e.target.closest(".project-link") ||
        e.target.closest(".tech-expand") ||
        e.target.closest(".featured-project-image")
      )
        return;
      this.openProjectModal(project);
    });

    return card;
  }

  /**
   * Renders tech stack pills with expand/collapse functionality
   * @param {Object} techStack - Object with primary and secondary tech arrays
   * @returns {string} HTML for tech stack section
   */
  renderTechStack(techStack) {
    return `
      <div class="tech-pills-primary">
        ${techStack.primary.map((tech) => `<span class="tech-badge">${tech}</span>`).join("")}
        ${
          techStack.secondary && techStack.secondary.length > 0
            ? `<button class="tech-expand" data-expanded="false">+${techStack.secondary.length} more</button>`
            : ""
        }
      </div>
      ${
        techStack.secondary && techStack.secondary.length > 0
          ? `<div class="tech-pills-secondary" style="display: none;">
            ${techStack.secondary.map((tech) => `<span class="tech-badge">${tech}</span>`).join("")}
          </div>`
          : ""
      }
    `;
  }

  /**
   * Renders project links (GitHub and Live Demo)
   * @param {Object} project - Project data object
   * @returns {string} HTML for project links
   */
  renderProjectLinks(project) {
    return `
      <a href="${project.github}" target="_blank" class="project-link">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </a>
      ${
        project.liveDemo
          ? `<a href="${project.liveDemo}" target="_blank" class="project-link">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"/>
              <path d="M21 3v6h-6"/>
              <path d="M15 9l6-6"/>
            </svg>
            Live Demo
          </a>`
          : ""
      }
    `;
  }

  /**
   * Attaches tech stack expand/collapse handler to a card element
   * Shared method used by both homepage and modal cards
   * @param {HTMLElement} element - Card element containing tech expand button
   */
  attachTechExpandHandler(element) {
    const expandBtn = element.querySelector(".tech-expand");
    if (!expandBtn) return;

    expandBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const secondary = element.querySelector(".tech-pills-secondary");
      const isExpanded = expandBtn.dataset.expanded === "true";
      const secondaryCount = secondary.querySelectorAll(".tech-badge").length;

      if (isExpanded) {
        secondary.style.display = "none";
        expandBtn.textContent = `+${secondaryCount} more`;
        expandBtn.dataset.expanded = "false";
      } else {
        secondary.style.display = "flex";
        expandBtn.textContent = "show less";
        expandBtn.dataset.expanded = "true";
      }
    });
  }

  /**
   * Opens project modal with all project data
   * @param {Object} selectedProject - Project to highlight in modal
   */
  async openProjectModal(selectedProject = null) {
    try {
      const response = await fetch("projects.json");
      const projectData = await response.json();

      const modal = this.createProjectModal(projectData, selectedProject);
      document.body.appendChild(modal);

      // Trigger entrance animation
      requestAnimationFrame(() => {
        modal.classList.add("modal-open");
      });
    } catch (error) {
      console.error("Error opening project modal:", error);
    }
  }

  /**
   * Creates the project modal HTML structure
   * @param {Object} projectData - All project data
   * @param {Object} selectedProject - Project to highlight
   * @returns {HTMLElement} Complete modal element
   */
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

    // Attach tech stack expand handlers to all modal cards
    modal.querySelectorAll(".modal-project-card").forEach((card) => {
      this.attachTechExpandHandler(card);
    });

    // Attach image galleries to all modal cards
    const allProjects = [
      ...projectData.featured,
      ...projectData.all,
      ...projectData.learning,
    ];
    modal.querySelectorAll(".modal-project-card").forEach((card, index) => {
      if (allProjects[index]) {
        this.gallery.attachGalleryToCard(card, allProjects[index].images);
      }
    });

    // Setup modal close handlers
    this.setupModalCloseHandlers(modal);

    return modal;
  }

  /**
   * Sets up modal close event handlers
   * @param {HTMLElement} modal - Modal element
   */
  setupModalCloseHandlers(modal) {
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
  }

  /**
   * Renders all project sections in the modal
   * @param {Object} projectData - All project data
   * @param {Object} selectedProject - Project to highlight
   * @returns {string} HTML for project sections
   */
  renderProjectSections(projectData, selectedProject) {
    const { featured, all, learning } = projectData;

    return `
    <!-- Featured Projects Section -->
    <section class="modal-section">
      <div class="section-header">
        <h3 class="section-title">Featured Projects</h3>
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
        <h3 class="section-title">All Projects</h3>
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
        <h3 class="section-title">Learning & Practice</h3>
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

  /**
   * Creates a project card for the modal
   * @param {Object} project - Project data
   * @param {string} type - Card type (featured, regular, learning)
   * @param {boolean} isSelected - Whether this project is selected
   * @returns {string} HTML for project card
   */
  createModalProjectCard(project, type, isSelected = false) {
    const cardClass = `modal-project-card ${type}-card ${isSelected ? "selected" : ""} glass-light`;

    return `
    <article class="${cardClass}">
      <h4 class="modal-card-title">${project.title}</h4>
      
      <div class="modal-card-image-container">
        <img 
          src="${project.images[0]}" 
          alt="${project.title}"
          class="modal-card-image"
          loading="lazy"
        />
      </div>
      
      <div class="modal-card-content">
        <p class="modal-card-description">${project.description}</p>
        
        <div class="modal-tech-stack">
          ${this.renderTechStack(project.techStack)}
        </div>
        
        <div class="modal-card-links">
          ${this.renderProjectLinks(project)}
        </div>
      </div>
    </article>
  `;
  }

  /**
   * Closes the project modal with animation
   * @param {HTMLElement} modal - Modal element to close
   */
  closeProjectModal(modal) {
    modal.classList.add("modal-closing");
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  }
}
