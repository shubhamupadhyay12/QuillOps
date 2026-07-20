import { linkedInUrl, quillOpsMarkMarkup } from '../../dist/landing.js?v=20260720d';

// Contact Us Page View for Shubham Upadhyay

export function renderContact(container) {
  container.innerHTML = `
    <div class="view-container">
      <!-- Minimal Header -->
      <header class="navbar">
        <div class="nav-container container">
          <a class="nav-brand" href="/" aria-label="Go to QuillOps homepage">
            ${quillOpsMarkMarkup()}
            <span>QuillOps</span>
          </a>
          <div class="nav-menu">
            <a class="btn btn-secondary btn-sm" href="#/">
              <i class="fa-solid fa-arrow-left"></i> Home
            </a>
          </div>
        </div>
      </header>

      <!-- Contact Card Layout -->
      <main class="contact-layout container">
        <div class="glass-panel contact-card">
          <!-- Avatar Icon -->
          <div class="contact-avatar">
            <i class="fa-solid fa-laptop-code"></i>
          </div>
          
          <h2 class="contact-name">Shubham Upadhyay</h2>
          <div class="contact-title">Full-Stack Engineer & AI Architect</div>
          
          <p class="contact-bio">
            Passionate software engineer specializing in building modern distributed systems, autonomous AI agents, 
            and premium user interfaces. Creator of QuillOps, a persistent human-in-the-loop blog platform.
          </p>

          <!-- Social Links Grid -->
          <div class="social-grid">
            <a href="https://github.com/shubhamupadhyay12" target="_blank" rel="noopener noreferrer" class="social-button">
              <i class="fa-brands fa-github"></i>
              <span>GitHub</span>
            </a>
            
            <a href="${linkedInUrl}" target="_blank" rel="noopener noreferrer" class="social-button" aria-label="Connect with Shubham Upadhyay on LinkedIn">
              <i class="fa-brands fa-linkedin"></i>
              <span>LinkedIn</span>
            </a>
            
            <a href="https://x.com/SHUBHAM9908" target="_blank" rel="noopener noreferrer" class="social-button">
              <i class="fa-brands fa-x-twitter"></i>
              <span>Twitter / X</span>
            </a>
            
            <a href="mailto:shubhamupadhyay765@gmail.com" class="social-button" style="grid-column: span 2;">
              <i class="fa-solid fa-envelope"></i>
              <span>shubhamupadhyay765@gmail.com</span>
            </a>
          </div>

          <div style="width: 100%; border-top: 1px solid var(--border-color); padding-top: 24px; margin-top: 8px;">
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              Let's build something extraordinary. Get in touch for collaboration, inquiries, or feedback!
            </p>
          </div>
        </div>
      </main>
    </div>
  `;
}
