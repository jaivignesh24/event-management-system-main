/**
 * app.js
 * Core logic for the Volunteer/Club Leader Dashboard.
 * Integrates mock API actions, tab routing, modal focus trapping, ripple animations, and toasts.
 */

import {
  getCurrentUser,
  setCurrentUser,
  getRegistrations,
  approveRegistration,
  rejectRegistration,
  getEvents,
  updateEvent
} from './api.js';

// Global application state
let currentUser = null;
let registrations = [];
let events = [];
let activeTab = 'overview';
let activeRegFilter = 'all';

// Track element to restore focus after modal closes (Accessibility best practice)
let lastActiveElement = null;

// ==========================================================================
// INITIALIZATION & ROUTING
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch user session
  currentUser = await getCurrentUser();
  renderUserProfile();

  // 2. Load statistics and data tables
  await refreshDashboardData();

  // 3. Setup Navigation / View router listeners
  setupNavigation();

  // 4. Setup Registration list filter listeners
  setupFilters();

  // 5. Setup Event edit modal form handlers
  setupModalHandlers();

  // 6. Setup Interactive UI animations (ripple effects)
  setupInteractiveEffects();

  // 7. Setup Session management triggers
  setupSessionControls();
});

/**
 * Populates top header and sidebar profile card with session data.
 */
function renderUserProfile() {
  if (!currentUser) return;
  
  // Set names
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-dept').textContent = currentUser.department;
  
  // Create initials for avatar
  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  document.getElementById('user-avatar').textContent = initials;
}

/**
 * Sets up listeners on the sidebar navigation buttons.
 */
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-link');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetPanelId = tab.getAttribute('data-target');
      
      // Update sidebar tab visual styles
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Hide all panels, show matching active panel
      const panels = document.querySelectorAll('.content-panel');
      panels.forEach(panel => {
        panel.classList.remove('active');
      });
      
      const activePanel = document.getElementById(targetPanelId);
      if (activePanel) {
        activePanel.classList.add('active');
      }

      // Update header details based on view
      const pageTitle = document.getElementById('page-title');
      const pageSubtitle = document.getElementById('page-subtitle');

      if (targetPanelId === 'panel-overview') {
        pageTitle.textContent = 'Volunteer Panel';
        pageSubtitle.textContent = 'Welcome back! Manage pending approvals and keep event info fresh.';
        activeTab = 'overview';
      } else if (targetPanelId === 'panel-registrations') {
        pageTitle.textContent = 'Registrations Review';
        pageSubtitle.textContent = 'Review credentials, approve valid entries, or decline duplicate/unauthorized requests.';
        activeTab = 'registrations';
      } else if (targetPanelId === 'panel-events') {
        pageTitle.textContent = 'Managed Events';
        pageSubtitle.textContent = 'Keep event specs, date, time, and venue locations up-to-date.';
        activeTab = 'events';
      }
    });
  });

  // Setup overview dashboard shortcuts
  document.querySelector('.view-all-regs-link').addEventListener('click', () => {
    document.getElementById('tab-registrations').click();
  });
  document.querySelector('.nav-shortcut-regs').addEventListener('click', () => {
    document.getElementById('tab-registrations').click();
  });
  document.querySelector('.nav-shortcut-events').addEventListener('click', () => {
    document.getElementById('tab-events').click();
  });
}

// ==========================================================================
// DATA LOADING, CALCULATIONS & RENDERS
// ==========================================================================

/**
 * Fetches latest records and triggers UI redraws.
 */
async function refreshDashboardData() {
  registrations = await getRegistrations();
  events = await getEvents();

  calculateMetrics();
  renderOverviewTable();
  renderRegistrationsTable();
  renderEventsGrid();
}

/**
 * Processes registration statuses to update stats widgets.
 */
function calculateMetrics() {
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  document.getElementById('metric-total-val').textContent = registrations.length;
  document.getElementById('metric-pending-val').textContent = pendingCount;
  document.getElementById('metric-approved-val').textContent = approvedCount;
  document.getElementById('metric-rejected-val').textContent = rejectedCount;
}

/**
 * Renders the top 3 registrations in the mini dashboard overview table.
 */
function renderOverviewTable() {
  const container = document.getElementById('recent-regs-body');
  container.innerHTML = '';

  // Filter to pending or recent requests, capped at 3
  const recents = registrations.slice(-3).reverse();

  if (recents.length === 0) {
    container.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No entries found</td></tr>`;
    return;
  }

  recents.forEach(reg => {
    const row = document.createElement('tr');
    
    // Select status badge classes
    let badgeClass = 'badge-pending';
    if (reg.status === 'approved') badgeClass = 'badge-approved';
    if (reg.status === 'rejected') badgeClass = 'badge-rejected';

    row.innerHTML = `
      <td>
        <div style="font-weight: 700; color: var(--text-bright);">${reg.studentName}</div>
      </td>
      <td>${reg.eventTitle}</td>
      <td>
        <span class="badge ${badgeClass}">${reg.status}</span>
      </td>
    `;
    container.appendChild(row);
  });
}

/**
 * List filters for the registrations view.
 */
function setupFilters() {
  const filterButtons = document.querySelectorAll('.reg-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRegFilter = btn.getAttribute('data-filter');
      renderRegistrationsTable();
    });
  });
}

/**
 * Main registrations list renderer with Approve/Reject interactive capability.
 */
function renderRegistrationsTable() {
  const container = document.getElementById('all-regs-body');
  container.innerHTML = '';

  // Filter records based on selected tab state
  let filtered = registrations;
  if (activeRegFilter !== 'all') {
    filtered = registrations.filter(r => r.status === activeRegFilter);
  }

  // Handle empty state UI
  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p style="font-weight: 600; font-size: 1.1rem; color: var(--text-bright);">No registration items match criteria</p>
            <p style="font-size: 0.85rem;">Currently no applications with status "${activeRegFilter}" are pending review.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  // Sort: Pending on top
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  sorted.forEach(reg => {
    const row = document.createElement('tr');
    
    let badgeClass = 'badge-pending';
    if (reg.status === 'approved') badgeClass = 'badge-approved';
    if (reg.status === 'rejected') badgeClass = 'badge-rejected';

    // Build the action cells dynamically based on pending status
    let actionMarkup = '';
    if (reg.status === 'pending') {
      actionMarkup = `
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button class="btn btn-sm btn-success approve-btn" data-id="${reg.id}" aria-label="Approve registration for ${reg.studentName}">
            Approve
          </button>
          <button class="btn btn-sm btn-danger reject-btn" data-id="${reg.id}" aria-label="Decline registration for ${reg.studentName}">
            Decline
          </button>
        </div>
      `;
    } else {
      actionMarkup = `
        <div style="text-align: right; color: var(--text-muted); font-size: 0.8rem; font-style: italic;">
          Processed
        </div>
      `;
    }

    row.innerHTML = `
      <td>
        <div style="font-weight: 700; color: var(--text-bright);">${reg.studentName}</div>
      </td>
      <td>
        <div style="font-size: 0.85rem; color: var(--text-muted);">${reg.email}</div>
        <div style="font-size: 0.75rem; color: var(--color-cyan); font-weight: 600;">${reg.department}</div>
      </td>
      <td>
        <div style="font-weight: 600;">${reg.eventTitle}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">ID: ${reg.eventId}</div>
      </td>
      <td style="font-size: 0.85rem; color: var(--text-muted);">${reg.appliedAt}</td>
      <td>
        <span class="badge ${badgeClass}">${reg.status}</span>
      </td>
      <td>
        ${actionMarkup}
      </td>
    `;
    container.appendChild(row);
  });

  // Attach Approve/Reject button listeners
  container.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const regId = btn.getAttribute('data-id');
      createRipple(e);
      await approveRegistration(regId);
      showToast('Registration successfully approved!', 'success');
      await refreshDashboardData();
    });
  });

  container.querySelectorAll('.reject-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const regId = btn.getAttribute('data-id');
      createRipple(e);
      await rejectRegistration(regId);
      showToast('Registration declined successfully.', 'danger');
      await refreshDashboardData();
    });
  });
}

/**
 * Dynamic event listings grid layout renderer.
 */
function renderEventsGrid() {
  const grid = document.getElementById('dashboard-events-grid');
  grid.innerHTML = '';

  if (events.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
        </svg>
        <p style="font-weight: 600; font-size: 1.1rem; color: var(--text-bright);">No events managed</p>
      </div>
    `;
    return;
  }

  events.forEach(evt => {
    const card = document.createElement('article');
    card.className = 'glass-card event-card';
    
    card.innerHTML = `
      <div class="event-image">
        <span class="event-tag">${evt.category}</span>
        <img src="${evt.image}" alt="${evt.title}">
      </div>
      <div class="event-details-body">
        <h3 class="event-title">${evt.title}</h3>
        <p class="event-desc">${evt.description}</p>
        
        <div class="event-meta-info">
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${evt.venue}</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
            </svg>
            <span>${evt.date}</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>${evt.time}</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
            </svg>
            <span>Seats: <strong>${evt.totalSeats}</strong></span>
          </div>
        </div>

        <button class="btn btn-outline edit-evt-trigger" data-id="${evt.id}" style="width: 100%; border-radius: var(--radius-md);" aria-label="Edit details for ${evt.title}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Details
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach event modal triggers
  grid.querySelectorAll('.edit-evt-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      lastActiveElement = btn; // Save to restore focus
      openEditModal(id);
    });
  });
}

// ==========================================================================
// MODAL CONTROLS & FOCUS TRAPPING
// ==========================================================================

/**
 * Initializes listeners for modal open/close actions.
 */
function setupModalHandlers() {
  const overlay = document.getElementById('edit-event-modal');
  const closeTrigger = document.getElementById('modal-close-trigger');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const form = document.getElementById('edit-event-form');

  // Close actions
  closeTrigger.addEventListener('click', closeEditModal);
  cancelBtn.addEventListener('click', closeEditModal);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeEditModal();
  });

  // Keyboard accessibility controls (Escape key and Focus Trapping)
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;

    // 1. Close modal on Escape key press
    if (e.key === 'Escape') {
      closeEditModal();
      return;
    }

    // 2. Focus Trap cycle
    if (e.key === 'Tab') {
      const focusables = overlay.querySelectorAll('input, button, [tabindex="0"]');
      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (e.shiftKey) { // Shift + Tab back-cycle
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Standard Tab forward-cycle
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });

  // Handle updates submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-event-id').value;
    const title = document.getElementById('edit-event-title').value.trim();
    const venue = document.getElementById('edit-event-venue').value.trim();
    const date = document.getElementById('edit-event-date').value;
    const time = document.getElementById('edit-event-time').value.trim();
    const seats = parseInt(document.getElementById('edit-event-seats').value);

    // Simple custom input validation
    if (!title || !venue || !date || !time || isNaN(seats) || seats <= 0) {
      showToast('Validation Failed: Please fill in all specifications correctly.', 'danger');
      return;
    }

    // Call update API
    const result = await updateEvent(id, {
      title,
      venue,
      date,
      time,
      totalSeats: seats
    });

    if (result.success) {
      showToast('Event specifications updated successfully!', 'success');
      closeEditModal();
      await refreshDashboardData();
    } else {
      showToast('Could not save details. Please try again.', 'danger');
    }
  });
}

/**
 * Displays edit dialog loaded with selected event properties.
 */
function openEditModal(eventId) {
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  // Set form inputs
  document.getElementById('edit-event-id').value = event.id;
  document.getElementById('edit-event-title').value = event.title;
  document.getElementById('edit-event-venue').value = event.venue;
  document.getElementById('edit-event-date').value = event.date;
  document.getElementById('edit-event-time').value = event.time;
  document.getElementById('edit-event-seats').value = event.totalSeats;

  // Render modal
  const overlay = document.getElementById('edit-event-modal');
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  // Focus on the first form input element
  setTimeout(() => {
    document.getElementById('edit-event-title').focus();
  }, 100);
}

/**
 * Hides edit dialog and restores cursor focus context.
 */
function closeEditModal() {
  const overlay = document.getElementById('edit-event-modal');
  overlay.classList.remove('active');
  overlay.setAttribute('aria-hidden', 'true');

  // Reset form errors/data
  document.getElementById('edit-event-form').reset();

  // Restore focus to button that opened the modal (Accessiblity)
  if (lastActiveElement) {
    lastActiveElement.focus();
    lastActiveElement = null;
  }
}

// ==========================================================================
// TOAST MESSAGING PIPELINE
// ==========================================================================

/**
 * Creates and appends a floating toast message with auto-cleanup.
 */
function showToast(message, type = 'success') {
  const toastOutlet = document.getElementById('toast-outlet');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  // Icon markup
  let icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  `;
  if (type === 'danger') {
    icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${icon}
    <span style="font-weight: 500; font-size: 0.9rem;">${message}</span>
  `;

  toastOutlet.appendChild(toast);

  // Trigger dismiss animation and remove element
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000);
}

// ==========================================================================
// INTERACTIVE ANIMATIONS
// ==========================================================================

/**
 * Adds event delegation for creating ripple effects inside buttons.
 */
function setupInteractiveEffects() {
  document.addEventListener('click', (e) => {
    // Check if target is a button
    const btn = e.target.closest('.btn, .nav-link, .modal-close-btn');
    if (!btn) return;
    
    // Only add ripple if user clicked with pointer cursor
    if (e.clientX !== 0 && e.clientY !== 0) {
      createRipple(e);
    }
  });
}

/**
 * Injects a absolute positioned growing node inside buttons.
 */
function createRipple(event) {
  const btn = event.currentTarget || event.target.closest('.btn, .nav-link, .modal-close-btn');
  if (!btn) return;

  const circle = document.createElement('span');
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  
  // Calculate relative bounds coordinate
  const rect = btn.getBoundingClientRect();
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');

  // Clean old ripples
  const oldRipple = btn.querySelector('.ripple');
  if (oldRipple) {
    oldRipple.remove();
  }

  btn.appendChild(circle);
}

// ==========================================================================
// LOGOUT & ROLE SWITCH CONTROLLERS
// ==========================================================================

/**
 * Attaches switches on footer links to sign out or toggle roles.
 */
function setupSessionControls() {
  // Role switcher link
  document.getElementById('switch-role-student').addEventListener('click', async () => {
    if (!currentUser) return;
    
    // Set active user session to student role
    const updatedUser = {
      ...currentUser,
      role: 'student'
    };
    await setCurrentUser(updatedUser);
    
    // Redirect to routing page
    window.location.replace('index.html');
  });

  // Logout session link
  document.getElementById('logout-btn').addEventListener('click', async () => {
    await setCurrentUser(null);
    // Redirect back to router index
    window.location.replace('index.html');
  });
}
