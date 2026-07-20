export const quillOpsNibPath = "M5.5 25.5 9.8 10.5 21.1 4.9 27.1 10.9 21.5 22.2 6.5 26.5Z";
export const quillOpsConnectionPath = "M15.1 17.2 7.2 25.8";

export function quillOpsMarkMarkup(className = "q-brand-mark", title = "") {
  const accessibility = title ? `role="img" aria-label="${title}"` : 'aria-hidden="true"';
  return `<svg class="${className}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" ${accessibility}><path d="${quillOpsNibPath}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"/><path d="${quillOpsConnectionPath}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round"/><circle class="q-brand-node" cx="15.1" cy="17.2" r="2.35" fill="currentColor"/></svg>`;
}

export function quillOpsFaviconMarkup() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" color="#f6b21a"><rect width="32" height="32" rx="7" fill="#09090b"/><path d="${quillOpsNibPath}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"/><path d="${quillOpsConnectionPath}" stroke="currentColor" stroke-width="2.15" stroke-linecap="round"/><circle cx="15.1" cy="17.2" r="2.35" fill="currentColor"/></svg>`;
}
