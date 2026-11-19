/**
 * Bhami Craft Boutique — Artisan Owner Administration Dashboard Script
 * Handles real-time order tracking, status workflow, notes, photo downloading, and WhatsApp messaging.
 */

(function () {
  'use strict';

  // State Management
  let authToken = sessionStorage.getItem('bhami_admin_token') || '';
  let currentUser = sessionStorage.getItem('bhami_admin_user') || 'Owner';
  let allOrders = [];
  let allEnquiries = [];
  let currentTab = 'all';
  let currentStatus = 'all';
  let currentSort = 'newest';
  let searchQuery = '';
  let currentLightboxPhoto = null;

  // DOM Elements
  const ordersContainer = document.getElementById('ordersContainer');
  const enquiriesContainer = document.getElementById('enquiriesContainer');
  const searchInput = document.getElementById('orderSearchInput');
  const statusFilter = document.getElementById('orderStatusFilter');
  const sortFilter = document.getElementById('orderSortOrder');
  const refreshBtn = document.getElementById('btnRefreshData');
  const exportBtn = document.getElementById('btnExportData');
  const logoutBtn = document.getElementById('sidebarLogoutBtn');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const panelTabs = document.querySelectorAll('.panel-tab');
  const lightboxModal = document.getElementById('adminLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');
  const downloadPhotoBtn = document.getElementById('downloadCurrentPhotoBtn');
  const topbarTitle = document.getElementById('topbarHeaderTitle');

  // ==========================================================================
  // 1. AUTHENTICATION & ACCESS CONTROL
  // ==========================================================================

  async function verifySession() {
    if (!authToken) {
      window.location.replace('login.html');
      return false;
    }

    try {
      const res = await fetch('/api/auth-check', {
        headers: { 'Authorization': 'Bearer ' + authToken }
      });

      if (!res.ok) {
        throw new Error('Session invalid');
      }

      const data = await res.json();
      if (!data.authenticated) {
        throw new Error('Unauthenticated');
      }

      currentUser = data.username || 'Owner';
      const ownerEl = document.getElementById('sidebarOwnerName');
      if (ownerEl) ownerEl.textContent = `${currentUser} (Owner)`;
      return true;
    } catch (e) {
      sessionStorage.removeItem('bhami_admin_token');
      sessionStorage.removeItem('bhami_admin_user');
      window.location.replace('login.html');
      return false;
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + authToken }
      });
    } catch (e) {}
    sessionStorage.removeItem('bhami_admin_token');
    sessionStorage.removeItem('bhami_admin_user');
    window.location.replace('login.html');
  }

  // ==========================================================================
  // 2. DATA FETCHING (STATS, ORDERS, ENQUIRIES)
  // ==========================================================================

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats', {
        headers: { 'Authorization': 'Bearer ' + authToken }
      });
      if (res.ok) {
        const data = await res.json();
        const s = data.stats || {};
        
        // Update metric cards
        const totalEl = document.getElementById('statTotalOrders');
        const pendingEl = document.getElementById('statPendingOrders');
        const acceptedEl = document.getElementById('statAcceptedOrders');
        const completedEl = document.getElementById('statCompletedOrders');
        const customEl = document.getElementById('statCustomEnquiries');

        if (totalEl) totalEl.textContent = s.totalOrders || 0;
        if (pendingEl) pendingEl.textContent = s.pendingOrders || 0;
        if (acceptedEl) acceptedEl.textContent = s.acceptedOrders || 0;
        if (completedEl) completedEl.textContent = s.completedOrders || 0;
        if (customEl) customEl.textContent = s.newCustomEnquiries || 0;

        // Update badge counts
        updateBadges(s);
      }
    } catch (e) {
      console.warn('Could not refresh stats:', e);
    }
  }

  function updateBadges(stats) {
    const customCount = allOrders.filter(o => o.type === 'custom').length;
    const outfitCount = allOrders.filter(o => o.type === 'outfit').length;
    const checkoutCount = allOrders.filter(o => o.type === 'checkout').length;
    const totalCount = allOrders.length;
    const enqCount = allEnquiries.length;

    // Sidebar badges
    const sideAll = document.getElementById('sideBadgeAll');
    const sideCustom = document.getElementById('sideBadgeCustom');
    const sideOutfit = document.getElementById('sideBadgeOutfit');
    const sideCheckout = document.getElementById('sideBadgeCheckout');
    const sideEnq = document.getElementById('sideBadgeEnquiries');

    if (sideAll) sideAll.textContent = totalCount;
    if (sideCustom) sideCustom.textContent = customCount;
    if (sideOutfit) sideOutfit.textContent = outfitCount;
    if (sideCheckout) sideCheckout.textContent = checkoutCount;
    if (sideEnq) sideEnq.textContent = enqCount;

    // Tab badges
    const tabAll = document.getElementById('tabCountAll');
    const tabCustom = document.getElementById('tabCountCustom');
    const tabOutfit = document.getElementById('tabCountOutfit');
    const tabCheckout = document.getElementById('tabCountCheckout');
    const tabEnq = document.getElementById('tabCountEnquiries');

    if (tabAll) tabAll.textContent = totalCount;
    if (tabCustom) tabCustom.textContent = customCount;
    if (tabOutfit) tabOutfit.textContent = outfitCount;
    if (tabCheckout) tabCheckout.textContent = checkoutCount;
    if (tabEnq) tabEnq.textContent = enqCount;
  }

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': 'Bearer ' + authToken }
      });
      if (res.ok) {
        const data = await res.json();
        allOrders = data.orders || [];
        renderCurrentView();
        fetchStats();
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
      showToast('Network error while loading orders.', 'error');
    }
  }

  async function fetchEnquiries() {
    try {
      const res = await fetch('/api/enquiries', {
        headers: { 'Authorization': 'Bearer ' + authToken }
      });
      if (res.ok) {
        const data = await res.json();
        allEnquiries = data.enquiries || [];
        if (currentTab === 'enquiries') {
          renderEnquiries();
        }
        fetchStats();
      }
    } catch (e) {
      console.warn('Failed to fetch enquiries:', e);
    }
  }

  // ==========================================================================
  // 3. ORDER ACTIONS (ACCEPT, IN PROGRESS, COMPLETE, REJECT, DELETE, NOTES)
  // ==========================================================================

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Order #${orderId} marked as "${newStatus}"`, 'success');
        // Update local object
        const order = allOrders.find(o => o.id === orderId);
        if (order) order.status = newStatus;
        renderCurrentView();
        fetchStats();
      } else {
        showToast('Failed to update status. Please try again.', 'error');
      }
    } catch (e) {
      showToast('Error updating status.', 'error');
    }
  }

  async function saveAdminNote(orderId, notes) {
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ admin_notes: notes })
      });

      if (res.ok) {
        showToast(`Admin note saved for #${orderId}`, 'success');
        const order = allOrders.find(o => o.id === orderId);
        if (order) order.admin_notes = notes;
      } else {
        showToast('Failed to save note.', 'error');
      }
    } catch (e) {
      showToast('Error saving note.', 'error');
    }
  }

  async function deleteOrder(orderId) {
    if (!confirm(`Are you sure you want to delete order #${orderId}? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + authToken }
      });

      if (res.ok) {
        showToast(`Order #${orderId} deleted permanently.`, 'info');
        allOrders = allOrders.filter(o => o.id !== orderId);
        renderCurrentView();
        fetchStats();
      } else {
        showToast('Failed to delete order.', 'error');
      }
    } catch (e) {
      showToast('Error deleting order.', 'error');
    }
  }

  async function updateEnquiryStatus(enqId, newStatus) {
    try {
      const res = await fetch(`/api/enquiries/${encodeURIComponent(enqId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        showToast(`Enquiry marked as "${newStatus}"`, 'success');
        const enq = allEnquiries.find(e => e.id === enqId);
        if (enq) enq.status = newStatus;
        renderEnquiries();
        fetchStats();
      }
    } catch (e) {
      showToast('Error updating enquiry.', 'error');
    }
  }

  // ==========================================================================
  // 4. RENDERING & FILTERING
  // ==========================================================================

  function renderCurrentView() {
    if (currentTab === 'enquiries') {
      ordersContainer.style.display = 'none';
      enquiriesContainer.style.display = 'block';
      renderEnquiries();
      return;
    }

    ordersContainer.style.display = 'block';
    enquiriesContainer.style.display = 'none';

    let filtered = [...allOrders];

    // Filter by Tab (Category)
    if (currentTab !== 'all') {
      filtered = filtered.filter(o => o.type === currentTab);
    }

    // Filter by Status
    if (currentStatus !== 'all') {
      filtered = filtered.filter(o => {
        if (currentStatus === 'Pending') {
          return o.status === 'Pending' || o.status === 'New Inquiry' || o.status === 'Under Review';
        }
        if (currentStatus === 'Accepted') {
          return o.status === 'Accepted' || o.status === 'Approved';
        }
        return o.status === currentStatus;
      });
    }

    // Filter by Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => {
        const text = [
          o.id,
          o.customer_name,
          o.customer_phone,
          o.city,
          o.category,
          o.custom_text,
          o.instructions,
          o.admin_notes,
          o.status
        ].filter(Boolean).join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    // Sort Orders
    if (currentSort === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (currentSort === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    } else if (currentSort === 'event') {
      filtered.sort((a, b) => (a.event_date || '9999').localeCompare(b.event_date || '9999'));
    }

    if (filtered.length === 0) {
      ordersContainer.innerHTML = `
        <div class="orders-empty-state">
          <i class="fa-solid fa-folder-open"></i>
          <h3>No Orders Found</h3>
          <p>${searchQuery || currentStatus !== 'all' ? 
            'No orders match your active filter criteria. Try adjusting your search query or filters.' : 
            'No customer orders recorded yet. As soon as a customer submits an order or customization request on the website, it will be automatically saved and displayed here in real time.'
          }</p>
        </div>
      `;
      return;
    }

    ordersContainer.innerHTML = filtered.map(order => renderOrderCard(order)).join('');

    // Attach event listeners to newly rendered elements
    attachOrderCardEvents();
  }

  function renderOrderCard(order) {
    const isCustom = order.type === 'custom';
    const isOutfit = order.type === 'outfit';
    const badgeClass = isCustom ? 'badge-custom' : (isOutfit ? 'badge-outfit' : 'badge-checkout');
    const badgeText = isCustom ? 'Custom Craft' : (isOutfit ? 'Outfit Studio' : 'Direct Cart');

    // Status styling
    let statusClass = 'status-pending';
    const stLower = (order.status || 'Pending').toLowerCase();
    if (stLower.includes('accept') || stLower.includes('approve')) statusClass = 'status-accepted';
    else if (stLower.includes('progress') || stLower.includes('production')) statusClass = 'status-in-progress';
    else if (stLower.includes('complete') || stLower.includes('dispatch')) statusClass = 'status-completed';
    else if (stLower.includes('reject') || stLower.includes('cancel')) statusClass = 'status-rejected';

    // Format created date
    const formattedDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Recently';

    // WhatsApp Message
    const phoneDigits = (order.customer_phone || '').replace(/[^0-9]/g, '');
    const waPhone = phoneDigits.length === 10 ? '91' + phoneDigits : phoneDigits;
    const waText = encodeURIComponent(
      `Namaste ${order.customer_name}! 🙏\nThis is Bhami Craft Boutique regarding your inquiry #${order.id} for "${order.category || order.title}".\n\nStatus: ${order.status || 'Under Review'}\nWe are contacting you to confirm your personalization details. Thank you for choosing Bhami Craft Boutique!`
    );
    const waLink = `https://wa.me/${waPhone}?text=${waText}`;

    // Photos
    const photos = order.referenceImages || [];

    return `
      <div class="order-card" data-id="${order.id}">
        <!-- Card Header -->
        <div class="order-card-header">
          <div class="order-id-group">
            <span class="order-ref">#${escapeHtml(order.id)}</span>
            <span class="order-type-badge ${badgeClass}">${badgeText}</span>
            <span class="order-date-text">
              <i class="fa-regular fa-calendar-days"></i> ${formattedDate}
            </span>
          </div>

          <div class="order-status-badge-wrap">
            <span class="status-pill ${statusClass}">
              <i class="fa-solid fa-circle-dot"></i> ${escapeHtml(order.status || 'Pending')}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="order-card-body">
          <!-- Customer Bar -->
          <div class="customer-summary-bar">
            <div class="cust-item">
              <i class="fa-solid fa-user"></i>
              <strong>${escapeHtml(order.customer_name)}</strong>
            </div>

            <div class="cust-item">
              <i class="fa-solid fa-phone"></i>
              <span>${escapeHtml(order.customer_phone)}</span>
              ${phoneDigits ? `
                <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-wa-chat" title="Open direct WhatsApp conversation with customer">
                  <i class="fa-brands fa-whatsapp"></i> Contact Customer
                </a>
              ` : ''}
            </div>

            <div class="cust-item">
              <i class="fa-solid fa-location-dot"></i>
              <span>${escapeHtml(order.city || 'Location not specified')}</span>
            </div>
          </div>

          <!-- Specs Grid -->
          <div class="order-specs-grid">
            <div class="spec-cell">
              <span class="spec-cell-label">Selected Product / Item</span>
              <span class="spec-cell-val">${escapeHtml(order.category || order.title)}</span>
            </div>

            <div class="spec-cell">
              <span class="spec-cell-label">Customization Details / Text</span>
              <span class="spec-cell-val">${escapeHtml(order.custom_text || 'Standard / None')}</span>
            </div>

            <div class="spec-cell">
              <span class="spec-cell-label">Required Date</span>
              <span class="spec-cell-val">${order.event_date ? escapeHtml(order.event_date) : 'Flexible'}</span>
            </div>

            <div class="spec-cell">
              <span class="spec-cell-label">Budget / Price</span>
              <span class="spec-cell-val price">${escapeHtml(order.budget || '₹' + (order.total || 'Flexible'))}</span>
            </div>
          </div>

          <!-- Special Customer Instructions -->
          ${order.instructions && order.instructions !== 'No special requests specified.' && order.instructions !== 'No specific instructions provided.' ? `
            <div class="order-instructions-box">
              <strong><i class="fa-solid fa-message"></i> Customer Special Instructions:</strong>
              “${escapeHtml(order.instructions)}”
            </div>
          ` : ''}

          <!-- Uploaded Reference Photos Gallery -->
          <div class="order-photos-container">
            <div class="order-photos-title">
              <span><i class="fa-solid fa-camera-retro text-gold"></i> Uploaded Reference Photos (${photos.length})</span>
              ${photos.length > 0 ? `<span style="font-size:0.75rem; color:var(--text-muted);">Click image to view &amp; download</span>` : ''}
            </div>

            ${photos.length > 0 ? `
              <div class="photos-gallery">
                ${photos.map((p, idx) => {
                  const src = p.url || p.dataUrl;
                  const name = p.name || `Photo #${idx + 1}`;
                  return `
                    <div class="photo-thumb-wrapper" data-src="${src}" data-name="${escapeHtml(name)}" data-order="${order.id}">
                      <img src="${src}" alt="${escapeHtml(name)}" class="photo-thumb-img" loading="lazy">
                      <div class="photo-thumb-hover">
                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                        <span>Enlarge</span>
                      </div>
                      <button type="button" class="photo-download-btn" title="Download this photo" data-src="${src}" data-name="${escapeHtml(name)}" data-order="${order.id}">
                        <i class="fa-solid fa-download"></i>
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : `
              <p style="font-size:0.8rem; color:var(--text-light); font-style:italic;">
                No reference photos uploaded for this order (Standard design selected).
              </p>
            `}
          </div>

          <!-- Admin Notes Section -->
          <div class="order-notes-section">
            <div class="order-notes-title">
              <span><i class="fa-solid fa-pen-to-square"></i> Internal Admin Notes (Private)</span>
            </div>
            <div class="notes-input-group">
              <textarea class="notes-textarea" data-id="${order.id}" placeholder="Add private notes (e.g. fabric ordered, customer requested expedited dispatch, color confirmed on call)...">${escapeHtml(order.admin_notes || '')}</textarea>
              <button type="button" class="btn-save-note" data-id="${order.id}">
                <i class="fa-solid fa-floppy-disk"></i> Save Note
              </button>
            </div>
          </div>

          <!-- Order Actions Bar -->
          <div class="order-actions-bar">
            <div class="status-action-btns">
              <button type="button" class="btn-status-act btn-act-accept" data-id="${order.id}" title="Accept this order">
                <i class="fa-solid fa-check"></i> Accept Order
              </button>
              <button type="button" class="btn-status-act btn-act-progress" data-id="${order.id}" title="Mark crafting in progress">
                <i class="fa-solid fa-hourglass-half"></i> In Progress
              </button>
              <button type="button" class="btn-status-act btn-act-complete" data-id="${order.id}" title="Mark crafting completed & dispatched">
                <i class="fa-solid fa-circle-check"></i> Completed
              </button>
              <button type="button" class="btn-status-act btn-act-reject" data-id="${order.id}" title="Reject or cancel order">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
            </div>

            <button type="button" class="btn-order-delete" data-id="${order.id}" title="Delete this order record">
              <i class="fa-solid fa-trash-can"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderEnquiries() {
    if (allEnquiries.length === 0) {
      enquiriesContainer.innerHTML = `
        <div class="orders-empty-state">
          <i class="fa-solid fa-inbox"></i>
          <h3>No Custom Enquiries Yet</h3>
          <p>Customer contact messages and general inquiries submitted on the storefront will appear here.</p>
        </div>
      `;
      return;
    }

    enquiriesContainer.innerHTML = `
      <div style="background:var(--surface); border-radius:var(--radius-md); border:1px solid var(--border-color); overflow:hidden;">
        <table class="enquiries-table">
          <thead>
            <tr>
              <th>ID &amp; Date</th>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Subject &amp; Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${allEnquiries.map(enq => {
              const formattedDate = enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Recently';

              const phoneDigits = (enq.phone || '').replace(/[^0-9]/g, '');
              const waLink = phoneDigits ? `https://wa.me/91${phoneDigits}?text=${encodeURIComponent(`Namaste ${enq.name}! Thank you for contacting Bhami Craft Boutique regarding "${enq.subject}".`)}` : '';

              return `
                <tr>
                  <td>
                    <strong>#${escapeHtml(enq.id)}</strong><br>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${formattedDate}</span>
                  </td>
                  <td>
                    <strong>${escapeHtml(enq.name)}</strong>
                  </td>
                  <td>
                    ${enq.email ? `<div><i class="fa-solid fa-envelope" style="color:var(--text-light); font-size:0.75rem;"></i> ${escapeHtml(enq.email)}</div>` : ''}
                    ${enq.phone ? `<div><i class="fa-solid fa-phone" style="color:var(--text-light); font-size:0.75rem;"></i> ${escapeHtml(enq.phone)}</div>` : ''}
                  </td>
                  <td style="max-width:320px;">
                    <strong>${escapeHtml(enq.subject || 'General Inquiry')}</strong>
                    <div style="font-size:0.82rem; color:var(--text-dark); margin-top:0.25rem;">
                      “${escapeHtml(enq.message)}”
                    </div>
                  </td>
                  <td>
                    <span class="status-pill ${enq.status === 'Replied' ? 'status-completed' : 'status-pending'}">
                      ${escapeHtml(enq.status || 'New')}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                      ${waLink ? `
                        <a href="${waLink}" target="_blank" class="btn-wa-chat" style="padding:0.25rem 0.55rem; font-size:0.75rem;">
                          <i class="fa-brands fa-whatsapp"></i> Chat
                        </a>
                      ` : ''}
                      <button type="button" class="btn-topbar-action btn-enq-status" data-id="${enq.id}" data-status="${enq.status === 'Replied' ? 'New' : 'Replied'}" style="padding:0.25rem 0.55rem; font-size:0.75rem;">
                        <i class="fa-solid fa-check-double"></i> ${enq.status === 'Replied' ? 'Mark New' : 'Mark Replied'}
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Wire enquiry status toggles
    enquiriesContainer.querySelectorAll('.btn-enq-status').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const st = btn.getAttribute('data-status');
        updateEnquiryStatus(id, st);
      };
    });
  }

  function attachOrderCardEvents() {
    // Status Action Buttons
    ordersContainer.querySelectorAll('.btn-act-accept').forEach(btn => {
      btn.onclick = () => updateOrderStatus(btn.getAttribute('data-id'), 'Accepted');
    });

    ordersContainer.querySelectorAll('.btn-act-progress').forEach(btn => {
      btn.onclick = () => updateOrderStatus(btn.getAttribute('data-id'), 'In Progress');
    });

    ordersContainer.querySelectorAll('.btn-act-complete').forEach(btn => {
      btn.onclick = () => updateOrderStatus(btn.getAttribute('data-id'), 'Completed');
    });

    ordersContainer.querySelectorAll('.btn-act-reject').forEach(btn => {
      btn.onclick = () => updateOrderStatus(btn.getAttribute('data-id'), 'Rejected');
    });

    ordersContainer.querySelectorAll('.btn-order-delete').forEach(btn => {
      btn.onclick = () => deleteOrder(btn.getAttribute('data-id'));
    });

    // Save Notes Buttons
    ordersContainer.querySelectorAll('.btn-save-note').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const textarea = ordersContainer.querySelector(`.notes-textarea[data-id="${id}"]`);
        if (textarea) {
          saveAdminNote(id, textarea.value.trim());
        }
      };
    });

    // Photo Thumb Click -> Open Lightbox
    ordersContainer.querySelectorAll('.photo-thumb-wrapper').forEach(wrap => {
      wrap.onclick = (e) => {
        // If clicked on download button directly, don't open lightbox
        if (e.target.closest('.photo-download-btn')) return;
        const src = wrap.getAttribute('data-src');
        const name = wrap.getAttribute('data-name');
        const orderId = wrap.getAttribute('data-order');
        openLightbox(src, name, orderId);
      };
    });

    // Photo Direct Download Button
    ordersContainer.querySelectorAll('.photo-download-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const src = btn.getAttribute('data-src');
        const name = btn.getAttribute('data-name');
        const orderId = btn.getAttribute('data-order');
        downloadImageFile(src, `${orderId}_${name}`);
      };
    });
  }

  // ==========================================================================
  // 5. LIGHTBOX & IMAGE DOWNLOAD
  // ==========================================================================

  function openLightbox(src, name, orderId) {
    if (!lightboxModal || !lightboxImg) return;
    currentLightboxPhoto = { src, name, orderId };
    lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = `${name} — Order #${orderId}`;
    if (lightboxMeta) lightboxMeta.textContent = 'Loading dimensions...';

    lightboxImg.onload = () => {
      if (lightboxMeta) {
        lightboxMeta.textContent = `Natural Dimensions: ${lightboxImg.naturalWidth} × ${lightboxImg.naturalHeight}px`;
      }
    };

    lightboxModal.classList.add('open');
  }

  function closeLightbox() {
    if (lightboxModal) lightboxModal.classList.remove('open');
    currentLightboxPhoto = null;
  }

  function downloadImageFile(src, filename) {
    if (!src) return;
    showToast(`Downloading photo ${filename}...`, 'info');

    // If data URL or direct file link, trigger browser download
    const a = document.createElement('a');
    a.href = src;
    a.download = filename || 'customer_reference_photo.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ==========================================================================
  // 6. EVENT LISTENERS & SETUP
  // ==========================================================================

  function setupEventListeners() {
    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim();
        renderCurrentView();
      });
    }

    // Status filter dropdown
    if (statusFilter) {
      statusFilter.addEventListener('change', () => {
        currentStatus = statusFilter.value;
        renderCurrentView();
      });
    }

    // Sort filter dropdown
    if (sortFilter) {
      sortFilter.addEventListener('change', () => {
        currentSort = sortFilter.value;
        renderCurrentView();
      });
    }

    // Refresh button
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Refreshing...';
        Promise.all([fetchOrders(), fetchEnquiries()]).then(() => {
          showToast('Dashboard synchronized with database.', 'success');
          setTimeout(() => {
            refreshBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Refresh';
          }, 400);
        });
      });
    }

    // Export JSON Button
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (allOrders.length === 0) {
          showToast('No orders to export.', 'warning');
          return;
        }
        const exportData = {
          exportDate: new Date().toISOString(),
          totalOrders: allOrders.length,
          orders: allOrders
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bhami_craft_boutique_orders_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Orders export complete!', 'success');
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }

    // Sidebar navigation tabs
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const tab = link.getAttribute('data-tab');
        setActiveTab(tab);
      });
    });

    // Panel tabs
    panelTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter');
        setActiveTab(filter);
      });
    });

    // Lightbox modal controls
    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
      });
    }
    if (downloadPhotoBtn) {
      downloadPhotoBtn.addEventListener('click', () => {
        if (currentLightboxPhoto) {
          downloadImageFile(currentLightboxPhoto.src, `${currentLightboxPhoto.orderId}_${currentLightboxPhoto.name}`);
        }
      });
    }

    // Escape key closes lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    // Live clock ticker
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // Auto-refresh orders every 30 seconds
    setInterval(() => {
      fetchOrders();
      fetchEnquiries();
    }, 30000);
  }

  function setActiveTab(tab) {
    currentTab = tab;

    // Sync panel tabs
    panelTabs.forEach(t => {
      if (t.getAttribute('data-filter') === tab) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Sync sidebar links
    sidebarLinks.forEach(l => {
      if (l.getAttribute('data-tab') === tab) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });

    // Update title
    if (topbarTitle) {
      if (tab === 'custom') topbarTitle.textContent = 'Custom Crafts & Keepsake Orders';
      else if (tab === 'outfit') topbarTitle.textContent = 'Bespoke Outfit Studio Inquiries';
      else if (tab === 'checkout') topbarTitle.textContent = 'Direct Catalogue Cart Purchases';
      else if (tab === 'enquiries') topbarTitle.textContent = 'Custom Enquiries & Customer Messages';
      else topbarTitle.textContent = 'Bespoke Orders & Inquiries Dashboard';
    }

    renderCurrentView();
  }

  function updateLiveClock() {
    const el = document.getElementById('liveClockDisplay');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    }
  }

  // ==========================================================================
  // 7. TOAST NOTIFICATIONS & UTILS
  // ==========================================================================

  function showToast(message, type = 'info') {
    const container = document.getElementById('adminToastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    let icon = 'fa-solid fa-circle-info';
    if (type === 'success') icon = 'fa-solid fa-circle-check';
    else if (type === 'error') icon = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `<i class="${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  async function init() {
    const isAuthed = await verifySession();
    if (!isAuthed) return;

    setupEventListeners();
    await Promise.all([fetchOrders(), fetchEnquiries()]);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
