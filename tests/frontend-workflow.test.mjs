import test from 'node:test';
import assert from 'node:assert/strict';
import { PLANNING_STAGES, planningTimelineStates, renderPlanningTimeline, workflowConnectorState } from '../frontend/js/workflow-status.js';

test('real workflow status is stable and does not loop', () => {
  assert.deepEqual(planningTimelineStates('planning_outline'), [
    'complete', 'complete', 'complete', 'active', 'pending', 'pending',
  ]);
  assert.deepEqual(planningTimelineStates('planning_outline'), planningTimelineStates('planning_outline'));
});

test('timeline renders exactly one marker per stage', () => {
  const html = renderPlanningTimeline('validating_outline');
  assert.equal((html.match(/class="planning-step-marker"/g) || []).length, PLANNING_STAGES.length);
  assert.equal((html.match(/<li /g) || []).length, PLANNING_STAGES.length);
  assert.equal(html.includes('status-ring'), false);
  assert.equal((html.match(/class="planning-step-connector/g) || []).length, PLANNING_STAGES.length - 1);
});

test('connector state reflects both adjacent workflow states', () => {
  assert.equal(workflowConnectorState('complete', 'complete'), 'completed');
  assert.equal(workflowConnectorState('complete', 'active'), 'to-active');
  assert.equal(workflowConnectorState('active', 'pending'), 'pending');
  assert.equal(workflowConnectorState('failed', 'pending'), 'failed');
});

test('completed, active and pending states remain explicit', () => {
  const html = renderPlanningTimeline('researching');
  assert.match(html, /is-complete/);
  assert.match(html, /is-active/);
  assert.match(html, /is-pending/);
});
