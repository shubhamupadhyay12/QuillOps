import { auth, quillOpsMarkMarkup } from '@/entry';

function escapeHtml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export function renderAuthenticatedShell(container, options = {}) {
  const email = auth.getUserEmail();
  const title = options.title || 'Technical writing operations';
  const stage = options.stage || 'Workspace';
  const mainId = options.mainId || 'app-shell-main';
  const articleHref = options.articleHref || '#/dashboard';
  container.innerHTML = `
    <div class="view-container dashboard-app app-shell">
      <a class="app-skip-link" href="#${mainId}">Skip to workspace</a>
      <aside id="app-shell-sidebar" class="dashboard-sidebar app-shell-sidebar" aria-label="Workspace navigation">
        <a class="dashboard-brand" href="/" aria-label="Go to QuillOps homepage"><span>${quillOpsMarkMarkup()}</span><strong>QuillOps</strong></a>
        <nav>
          <a class="app-shell-nav-item ${options.active === 'workspace' ? 'is-active' : ''}" href="#/dashboard"><i class="fa-solid fa-grid-2" aria-hidden="true"></i><span>Workspace</span></a>
          ${options.articleHref ? `<a class="app-shell-nav-item ${options.active === 'article' ? 'is-active' : ''}" href="${escapeHtml(articleHref)}"><i class="fa-regular fa-file-lines" aria-hidden="true"></i><span>Current article</span></a>` : ''}
          ${options.extraNavigation || ''}
        </nav>
        <div class="dashboard-sidebar-user"><span aria-hidden="true">${escapeHtml(email.slice(0, 1).toUpperCase())}</span><div><strong>${escapeHtml(email)}</strong><small>Private workspace</small></div></div>
        <button class="dashboard-logout app-shell-logout" type="button"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i><span>Log out</span></button>
      </aside>
      <div class="dashboard-stage app-shell-stage">
        <header class="dashboard-topbar app-shell-topbar">
          <button class="app-shell-menu" type="button" aria-expanded="false" aria-controls="app-shell-sidebar" aria-label="Open workspace navigation"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
          <a class="app-shell-mobile-brand" href="/" aria-label="Go to QuillOps homepage">${quillOpsMarkMarkup()}</a>
          <div class="app-shell-context"><small id="app-shell-stage">${escapeHtml(stage)}</small><strong id="app-shell-title">${escapeHtml(title)}</strong></div>
          <div class="app-shell-account">
            <button class="app-shell-account-trigger" type="button" aria-label="Account menu for ${escapeHtml(email)}" aria-expanded="false" aria-controls="app-shell-account-menu"><span aria-hidden="true">${escapeHtml(email.slice(0, 1).toUpperCase())}</span><span class="app-shell-account-email">${escapeHtml(email)}</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
            <div id="app-shell-account-menu" class="app-shell-account-menu" hidden><strong>${escapeHtml(email)}</strong><small>Private workspace</small><button class="app-shell-logout" type="button"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>Log out</button></div>
          </div>
        </header>
        <main id="${escapeHtml(mainId)}" class="dashboard-main app-shell-main ${escapeHtml(options.mainClass || '')}" tabindex="-1">${options.content || ''}</main>
      </div>
      ${options.after || ''}
      <button class="app-shell-scrim" type="button" aria-label="Close workspace navigation" hidden></button>
    </div>`;

  const sidebar = container.querySelector('.app-shell-sidebar');
  const menu = container.querySelector('.app-shell-menu');
  const scrim = container.querySelector('.app-shell-scrim');
  const mobileLayout = () => window.matchMedia('(max-width: 760px)').matches;
  const closeNavigation = () => { sidebar?.classList.remove('is-open'); menu?.setAttribute('aria-expanded', 'false'); if (mobileLayout()) sidebar?.setAttribute('aria-hidden', 'true'); else sidebar?.removeAttribute('aria-hidden'); if (scrim) scrim.hidden = true; };
  menu?.addEventListener('click', () => {
    const open = !sidebar?.classList.contains('is-open');
    sidebar?.classList.toggle('is-open', open); sidebar?.setAttribute('aria-hidden', String(!open)); menu.setAttribute('aria-expanded', String(open)); if (scrim) scrim.hidden = !open;
  });
  scrim?.addEventListener('click', closeNavigation);
  sidebar?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNavigation));
  const accountTrigger = container.querySelector('.app-shell-account-trigger');
  const accountMenu = container.querySelector('.app-shell-account-menu');
  accountTrigger?.addEventListener('click', () => { const open = accountMenu?.hasAttribute('hidden'); accountMenu?.toggleAttribute('hidden', !open); accountTrigger.setAttribute('aria-expanded', String(open)); });
  container.querySelectorAll('.app-shell-logout').forEach((button) => button.addEventListener('click', () => auth.logout()));
  container.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeNavigation(); accountMenu?.setAttribute('hidden', ''); accountTrigger?.setAttribute('aria-expanded', 'false'); } }, { once: false });
  closeNavigation();
  return document.getElementById(mainId);
}

export function updateAuthenticatedShell({ title, stage }) {
  if (title) document.getElementById('app-shell-title')?.replaceChildren(document.createTextNode(title));
  if (stage) document.getElementById('app-shell-stage')?.replaceChildren(document.createTextNode(stage));
}
