import { api, quillOpsMarkMarkup } from '../../dist/landing.js?v=20260720d';
import { renderAuthenticatedShell } from '../app-shell.js';

let dashboardBlogs = [];

const ACTIVE_STATUSES = new Set(['queued', 'routing', 'researching', 'synthesizing_research', 'planning_outline', 'validating_outline', 'saving_checkpoint', 'planning', 'queued_for_generation', 'generating', 'writing', 'assembling', 'validating_article', 'queued_for_edit', 'editing']);

export async function renderDashboard(container) {
  renderAuthenticatedShell(container, { active: 'workspace', mainId: 'dashboard-main', title: 'Technical writing operations', stage: 'WORKSPACE / OVERVIEW', extraNavigation: `
    <button type="button" data-scroll-target="articles-section"><i class="fa-regular fa-file-lines" aria-hidden="true"></i><span>Articles</span></button>
    <button type="button" data-scroll-target="new-draft"><i class="fa-solid fa-plus" aria-hidden="true"></i><span>New draft</span></button>
    <button type="button" data-scroll-target="workflow-queue"><i class="fa-solid fa-code-branch" aria-hidden="true"></i><span>Activity</span></button>`, content: `
          <section id="workspace-overview" class="dashboard-welcome" aria-labelledby="dashboard-title">
            <div><p class="dashboard-eyebrow"><span aria-hidden="true"></span>WORKSPACE ONLINE</p><h1 id="dashboard-title">Welcome back.</h1><p>Continue an existing draft or begin a new human-reviewed workflow.</p></div>
            <div class="dashboard-ambient" aria-hidden="true"><span></span><span></span><span></span></div>
          </section>

          <section aria-labelledby="overview-title"><div class="dashboard-section-heading"><div><p>LIVE DATA</p><h2 id="overview-title">Workspace overview</h2></div></div><div id="workspace-metrics" class="workspace-metrics" aria-live="polite">${metricSkeletons()}</div></section>

          <div class="dashboard-content-grid">
            <section id="new-draft" class="new-draft-panel" aria-labelledby="new-draft-title">
              <div class="new-draft-heading"><span>${quillOpsMarkMarkup()}</span><div><p>NEW WORKFLOW</p><h2 id="new-draft-title">Start a new technical article</h2></div></div>
              <p class="new-draft-intro">Describe the topic, intended reader and outcome. QuillOps will research the subject and prepare a plan for your review before writing begins.</p>
              <form id="create-blog-form" novalidate>
                <div class="form-group"><label class="form-label" for="topic-input">Topic or writing brief</label><textarea id="topic-input" class="form-input topic-textarea" required minlength="5" maxlength="400" aria-describedby="topic-help char-counter" placeholder="Explain how durable LangGraph agents recover from failures. Write for backend engineers and include approval boundaries."></textarea><div class="field-meta"><span id="topic-help">Your original brief is preserved.</span><span id="char-counter">0 / 400</span></div></div>
                <div class="brief-options">
                  <div class="form-group"><label class="form-label" for="audience-input">Audience</label><select id="audience-input" class="form-input"><option>General technical audience</option><option>Beginner developers</option><option>Backend engineers</option><option>AI engineers</option><option>Technical leaders</option></select></div>
                  <div class="form-group"><label class="form-label" for="tone-input">Tone</label><select id="tone-input" class="form-input"><option>Technical</option><option>Educational</option><option>Practical</option><option>Concise</option><option>Deep dive</option></select></div>
                  <div class="form-group"><label class="form-label" for="length-input">Target length</label><select id="length-input" class="form-input"><option>Standard</option><option>Short</option><option>Long-form</option></select></div>
                </div>
                <div class="structured-brief" aria-live="polite"><p>STRUCTURED BRIEF</p><div id="structured-brief-preview">Add a topic to preview exactly what will be sent.</div></div>
                <div id="create-error" class="inline-error" role="alert" hidden></div>
                <button type="submit" class="btn btn-primary create-submit">Research and draft outline <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
              </form>
            </section>

            <aside id="workflow-queue" class="workflow-queue-panel" aria-labelledby="queue-title"><div class="dashboard-section-heading"><div><p>REAL-TIME STATE</p><h2 id="queue-title">Active workflow queue</h2></div></div><div id="workflow-queue-list" aria-live="polite"><div class="dashboard-skeleton is-tall"></div></div></aside>
          </div>

          <section id="articles-section" class="articles-section" aria-labelledby="articles-title"><div class="dashboard-section-heading"><div><p>RECENTLY UPDATED</p><h2 id="articles-title">Drafts and articles</h2></div><span id="article-count"></span></div><div id="blogs-list" class="blog-list-container" aria-live="polite"><div class="dashboard-skeleton is-tall"></div></div></section>
  `, after: '<div id="delete-modal-mount"></div>' });

  container.querySelectorAll('[data-scroll-target]').forEach(button => button.addEventListener('click', () => {
    document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }));

  bindCreateForm();
  await fetchAndRenderBlogs();
}

function bindCreateForm() {
  const form = document.getElementById('create-blog-form');
  const topicInput = document.getElementById('topic-input');
  const audienceInput = document.getElementById('audience-input');
  const toneInput = document.getElementById('tone-input');
  const lengthInput = document.getElementById('length-input');
  const counter = document.getElementById('char-counter');
  const preview = document.getElementById('structured-brief-preview');
  const error = document.getElementById('create-error');
  const savedTopic = sessionStorage.getItem('quillops_draft_topic');
  if (savedTopic) {
    topicInput.value = savedTopic;
    sessionStorage.removeItem('quillops_draft_topic');
  }

  const buildBrief = () => {
    const original = topicInput.value.trim();
    if (!original) return '';
    return `${original}\n\nAudience: ${audienceInput.value}. Tone: ${toneInput.value}. Target length: ${lengthInput.value}.`;
  };
  const update = () => {
    const brief = buildBrief();
    counter.textContent = `${topicInput.value.length} / 400`;
    preview.textContent = brief || 'Add a topic to preview exactly what will be sent.';
    preview.classList.toggle('has-content', Boolean(brief));
  };
  [topicInput, audienceInput, toneInput, lengthInput].forEach(input => input.addEventListener('input', update));
  update();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const brief = buildBrief();
    error.hidden = true;
    if (topicInput.value.trim().length < 5) return showFormError(error, 'Give QuillOps at least five characters of direction.');
    if (brief.length > 500) return showFormError(error, 'The structured brief is over the 500 character API limit. Shorten the topic slightly.');
    const submit = form.querySelector('[type="submit"]');
    try {
      submit.disabled = true;
      submit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Starting research…';
      const response = await api.post('/blogs', { topic: brief });
      window.location.hash = `#/blog/${response.id}`;
    } catch (caught) {
      showFormError(error, caught instanceof Error ? caught.message : 'Unable to start the workflow.');
      submit.disabled = false;
      submit.innerHTML = 'Research and draft outline <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    }
  });
}

function showFormError(element, message) { element.textContent = message; element.hidden = false; }

async function fetchAndRenderBlogs() {
  try {
    dashboardBlogs = await api.get('/blogs');
    renderMetrics();
    renderQueue();
    renderArticles();
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : 'Unable to load this workspace.';
    document.getElementById('workspace-metrics').innerHTML = `<div class="dashboard-error">${escapeHtml(message)}</div>`;
    document.getElementById('workflow-queue-list').innerHTML = `<div class="dashboard-empty"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><p>Workflow state unavailable.</p></div>`;
    document.getElementById('blogs-list').innerHTML = `<div class="dashboard-error"><span>${escapeHtml(message)}</span><button class="btn btn-secondary btn-sm" id="retry-blogs" type="button">Retry</button></div>`;
    document.getElementById('retry-blogs')?.addEventListener('click', fetchAndRenderBlogs);
  }
}

function renderMetrics() {
  const metrics = [
    ['Total articles', dashboardBlogs.length, 'fa-regular fa-file-lines'],
    ['Waiting for review', dashboardBlogs.filter(blog => blog.status === 'waiting_for_review').length, 'fa-regular fa-eye'],
    ['In progress', dashboardBlogs.filter(blog => ACTIVE_STATUSES.has(blog.status)).length, 'fa-solid fa-code-branch'],
    ['Ready', dashboardBlogs.filter(blog => blog.status === 'completed').length, 'fa-regular fa-circle-check'],
  ];
  document.getElementById('workspace-metrics').innerHTML = metrics.map(([label, value, icon]) => `<article><span><i class="${icon}" aria-hidden="true"></i></span><div><strong>${value}</strong><small>${label}</small></div></article>`).join('');
}

function renderQueue() {
  const queue = dashboardBlogs.filter(blog => ACTIVE_STATUSES.has(blog.status) || blog.status === 'waiting_for_review').slice(0, 4);
  const container = document.getElementById('workflow-queue-list');
  if (!queue.length) {
    container.innerHTML = '<div class="dashboard-empty compact"><i class="fa-solid fa-check" aria-hidden="true"></i><p>No active workflows.</p><small>New or resumed jobs will appear here.</small></div>';
    return;
  }
  container.innerHTML = `<ol class="real-workflow-list">${queue.map(blog => { const status = getStatusMeta(blog.status); return `<li><span class="status-dot is-${status.tone}" aria-hidden="true"></span><div><strong>${escapeHtml(blog.title || originalTopic(blog.topic))}</strong><small>${status.label}</small></div><a href="#/blog/${blog.id}" aria-label="Open ${escapeHtml(blog.title || originalTopic(blog.topic))}"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></li>`; }).join('')}</ol>`;
}

function renderArticles() {
  const list = document.getElementById('blogs-list');
  document.getElementById('article-count').textContent = `${dashboardBlogs.length} ${dashboardBlogs.length === 1 ? 'article' : 'articles'}`;
  if (!dashboardBlogs.length) {
    list.innerHTML = `<div class="dashboard-empty"><span class="dashboard-empty-mark" aria-hidden="true">${quillOpsMarkMarkup()}</span><h3>Your workspace is empty.</h3><p>Let’s create your first technical article and pause at a plan you control.</p><button class="btn btn-secondary btn-sm" type="button" data-empty-new>Start your first workflow</button></div>`;
    list.querySelector('[data-empty-new]').addEventListener('click', () => document.getElementById('new-draft').scrollIntoView({ behavior: 'smooth' }));
    return;
  }
  list.innerHTML = dashboardBlogs.map(blog => {
    const title = blog.title || originalTopic(blog.topic);
    const status = getStatusMeta(blog.status);
    return `<article class="blog-card"><div class="blog-card-icon"><i class="fa-regular fa-file-lines" aria-hidden="true"></i></div><div class="blog-info"><h3>${escapeHtml(title)}</h3><div class="blog-meta"><span class="status-label is-${status.tone}"><i class="${status.icon}" aria-hidden="true"></i>${status.label}</span><span>Updated ${formatTime(blog.updated_at)}</span><span>v${blog.current_version}</span></div></div><div class="blog-actions"><a class="btn btn-secondary btn-sm" href="#/blog/${blog.id}">Open<span class="sr-only"> ${escapeHtml(title)}</span></a><button class="btn-icon-danger delete-blog-btn" type="button" data-id="${blog.id}" data-title="${escapeHtml(title)}" aria-label="Delete ${escapeHtml(title)}"><i class="fa-regular fa-trash-can" aria-hidden="true"></i></button></div></article>`;
  }).join('');
  list.querySelectorAll('.delete-blog-btn').forEach(button => button.addEventListener('click', () => showDeleteConfirmModal(button.dataset.id, button.dataset.title)));
}

function showDeleteConfirmModal(id, title) {
  const mount = document.getElementById('delete-modal-mount');
  mount.innerHTML = `<div class="modal-backdrop delete-modal"><div class="glass-panel modal-card" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div class="modal-header"><h2 id="delete-title">Delete draft?</h2><button class="btn-icon-danger close-modal-btn" type="button" aria-label="Close delete dialog"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div><div class="modal-body"><p>This permanently deletes the draft and all of its versions.</p><blockquote>“${escapeHtml(title)}”</blockquote></div><div class="modal-footer"><button class="btn btn-secondary cancel-delete-btn" type="button">Cancel</button><button class="btn btn-danger confirm-delete-btn" type="button">Delete draft</button></div></div></div>`;
  const close = () => { mount.innerHTML = ''; document.removeEventListener('keydown', onKeydown); };
  const onKeydown = event => { if (event.key === 'Escape') close(); };
  document.addEventListener('keydown', onKeydown);
  mount.querySelector('.close-modal-btn').addEventListener('click', close);
  mount.querySelector('.cancel-delete-btn').addEventListener('click', close);
  mount.querySelector('.delete-modal').addEventListener('click', event => { if (event.target === event.currentTarget) close(); });
  mount.querySelector('.confirm-delete-btn').addEventListener('click', async event => {
    const button = event.currentTarget;
    try { button.disabled = true; button.textContent = 'Deleting…'; await api.delete(`/blogs/${id}`); close(); await fetchAndRenderBlogs(); }
    catch (caught) { close(); window.alert(caught instanceof Error ? caught.message : 'Unable to delete the draft.'); }
  });
  mount.querySelector('.cancel-delete-btn').focus();
}

function metricSkeletons() { return Array.from({ length: 4 }, () => '<div class="dashboard-skeleton"></div>').join(''); }
function originalTopic(topic = '') { return topic.split('\n\nAudience:')[0]; }
function formatTime(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'recently' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined }).format(date); }
function escapeHtml(value = '') { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }

function getStatusMeta(status) {
  const values = {
    queued: ['Queued', 'pending', 'fa-regular fa-clock'],
    routing: ['Understanding request', 'active', 'fa-solid fa-route'],
    researching: ['Researching topic', 'active', 'fa-solid fa-magnifying-glass'],
    synthesizing_research: ['Organizing evidence', 'active', 'fa-solid fa-layer-group'],
    planning_outline: ['Designing outline', 'active', 'fa-solid fa-list-check'],
    validating_outline: ['Checking outline', 'active', 'fa-solid fa-shield-check'],
    saving_checkpoint: ['Saving checkpoint', 'human', 'fa-solid fa-database'],
    planning: ['Preparing outline', 'active', 'fa-solid fa-list-check'],
    waiting_for_review: ['Waiting for your review', 'human', 'fa-regular fa-eye'],
    queued_for_generation: ['Writing queued', 'pending', 'fa-regular fa-clock'],
    writing: ['Writing sections', 'active', 'fa-solid fa-pen-nib'],
    generating: ['Writing sections', 'active', 'fa-solid fa-pen-nib'],
    assembling: ['Assembling article', 'active', 'fa-solid fa-layer-group'],
    validating_article: ['Validating article', 'active', 'fa-solid fa-shield-check'],
    queued_for_edit: ['Edit queued', 'pending', 'fa-regular fa-clock'],
    editing: ['Refining article', 'active', 'fa-solid fa-wand-magic-sparkles'],
    completed: ['Ready', 'complete', 'fa-regular fa-circle-check'],
    failed: ['Needs attention', 'failed', 'fa-solid fa-triangle-exclamation'],
  };
  const value = values[status] || [String(status || 'Unknown').replaceAll('_', ' '), 'pending', 'fa-regular fa-circle'];
  return { label: value[0], tone: value[1], icon: value[2] };
}
