import { api, renderArticleWorkspace, renderPlanningVisual, renderReviewWorkspace, renderWritingMissionControl, unmountPlanningVisual, unmountReviewWorkspace, unmountWorkflowWorkspace } from '@/entry';
import { PLANNING_STAGES as planningStages, planningStageIndex, renderPlanningTimeline } from '../workflow-status.js';
import { renderAuthenticatedShell, updateAuthenticatedShell } from '../app-shell.js';

let pollTimeoutId = null;
let activeBlogId = null;
let viewMode = 'view'; // 'view' or 'edit' (for manual markdown edits)
let planningStartedAt = 0;
let consecutivePollErrors = 0;

export async function renderDetail(container, blogId) {
  // Clear any existing polling
  clearPollTimeout();
  activeBlogId = blogId;
  viewMode = 'view';
  planningStartedAt = Date.now();
  consecutivePollErrors = 0;
  unmountPlanningVisual();
  unmountWorkflowWorkspace();

  renderAuthenticatedShell(container, { active: 'article', articleHref: `#/blog/${blogId}`, mainId: 'detail-main', mainClass: 'detail-main', title: 'Loading article', stage: 'WORKFLOW', content: '<div id="detail-workspace-content"><div class="app-shell-loading"><i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i><p>Fetching durable workflow stateâ€¦</p></div></div>', after: '<div id="detail-modal-mount"></div>' });

  // Start polling cycle
  await executePollCycle();
}

function clearPollTimeout() {
  if (pollTimeoutId) {
    clearTimeout(pollTimeoutId);
    pollTimeoutId = null;
  }
}

async function executePollCycle() {
  const workspace = document.getElementById('detail-workspace-content');
  if (!workspace || activeBlogId !== getActiveBlogIdFromHash()) {
    clearPollTimeout();
    return;
  }
  if (document.hidden) {
    pollTimeoutId = setTimeout(executePollCycle, 2500);
    return;
  }

  try {
    const blog = await api.get(`/blogs/${activeBlogId}`);
    consecutivePollErrors = 0;
    updateAuthenticatedShell({ title: blog.title || originalTopic(blog.topic), stage: shellStageLabel(blog.status) });
    
    // Determine view rendering path based on state
    if (isTransitionStatus(blog.status)) {
      unmountReviewWorkspace();
      document.getElementById('detail-back-link')?.removeAttribute('hidden');
      renderTransitionStatusView(workspace, blog);
      // Queue next poll
      pollTimeoutId = setTimeout(executePollCycle, 2500);
    } else if (blog.status === 'waiting_for_review') {
      clearPollTimeout();
      unmountPlanningVisual();
      unmountWorkflowWorkspace();
      document.getElementById('detail-back-link')?.setAttribute('hidden', '');
      renderReviewWorkspace(workspace, blog, executePollCycle);
    } else if (blog.status === 'completed') {
      clearPollTimeout();
      unmountPlanningVisual();
      unmountReviewWorkspace();
      document.getElementById('detail-back-link')?.removeAttribute('hidden');
      renderArticleWorkspace(workspace, blog, executePollCycle);
    } else if (blog.status === 'failed') {
      clearPollTimeout();
      unmountPlanningVisual();
      unmountReviewWorkspace();
      unmountWorkflowWorkspace();
      document.getElementById('detail-back-link')?.removeAttribute('hidden');
      renderFailedView(workspace, blog);
    }
  } catch (err) {
    console.error(err);
    unmountPlanningVisual();
    unmountReviewWorkspace();
    consecutivePollErrors += 1;
    workspace.innerHTML = `
      <div class="glass-panel badge badge-failed" style="padding: 30px; text-align: center; border-radius: 12px; display: flex; flex-direction: column; gap: 8px;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem;"></i>
        <h4 style="color: var(--color-danger)">Network / Server Error</h4>
        <span>${err.message}</span>
        <button id="detail-retry-btn" class="btn btn-secondary btn-sm" type="button" style="margin-top: 15px; align-self: center;">Retry</button>
      </div>
    `;
    document.getElementById('detail-retry-btn')?.addEventListener('click', executePollCycle);
    if (consecutivePollErrors < 4) {
      pollTimeoutId = setTimeout(executePollCycle, Math.min(15000, 2000 * (2 ** consecutivePollErrors)));
    }
  }
}

function getActiveBlogIdFromHash() {
  const hash = window.location.hash || '';
  const parts = hash.split('/');
  if (parts[1] === 'blog' && parts[2]) {
    return parts[2];
  }
  return null;
}

function isTransitionStatus(status) {
  return [
    'queued',
    'routing',
    'researching',
    'synthesizing_research',
    'planning_outline',
    'validating_outline',
    'saving_checkpoint',
    'planning',
    'queued_for_generation',
    'generating',
    'writing',
    'assembling',
    'validating_article',
    'queued_for_edit',
    'editing'
  ].includes(status);
}

function shellStageLabel(status) {
  const labels = {
    queued: 'PLANNING / QUEUED', routing: 'PLANNING / ROUTING', researching: 'PLANNING / RESEARCH',
    synthesizing_research: 'PLANNING / EVIDENCE', planning_outline: 'PLANNING / OUTLINE', validating_outline: 'PLANNING / VALIDATION',
    saving_checkpoint: 'PLANNING / CHECKPOINT', planning: 'PLANNING', waiting_for_review: 'HUMAN REVIEW',
    queued_for_generation: 'WRITING / QUEUED', generating: 'WRITING', writing: 'WRITING', assembling: 'WRITING / ASSEMBLY',
    validating_article: 'WRITING / VALIDATION', queued_for_edit: 'REFINEMENT / QUEUED', editing: 'REFINEMENT', completed: 'ARTICLE WORKSPACE', failed: 'WORKFLOW / ATTENTION',
  };
  return labels[status] || String(status || 'WORKFLOW').replaceAll('_', ' ').toUpperCase();
}

// -----------------------------------------------------------------------------
// Transition View (Progress Bar / Loading Screen)
// -----------------------------------------------------------------------------
function renderTransitionStatusView(parent, blog) {
  if (!['queued', 'routing', 'planning', 'researching', 'synthesizing_research', 'planning_outline', 'validating_outline', 'saving_checkpoint'].includes(blog.status)) {
    unmountPlanningVisual();
    renderWritingMissionControl(parent, blog);
    return;
  }
  unmountWorkflowWorkspace();
  unmountPlanningVisual();
  const activeIndex = planningStageIndex(blog.status);
  const meta = planningStages[activeIndex];
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - planningStartedAt) / 1000));
  const educational = [
    'QuillOps pauses before writing so you can shape the structure.',
    'Your approved plan becomes a durable checkpoint.',
    'Research and planning are preserved before generation begins.',
  ][Math.floor(elapsedSeconds / 8) % 3];
  const activity = planningStages.slice(0, activeIndex + 1).map((stage, index) => `<li class="${index === activeIndex ? 'is-live' : 'is-done'}"><i class="fa-solid ${index === activeIndex ? 'fa-wave-square' : 'fa-check'}" aria-hidden="true"></i><span>${index === activeIndex ? escapeHtml(blog.stage_message || stage.message) : stage.message}</span></li>`).join('');
  const timeline = renderPlanningTimeline(blog.status);
  
  parent.innerHTML = `
    <section class="planning-mission" aria-labelledby="planning-title">
      <header class="planning-mission-header"><div><span>PLANNING MISSION CONTROL</span><h2 id="planning-title">${escapeHtml(originalTopic(blog.topic))}</h2></div><div class="planning-elapsed" aria-label="Elapsed time"><i class="fa-regular fa-clock" aria-hidden="true"></i>${formatElapsed(elapsedSeconds)}</div></header>
      <div class="planning-command-grid">
        <div class="planning-visual-card">
          <div id="planning-energy-mount" class="planning-energy-mount"></div>
          <div class="planning-orbit" aria-hidden="true"><span>${String(activeIndex + 1).padStart(2, '0')}</span></div>
          <div class="planning-current"><span>ACTIVE STAGE</span><h3>${meta.title}</h3><p>${escapeHtml(blog.stage_message || meta.message)}</p></div>
          <div class="planning-progress" role="progressbar" aria-label="Planning progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Number(blog.progress) || 0}"><span style="width:${Math.max(0, Math.min(100, Number(blog.progress) || 0))}%"></span></div>
          <p class="planning-education">${educational}</p>
        </div>
        <aside class="planning-activity" aria-labelledby="activity-title"><div class="planning-panel-heading"><span>LIVE ACTIVITY</span><h3 id="activity-title">What QuillOps is doing</h3></div><ol>${activity}</ol>${elapsedSeconds >= 45 ? '<p class="planning-long-wait">This topic is taking a little longer than usual. QuillOps is still working, and you can safely leave this page—the job will continue in the background.</p>' : ''}</aside>
      </div>
      <div class="planning-timeline-panel"><div class="planning-panel-heading"><span>REAL WORKFLOW STATE</span><h3>Planning timeline</h3></div><ol class="planning-real-timeline">${timeline}</ol></div>
    </section>
  `;
  const shaderMount = document.getElementById('planning-energy-mount');
  if (shaderMount) renderPlanningVisual(shaderMount, blog.status);
}

function renderBackgroundTask(parent, blog) {
  const states = {
    queued_for_generation: ['Writing queued', 'Preparing the approved outline for section workers.'],
    generating: ['Writing your article', 'Specialized workers are drafting and assembling the approved sections.'],
    queued_for_edit: ['Edit queued', 'Your focused revision is waiting for a worker.'],
    editing: ['Refining your article', 'Applying your instruction without regenerating unrelated sections.'],
  };
  const meta = states[blog.status] || ['Working in the background', 'Your durable workflow is continuing.'];
  parent.innerHTML = `<div class="glass-panel status-hero-card"><div class="status-pulse-circle"><i class="fa-solid fa-pen-nib" aria-hidden="true"></i></div><div class="status-info-box"><h3 class="status-title">${meta[0]}</h3><p class="status-desc">${meta[1]}</p></div><div class="planning-progress is-compact"><span style="width:${Math.max(8, Number(blog.progress) || 20)}%"></span></div></div>`;
}

function originalTopic(topic = '') {
  return String(topic).split('\n\nAudience:')[0];
}

function formatElapsed(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

// -----------------------------------------------------------------------------
// Completed View (Article Markdown Reader & sidebar edit options)
// -----------------------------------------------------------------------------
function renderCompletedView(parent, blog) {
  const wordCount = calculateWordCount(blog.content);
  const formattedUpdate = formatTime(blog.updated_at);
  const parsedMarkdown = parseMarkdownContent(blog.content);

  parent.innerHTML = `
    <div class="completed-blog-layout">
      <!-- Left Panel: Content -->
      <div class="glass-panel" style="overflow: hidden;">
        ${viewMode === 'view' ? `
          <!-- Reader Mode -->
          <article class="markdown-body" id="article-markdown-content">
            ${parsedMarkdown}
          </article>
        ` : `
          <!-- Manual Editor Mode -->
          <div style="padding: 32px;">
            <h3 style="margin-bottom: 20px; font-family: var(--font-display);"><i class="fa-solid fa-file-pen"></i> Edit Article</h3>
            <div id="manual-edit-error" class="badge badge-failed" style="width: 100%; display: none; margin-bottom: 20px; padding: 10px; border-radius: 8px;"></div>
            
            <div class="form-group">
              <label class="form-label">Markdown Editor</label>
              <textarea id="manual-content-input" class="form-input edit-textarea" placeholder="Write markdown content...">${escapeHtml(blog.content)}</textarea>
            </div>
            
            <div class="form-group" style="margin-top: 16px;">
              <label class="form-label">Revision Note (Optional)</label>
              <input type="text" id="manual-instruction-input" class="form-input" placeholder="e.g. Fixed grammar errors, updated docker port configuration.">
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 20px;">
              <button id="cancel-edit-btn" class="btn btn-secondary btn-sm">Cancel</button>
              <button id="save-edit-btn" class="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        `}
      </div>

      <!-- Right Panel: Sidebar Controls -->
      <div class="detail-sidebar">
        <!-- Dashboard Metadata -->
        <div class="glass-panel sidebar-card">
          <h3 style="border-bottom: 1px solid var(--border-color); padding-bottom: 12px;"><i class="fa-solid fa-circle-info"></i> Info</h3>
          <div class="metadata-grid">
            <span class="meta-item-label">Status</span>
            <span class="meta-item-value" style="color: var(--primary);">Draft Ready</span>
            
            <span class="meta-item-label">Version</span>
            <span class="meta-item-value">v${blog.current_version}</span>
            
            <span class="meta-item-label">Length</span>
            <span class="meta-item-value">${wordCount} words</span>
            
            <span class="meta-item-label">Saved</span>
            <span class="meta-item-value" title="${blog.updated_at}">${formattedUpdate}</span>
          </div>
          
          <button id="versions-btn" class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 20px; display: inline-flex; justify-content: center; gap: 8px;">
            <i class="fa-solid fa-clock-rotate-left"></i> History & Restore
          </button>
        </div>

        <!-- Sidebar Actions: Editing Panel -->
        ${viewMode === 'view' ? `
          <!-- Show Options in View Mode only -->
          <div class="glass-panel sidebar-card">
            <h3><i class="fa-solid fa-compass-drafting"></i> Editor Desk</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <button id="manual-edit-btn" class="btn btn-secondary btn-sm" style="display: flex; justify-content: center; align-items: center; gap: 8px;">
                <i class="fa-solid fa-file-pen"></i> Edit Article Markdown
              </button>
            </div>
          </div>

          <div class="glass-panel sidebar-card">
            <h3><i class="fa-solid fa-wand-magic-sparkles"></i> AI Co-Pilot Refine</h3>
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 12px;">Ask the AI agent to edit, expand, or adjust your draft asynchronously.</p>
            
            <div id="ai-edit-error" class="badge badge-failed" style="width: 100%; display: none; margin-bottom: 12px; padding: 10px; border-radius: 8px;"></div>
            
            <div class="ai-edit-box">
              <textarea id="ai-instruction-input" class="form-input" style="min-height: 80px; font-size: 0.85rem; resize: vertical;" placeholder="e.g. Rewrite the introductory paragraph in a more conversational tone and fix the second code block."></textarea>
              <button id="ai-edit-submit-btn" class="btn btn-primary btn-sm" style="width: 100%; font-size: 0.85rem;">
                Apply AI Refinement <i class="fa-solid fa-sparkles"></i>
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Apply code block buttons copy logic
  if (viewMode === 'view') {
    const articleContainer = document.getElementById('article-markdown-content');
    if (articleContainer) {
      applyCodeBlockCopyLogic(articleContainer);
    }
  }

  // Bind Sidebar View Buttons
  if (viewMode === 'view') {
    // Versions History Trigger
    document.getElementById('versions-btn').addEventListener('click', () => {
      openVersionsHistoryModal(blog.id);
    });

    // Manual Edit Switch Trigger
    document.getElementById('manual-edit-btn').addEventListener('click', () => {
      viewMode = 'edit';
      renderCompletedView(parent, blog);
    });

    // AI Edit Trigger
    const aiEditBtn = document.getElementById('ai-edit-submit-btn');
    aiEditBtn.addEventListener('click', async () => {
      const instructionInput = document.getElementById('ai-instruction-input');
      const instruction = instructionInput.value.trim();
      const errDiv = document.getElementById('ai-edit-error');
      errDiv.style.display = 'none';

      if (instruction.length < 3 || instruction.length > 1000) {
        errDiv.textContent = 'Instruction must be between 3 and 1000 characters.';
        errDiv.style.display = 'block';
        return;
      }

      try {
        aiEditBtn.disabled = true;
        aiEditBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Request...';

        await api.post(`/blogs/${blog.id}/ai-edit`, { instruction });
        
        // Re-initialize details rendering and polling
        viewMode = 'view';
        executePollCycle();
      } catch (err) {
        console.error(err);
        errDiv.textContent = err.message;
        errDiv.style.display = 'block';
        
        aiEditBtn.disabled = false;
        aiEditBtn.innerHTML = 'Apply AI Refinement <i class="fa-solid fa-sparkles"></i>';
      }
    });
  } else {
    // Bind Manual Editor actions
    document.getElementById('cancel-edit-btn').addEventListener('click', () => {
      viewMode = 'view';
      renderCompletedView(parent, blog);
    });

    document.getElementById('save-edit-btn').addEventListener('click', async () => {
      const content = document.getElementById('manual-content-input').value;
      const instruction = document.getElementById('manual-instruction-input').value.trim() || 'Manual edit';
      const errDiv = document.getElementById('manual-edit-error');
      errDiv.style.display = 'none';

      if (content.length < 1) {
        errDiv.textContent = 'Content cannot be empty.';
        errDiv.style.display = 'block';
        return;
      }

      try {
        const saveBtn = document.getElementById('save-edit-btn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';

        const updatedBlog = await api.put(`/blogs/${blog.id}`, { content, instruction });
        
        viewMode = 'view';
        renderCompletedView(parent, updatedBlog);
      } catch (err) {
        console.error(err);
        errDiv.textContent = err.message;
        errDiv.style.display = 'block';
        
        const saveBtn = document.getElementById('save-edit-btn');
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Save Changes';
      }
    });
  }
}

function calculateWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function parseMarkdownContent(markdownText) {
  if (!markdownText) return '<p style="font-style: italic; color: var(--text-muted)">This draft has no text content yet.</p>';
  try {
    const rawHtml = marked.parse(markdownText);
    return DOMPurify.sanitize(rawHtml);
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<pre>${escapeHtml(markdownText)}</pre>`;
  }
}

function applyCodeBlockCopyLogic(element) {
  const codeBlocks = element.querySelectorAll('pre');
  codeBlocks.forEach(pre => {
    // Create container wrapper to append absolute copy button
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Create absolute copy button
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
    wrapper.appendChild(btn);

    // Copy event click
    btn.addEventListener('click', async () => {
      const codeNode = pre.querySelector('code');
      const textToCopy = codeNode ? codeNode.innerText : pre.innerText;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = '<i class="fa-solid fa-check" style="color: var(--color-success)"></i> Copied';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
        }, 2000);
      } catch (e) {
        btn.innerHTML = 'Error';
      }
    });
  });
}

// -----------------------------------------------------------------------------
// Version History Modal
// -----------------------------------------------------------------------------
async function openVersionsHistoryModal(blogId) {
  const mount = document.getElementById('detail-modal-mount');
  if (!mount) return;

  // Render initial modal layout with loader
  mount.innerHTML = `
    <div class="modal-backdrop">
      <div class="glass-panel modal-card" style="max-width: 650px;">
        <div class="modal-header">
          <h4><i class="fa-solid fa-clock-rotate-left"></i> Version History</h4>
          <button class="btn-icon-danger close-modal-btn" style="padding: 4px; font-size: 1.25rem;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" id="modal-history-content">
          <div style="text-align: center; padding: 30px;">
            <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 1.5rem; color: var(--primary);"></i>
            <p style="margin-top: 10px; color: var(--text-muted)">Fetching historical versions...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary close-modal-btn-footer">Close</button>
        </div>
      </div>
    </div>
  `;

  // Bind close buttons
  const closeModal = () => { mount.innerHTML = ''; };
  mount.querySelector('.close-modal-btn').addEventListener('click', closeModal);
  mount.querySelector('.close-modal-btn-footer').addEventListener('click', closeModal);

  try {
    const versions = await api.get(`/blogs/${blogId}/versions`);
    const historyBody = document.getElementById('modal-history-content');
    
    if (versions.length === 0) {
      historyBody.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No edit history found for this blog.</p>`;
      return;
    }

    historyBody.innerHTML = `
      <div class="version-list" style="margin-top: 10px;">
        ${versions.map((ver) => {
          const date = formatTime(ver.created_at);
          const detailInstruction = ver.edit_instruction || 'Original AI generation';
          return `
            <div class="version-item">
              <div class="version-info">
                <div class="version-title">Version ${ver.version_number}</div>
                <div class="version-desc">${escapeHtml(detailInstruction)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;"><i class="fa-regular fa-clock"></i> ${date}</div>
              </div>
              <div class="version-actions">
                <button class="btn btn-secondary btn-sm preview-version-btn" data-id="${ver.id}" data-num="${ver.version_number}">
                  Preview
                </button>
                <button class="btn btn-primary btn-sm restore-version-btn" data-id="${ver.id}" data-num="${ver.version_number}">
                  Restore
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      
      <!-- Preview Pane Element -->
      <div id="version-preview-pane" class="glass-panel" style="display: none; margin-top: 24px; padding: 20px; background: rgba(0, 0, 0, 0.2); max-height: 250px; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin-bottom: 12px;">
          <strong id="preview-pane-title">Preview Version</strong>
          <button class="btn-icon-danger" id="close-preview-pane" style="padding: 2px;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="preview-pane-body" class="markdown-body" style="font-size: 0.9rem; padding: 0;"></div>
      </div>
    `;

    // Bind preview buttons
    const previewButtons = historyBody.querySelectorAll('.preview-version-btn');
    const previewPane = document.getElementById('version-preview-pane');
    const previewPaneTitle = document.getElementById('preview-pane-title');
    const previewPaneBody = document.getElementById('preview-pane-body');
    const closePreviewBtn = document.getElementById('close-preview-pane');

    closePreviewBtn.addEventListener('click', () => { previewPane.style.display = 'none'; });

    previewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const num = btn.getAttribute('data-num');
        const match = versions.find(v => v.id === id);
        if (match) {
          previewPaneTitle.innerHTML = `<i class="fa-solid fa-eye"></i> Preview Version ${num}`;
          previewPaneBody.innerHTML = parseMarkdownContent(match.content);
          applyCodeBlockCopyLogic(previewPaneBody);
          previewPane.style.display = 'block';
          previewPane.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Bind restore buttons
    const restoreButtons = historyBody.querySelectorAll('.restore-version-btn');
    restoreButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const num = btn.getAttribute('data-num');
        
        const confirmRestore = confirm(`Are you sure you want to restore the active article to Version ${num}? (This will write a new history version so no data is lost)`);
        if (!confirmRestore) return;

        try {
          btn.disabled = true;
          btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Restoring...';
          
          const updatedBlog = await api.post(`/blogs/${blogId}/restore/${id}`);
          closeModal();
          
          // Re-render detail view with updated completed blog
          const workspace = document.getElementById('detail-workspace-content');
          viewMode = 'view';
          renderCompletedView(workspace, updatedBlog);
        } catch (err) {
          alert(`Failed to restore version: ${err.message}`);
          btn.disabled = false;
          btn.innerHTML = 'Restore';
        }
      });
    });

  } catch (err) {
    console.error(err);
    document.getElementById('modal-history-content').innerHTML = `
      <div class="badge badge-failed" style="padding: 15px; width: 100%; border-radius: 8px; text-align: center;">
        <i class="fa-solid fa-triangle-exclamation"></i> Error: ${err.message}
      </div>
    `;
  }
}

// -----------------------------------------------------------------------------
// Failed Status View
// -----------------------------------------------------------------------------
function renderFailedView(parent, blog) {
  const errorLabels = {
    PROVIDER_ERROR: 'Planning provider error',
    RESEARCH_TIMEOUT: 'Research timed out',
    PLANNER_PARSE_ERROR: 'Outline response could not be parsed',
    PLANNER_VALIDATION_ERROR: 'Outline did not pass validation',
    OUTPUT_TRUNCATED: 'Outline response was incomplete',
    INVALID_LENGTH_POLICY: 'Planning configuration problem',
    CHECKPOINT_FAILURE: 'Checkpoint could not be saved',
    WORKER_FAILURE: 'Planning worker interrupted',
    SECTION_GENERATION_FAILED: 'A section worker could not finish',
    ASSEMBLY_VALIDATION_FAILED: 'The assembled draft did not pass validation',
    WRITING_PROVIDER_TIMEOUT: 'The writing provider timed out',
    WRITING_PROVIDER_REJECTED: 'The writing provider rejected the request',
    WRITING_WORKER_FAILED: 'The writing worker was interrupted',
  };
  const writingFailure = new Set(['SECTION_GENERATION_FAILED', 'ASSEMBLY_VALIDATION_FAILED', 'WRITING_PROVIDER_TIMEOUT', 'WRITING_PROVIDER_REJECTED', 'WRITING_WORKER_FAILED']).has(blog.error_code);
  if (writingFailure) {
    parent.innerHTML = `
      <section class="planning-failure" aria-labelledby="failure-title">
        <div class="planning-failure-icon" aria-hidden="true"><i class="fa-solid fa-pen-ruler"></i></div>
        <p class="planning-failure-code">${escapeHtml(errorLabels[blog.error_code] || 'Writing interrupted')}</p>
        <h2 id="failure-title">We couldnâ€™t finish the draft.</h2>
        <p>Your approved plan and every completed section remain saved. Retry continues from the unfinished work instead of starting over.</p>
        <div class="planning-safe-error"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><span><strong>What happened</strong>${escapeHtml(blog.error_message || 'A writing worker temporarily became unavailable.')}</span></div>
        <div id="writing-retry-error" class="inline-error" role="alert" hidden></div>
        <div class="planning-failure-actions">
          <button id="retry-writing-btn" class="btn btn-primary" type="button"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i>Retry failed sections</button>
          <button id="return-review-btn" class="btn btn-secondary" type="button"><i class="fa-solid fa-list-check" aria-hidden="true"></i>Review plan</button>
          <a href="#/dashboard" class="btn btn-secondary"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Return to workspace</a>
        </div>
        <p class="planning-reference">Reference ${escapeHtml(String(blog.id).slice(0, 8))}</p>
      </section>`;
    document.getElementById('retry-writing-btn')?.addEventListener('click', async event => {
      const button = event.currentTarget;
      const error = document.getElementById('writing-retry-error');
      try { button.disabled = true; button.textContent = 'Restarting unfinished sectionsâ€¦'; await api.post(`/blogs/${blog.id}/retry-writing`); await executePollCycle(); }
      catch (caught) { error.textContent = caught instanceof Error ? caught.message : 'Unable to retry writing.'; error.hidden = false; button.disabled = false; button.textContent = 'Retry failed sections'; }
    });
    document.getElementById('return-review-btn')?.addEventListener('click', async event => {
      const button = event.currentTarget;
      const error = document.getElementById('writing-retry-error');
      try { button.disabled = true; button.textContent = 'Opening approved planâ€¦'; await api.post(`/blogs/${blog.id}/return-to-review`); await executePollCycle(); }
      catch (caught) { error.textContent = caught instanceof Error ? caught.message : 'Unable to return to review.'; error.hidden = false; button.disabled = false; button.textContent = 'Review plan'; }
    });
    return;
  }
  const canRetry = Boolean(blog.error_retryable) && Number(blog.attempt_number || 1) < 3;
  const configurationFailure = ['INVALID_LENGTH_POLICY', 'PROVIDER_ERROR'].includes(blog.error_code) && !blog.error_retryable;
  parent.innerHTML = `
    <section class="planning-failure" aria-labelledby="failure-title">
      <div class="planning-failure-icon" aria-hidden="true"><i class="fa-solid fa-exclamation"></i></div>
      <p class="planning-failure-code">${escapeHtml(errorLabels[blog.error_code] || 'Planning interrupted')}</p>
      <h2 id="failure-title">We couldn’t prepare the outline.</h2>
      <p>${configurationFailure ? 'This planning request could not be completed because of a configuration problem.' : 'QuillOps ran into a problem while preparing this article. Your topic, audience, tone and length are saved for a safe retry.'}</p>
      <div class="planning-safe-error"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i><span><strong>What happened</strong>${escapeHtml(blog.error_message || 'The background worker temporarily became unavailable.')}</span></div>
      <div id="planning-retry-error" class="inline-error" role="alert" hidden></div>
      <div class="planning-failure-actions">
        ${canRetry ? '<button id="retry-planning-btn" class="btn btn-primary" type="button"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i>Retry planning</button>' : ''}
        <button id="edit-failed-topic-btn" class="btn btn-secondary" type="button"><i class="fa-solid fa-pen" aria-hidden="true"></i>Edit topic</button>
        <a href="#/dashboard" class="btn btn-secondary"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i>Return to workspace</a>
      </div>
      <p class="planning-reference">Reference ${escapeHtml(String(blog.id).slice(0, 8))} · Attempt ${Number(blog.attempt_number || 1)} of 3</p>
    </section>
  `;
  document.getElementById('retry-planning-btn')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    const error = document.getElementById('planning-retry-error');
    error.hidden = true;
    try {
      button.disabled = true;
      button.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>Retrying planning…';
      await api.post(`/blogs/${blog.id}/retry-planning`);
      planningStartedAt = Date.now();
      await executePollCycle();
    } catch (caught) {
      error.textContent = caught instanceof Error ? caught.message : 'Unable to retry this planning job.';
      error.hidden = false;
      button.disabled = false;
      button.innerHTML = '<i class="fa-solid fa-rotate-right" aria-hidden="true"></i>Retry planning';
    }
  });
  document.getElementById('edit-failed-topic-btn')?.addEventListener('click', () => {
    sessionStorage.setItem('quillops_draft_topic', originalTopic(blog.topic));
    window.location.hash = '#/dashboard';
  });
}

// -----------------------------------------------------------------------------
// Helper Utilities
// -----------------------------------------------------------------------------
function formatTime(isoString) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (e) {
    return 'Recently';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
