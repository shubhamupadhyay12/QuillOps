// QuillOps SPA Main Application Bootstrap Entry Point
import { initRouter } from './router.js?v=20260720d';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize the hash router and routing listeners
  initRouter();
});
