export const PLANNING_STAGES = Object.freeze([
  { statuses: ['queued', 'routing', 'planning'], title: 'Understanding your request', message: 'Checking the topic, reader and editorial constraints.' },
  { statuses: ['researching'], title: 'Researching the topic', message: 'Reviewing technical sources and relevant documentation.' },
  { statuses: ['synthesizing_research'], title: 'Organizing evidence', message: 'Comparing source coverage and grouping related concepts.' },
  { statuses: ['planning_outline'], title: 'Designing the article structure', message: 'Sequencing the research for the intended reader.' },
  { statuses: ['validating_outline'], title: 'Checking the outline', message: 'Reviewing section coverage, order and technical depth.' },
  { statuses: ['saving_checkpoint'], title: 'Saving your review checkpoint', message: 'Storing the plan so the workflow can pause safely.' },
]);

export function planningStageIndex(status) {
  const index = PLANNING_STAGES.findIndex(stage => stage.statuses.includes(status));
  return index < 0 ? 0 : index;
}

export function planningTimelineStates(status) {
  const active = planningStageIndex(status);
  return PLANNING_STAGES.map((_, index) => index < active ? 'complete' : index === active ? 'active' : 'pending');
}

export function workflowConnectorState(current, next) {
  if (current === 'failed' || next === 'failed') return 'failed';
  if (current === 'complete' && next === 'complete') return 'completed';
  if (current === 'complete' && next === 'active') return 'to-active';
  return 'pending';
}

export function renderPlanningTimeline(status) {
  const states = planningTimelineStates(status);
  return PLANNING_STAGES.map((stage, index) => {
    const state = states[index];
    const marker = state === 'complete' ? '<i class="fa-solid fa-check"></i>' : String(index + 1).padStart(2, '0');
    const connector = index < states.length - 1 ? `<div class="planning-step-connector is-${workflowConnectorState(state, states[index + 1])}" aria-hidden="true"></div>` : '';
    return `<li class="is-${state}"><div class="planning-step-marker-wrap"><div class="planning-step-marker" aria-hidden="true">${marker}</div>${connector}</div><div class="planning-step-content"><span class="planning-step-label">${state.toUpperCase()}</span><span class="planning-step-title">${stage.title}</span></div></li>`;
  }).join('');
}
