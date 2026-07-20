// QuillOps Client-Side SPA Hash Router
import { renderDashboard } from './views/dashboard.js?v=20260720d';
import { renderDetail } from './views/detail.js?v=20260720d';
import { renderContact } from './views/contact.js?v=20260720a';
import { auth, renderAuth, renderLanding, unmountReactView } from '../dist/landing.js?v=20260720d';

const routes = {
  'home': { render: renderLanding, protected: false, isLanding: true },
  'login': { render: (container) => renderAuth(container, 'login'), protected: false, isReact: true },
  'register': { render: (container) => renderAuth(container, 'register'), protected: false, isReact: true },
  'dashboard': { render: renderDashboard, protected: true },
  'blog': { render: renderDetail, protected: true, hasParams: true },
  'contact': { render: renderContact, protected: false }
};

export function initRouter() {
  window.addEventListener('hashchange', handleRouting);
  // Initial routing check
  handleRouting();
}

function handleRouting() {
  const hash = window.location.hash || '#/';
  const appContainer = document.getElementById('app');
  
  // Clean hash to find route name and parameters
  // Examples: "#/login" -> "login", "#/blog/123-abc" -> ["blog", "123-abc"]
  const cleanHash = hash.replace(/^#\/?/, '');
  const segments = cleanHash.split('/');
  const sectionName = segments[0] === 'section' ? segments[1] : null;
  const routeName = sectionName ? 'home' : (segments[0] || 'home');
  const param = sectionName ? null : (segments[1] || null);

  if (sectionName) {
    const mountedSection = document.getElementById(sectionName);
    if (mountedSection) {
      mountedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (sectionName === 'main-content') {
        mountedSection.setAttribute('tabindex', '-1');
        mountedSection.focus({ preventScroll: true });
      }
      return;
    }
  }
  
  const route = routes[routeName];
  
  if (!route) {
    // Route not found, fallback to dashboard
    window.location.hash = '#/';
    return;
  }
  
  // Auth guards
  const authenticated = auth.isAuthenticated();
  
  if (route.protected && !authenticated) {
    window.location.hash = '#/login';
    return;
  }
  
  if (!route.protected && authenticated && (routeName === 'login' || routeName === 'register')) {
    window.location.hash = '#/dashboard';
    return;
  }
  
  // Render the view
  unmountReactView();
  appContainer.innerHTML = ''; // Clear container
  // Call the view renderer
  if (route.hasParams) {
    route.render(appContainer, param);
  } else {
    route.render(appContainer);
  }

  if (sectionName) {
    window.requestAnimationFrame(() => {
      const section = document.getElementById(sectionName);
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (sectionName === 'main-content' && section) {
        section.setAttribute('tabindex', '-1');
        section.focus({ preventScroll: true });
      }
    });
    return;
  }
  
  // Scroll to top on navigation
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function navigate(path) {
  window.location.hash = path;
}
