// =========================================
// DEFAULT MOCK DATA (Fallback)
// =========================================
const defaultState = {
    settings: { name: "Megan Norton", handle: "@megnorton", darkMode: false },
    properties: [
        { id: 1, title: "3 Bedroom Apartment - East Legon", location: "Accra, Ghana", price: "$2,500/mo", category: "Apartment", status: "Active" },
        { id: 2, title: "Offplan Listing - Serenity Villas", location: "Cantonments", price: "$450,000", category: "Offplan", status: "Pending" },
        { id: 3, title: "Luxury Condo", location: "Osu", price: "$3,200/mo", category: "Apartment", status: "Active" }
    ],
    leads: [
        { id: 1, name: "Floyd Miles", contact: "floyd@example.com", property: "East Legon Apt", status: "New" },
        { id: 2, name: "Guy Hawkins", contact: "0541234567", property: "Serenity Villas", status: "Contacted" },
        { id: 3, name: "Kristin Watson", contact: "kristin@example.com", property: "Luxury Condo", status: "Closed" }
    ],
    clients: [
        { id: 1, name: "Jenny Wilson", email: "jenny@example.com", registered: "2023-05-10" },
        { id: 2, name: "Eleanor Pena", email: "eleanor@example.com", registered: "2023-05-12" }
    ],
    blogs: [
        { id: 1, title: "Top 10 Areas to Invest in Accra", excerpt: "Discover the fast-growing neighborhoods.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
    ],
    activities: [
        { id: 1, user: "System", action: "System initialized", time: "Just now" }
    ],
    tasks: [
        { id: 1, title: "Meet your team", desc: "Introduction call with the new hires.", deadline: "Today, 10:00", assignee: "Louise Green", completed: true, priority: false },
        { id: 2, title: "Read the brand book", desc: "Review the updated UI kit in Figma.", deadline: "Today, 14:00", assignee: "Louise Green", completed: false, priority: true },
        { id: 3, title: "Review NovaCare App", desc: "Check the current prototype flows.", deadline: "Tomorrow, 09:00", assignee: "Mark Fell", completed: false, priority: false }
    ]
};

// =========================================
// STATE MANAGEMENT (localStorage Persistence)
// =========================================
let state = JSON.parse(localStorage.getItem('wenamyAdminState'));
if (!state) {
    state = defaultState;
    saveState();
}

// Ensure tasks array exists in case of old cached state
if(!state.tasks) state.tasks = defaultState.tasks;

function saveState() {
    localStorage.setItem('wenamyAdminState', JSON.stringify(state));
}

// Global Filter Variables
let currentTaskFilter = 'all'; 

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme();
    initTaskTrackerUI();
    
    // Initial renders
    renderDashboard();
    renderProperties();
    renderLeads();
    renderClients();
    renderBlogs();
    renderTasks();
    renderSidebarProfile();
    
    // Init Chart.js on Dashboard
    initChart();
});

// =========================================
// CORE SPA NAVIGATION
// =========================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pageSections = document.querySelectorAll('.page-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if(!item.hasAttribute('data-target')) return;
            e.preventDefault();
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            const targetId = item.getAttribute('data-target');
            pageSections.forEach(section => {
                section.classList.remove('active');
                if(section.id === `page-${targetId}`) section.classList.add('active');
            });
            
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('sidebar-overlay').classList.remove('active');
        });
    });

    const hamburgerBtn = document.getElementById('hamburger-menu');
    hamburgerBtn.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('sidebar-overlay').classList.toggle('active');
    });
    document.getElementById('sidebar-overlay').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
    });
}
function navigateTo(pageTarget) {
    const targetLink = document.querySelector(`.nav-item[data-target="${pageTarget}"]`);
    if(targetLink) targetLink.click();
}

// =========================================
// GLOBAL HELPERS
// =========================================
function addActivity(msg) {
    state.activities.unshift({
        id: Date.now(),
        user: state.settings.name,
        action: msg,
        time: "Just now"
    });
    if(state.activities.length > 5) state.activities.pop();
    saveState();
    renderActivityFeed();
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = type === 'error' ? `<i class="ph ph-warning-circle"></i> ${message}` : `<i class="ph ph-check-circle"></i> ${message}`;
    
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3500);
}

// =========================================
// MODAL ENGINE
// =========================================
function openModal(title, bodyHTML) {
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    content.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="modal-close" onclick="closeModal()"><i class="ph ph-x"></i></button>
        </div>
        <div class="modal-body">
            ${bodyHTML}
        </div>
    `;
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal-container').classList.remove('active');
}

// =========================================
// DASHBOARD VIEW
// =========================================
function renderDashboard() {
    document.getElementById('stat-properties').innerText = state.properties.length;
    document.getElementById('stat-leads').innerText = state.leads.length;
    if(document.getElementById('nav-lead-count')) document.getElementById('nav-lead-count').innerText = `+${state.leads.length}`;

    const rpContainer = document.getElementById('dashboard-recent-properties');
    rpContainer.innerHTML = state.properties.slice(0, 3).map(p => `
        <div class="project-item">
            <div class="project-info">
                <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=100&q=80" class="project-avatar">
                <div class="project-text">
                    <h4>${p.title}</h4>
                    <p>${p.location} &bull; ${p.category}</p>
                </div>
            </div>
            <div class="status-${p.status.toLowerCase()}"><span class="status-dot"></span>${p.status}</div>
        </div>
    `).join('');
    
    if(state.properties.length === 0) rpContainer.innerHTML = '<p class="text-muted text-center py-4">No properties available.</p>';
}

function renderActivityFeed() {
    // Legacy placeholder if needed
}

// =========================================
// PROPERTIES CRUD
// =========================================
function renderProperties() {
    const grid = document.getElementById('properties-grid');
    const filter = document.getElementById('property-filter') ? document.getElementById('property-filter').value : 'All';
    const search = document.getElementById('property-search') ? document.getElementById('property-search').value.toLowerCase() : '';

    const filtered = state.properties.filter(p => {
        const matchesCat = filter === 'All' || p.category === filter;
        const matchesSearch = p.title.toLowerCase().includes(search) || p.location.toLowerCase().includes(search);
        return matchesCat && matchesSearch;
    });

    grid.innerHTML = filtered.map(p => `
        <div class="project-card">
            <img src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80" class="project-card-img" alt="Property">
            <h3 class="project-card-title">${p.title}</h3>
            <p class="project-card-loc"><i class="ph ph-map-pin"></i> ${p.location}</p>
            <div class="project-card-footer">
                <strong>${p.price}</strong>
                <div class="table-actions">
                    <button class="btn-icon" onclick="openPropertyModal(${p.id})" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn-icon text-danger" onclick="deleteProperty(${p.id})" title="Delete"><i class="ph ph-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');
    
    if(filtered.length === 0) grid.innerHTML = `<p style="padding:24px; color:var(--color-text-muted)">No properties found.</p>`;
    renderDashboard();
}

function openPropertyModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? state.properties.find(p => p.id === id) : { title: '', location: '', price: '', category: 'Apartment' };
    
    const formHTML = `
        <form onsubmit="saveProperty(event, ${id})">
            <div class="form-group"><label>Title</label><input type="text" id="prop-title" class="input-field" value="${item.title}" required></div>
            <div class="form-group"><label>Location</label><input type="text" id="prop-loc" class="input-field" value="${item.location}" required></div>
            <div class="form-group"><label>Price</label><input type="text" id="prop-price" class="input-field" value="${item.price}" required></div>
            <div class="form-group">
                <label>Category</label>
                <select id="prop-cat" class="input-select">
                    <option value="Apartment" ${item.category==='Apartment'?'selected':''}>Apartment</option>
                    <option value="House" ${item.category==='House'?'selected':''}>House</option>
                    <option value="Offplan" ${item.category==='Offplan'?'selected':''}>Offplan</option>
                </select>
            </div>
            <div class="form-actions" style="margin-top:24px; text-align:right;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Add Property'}</button>
            </div>
        </form>
    `;
    openModal(isEdit ? 'Edit Property' : 'Add New Property', formHTML);
}

function saveProperty(e, id) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('prop-title').value,
        location: document.getElementById('prop-loc').value,
        price: document.getElementById('prop-price').value,
        category: document.getElementById('prop-cat').value,
        status: id ? state.properties.find(p=>p.id===id).status : "Active"
    };

    if (id) {
        let index = state.properties.findIndex(p => p.id === id);
        state.properties[index] = { ...state.properties[index], ...payload };
        addActivity(`Edited property: ${payload.title}`);
        showToast('Property updated successfully.');
    } else {
        payload.id = Date.now();
        state.properties.unshift(payload);
        addActivity(`Added new property: ${payload.title}`);
        showToast('Property created successfully.');
    }
    
    saveState();
    closeModal();
    renderProperties();
}

function deleteProperty(id) {
    if(confirm("Are you sure you want to delete this property?")) {
        const title = state.properties.find(p=>p.id===id).title;
        state.properties = state.properties.filter(p => p.id !== id);
        saveState();
        addActivity(`Deleted property: ${title}`);
        showToast('Property deleted.', 'error');
        renderProperties();
    }
}

// =========================================
// LEADS & CLIENTS CRUD
// =========================================
function renderLeads() {
    const tbody = document.getElementById('leads-table-body');
    if(!tbody) return;
    
    tbody.innerHTML = state.leads.map(l => `
        <tr>
            <td><strong>${l.name}</strong></td>
            <td>${l.contact}</td>
            <td>${l.property}</td>
            <td class="status-${l.status.toLowerCase()}"><span class="status-dot"></span>${l.status}</td>
            <td>
                <div class="table-actions">
                    ${l.status !== 'Contacted' ? `<button class="btn btn-outline" style="padding:6px 12px; font-size:12px;" onclick="markLeadContacted(${l.id})">Mark Contacted</button>` : `<span style="font-size:12px;color:var(--color-text-muted)">Contacted</span>`}
                    <button class="btn-icon text-danger" onclick="deleteLead(${l.id})"><i class="ph ph-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    renderDashboard();
}

function markLeadContacted(id) {
    const lead = state.leads.find(l => l.id === id);
    lead.status = "Contacted";
    saveState();
    addActivity(`Contacted lead: ${lead.name}`);
    showToast('Lead marked as contacted.');
    renderLeads();
}
function deleteLead(id) {
    if(confirm("Delete this lead permanently?")) {
        state.leads = state.leads.filter(l => l.id !== id);
        saveState();
        showToast('Lead deleted.', 'error');
        renderLeads();
    }
}

function renderClients() {
    const tbody = document.getElementById('clients-table-body');
    if(!tbody) return;
    tbody.innerHTML = state.clients.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.email}</td>
            <td>${c.registered}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon text-danger" onclick="deleteClient(${c.id})"><i class="ph ph-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    renderDashboard();
}
function deleteClient(id) {
    if(confirm("Remove client access?")) {
        state.clients = state.clients.filter(c => c.id !== id);
        saveState();
        showToast('Client deleted.', 'error');
        renderClients();
    }
}

// =========================================
// BLOGS CRUD
// =========================================
function renderBlogs() {
    const grid = document.getElementById('blog-grid');
    if(!grid) return;
    
    grid.innerHTML = state.blogs.map(b => `
        <div class="blog-card">
            <img src="${b.image}" class="blog-img">
            <div class="blog-content">
                <h3 class="blog-title">${b.title}</h3>
                <p class="blog-excerpt">${b.excerpt}</p>
                <div class="table-actions" style="border-top:1px solid var(--color-border); padding-top:12px; margin-top:12px;">
                    <button class="btn-icon" onclick="openBlogModal(${b.id})"><i class="ph ph-pencil-simple"></i></button>
                    <button class="btn-icon text-danger" onclick="deleteBlog(${b.id})"><i class="ph ph-trash"></i></button>
                </div>
            </div>
        </div>
    `).join('');
    if(state.blogs.length === 0) grid.innerHTML = `<p style="padding:24px; color:var(--color-text-muted)">No posts published.</p>`;
}

function openBlogModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? state.blogs.find(b => b.id === id) : { title: '', excerpt: '' };
    
    const formHTML = `
        <form onsubmit="saveBlog(event, ${id})">
            <div class="form-group"><label>Title</label><input type="text" id="blog-title" class="input-field" value="${item.title}" required></div>
            <div class="form-group"><label>Excerpt</label><textarea id="blog-excerpt" class="input-field" rows="3" required>${item.excerpt}</textarea></div>
            <div class="form-actions" style="margin-top:24px; text-align:right;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update Post' : 'Publish Post'}</button>
            </div>
        </form>
    `;
    openModal(isEdit ? 'Edit Post' : 'Write Post', formHTML);
}

function saveBlog(e, id) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('blog-title').value,
        excerpt: document.getElementById('blog-excerpt').value,
        image: "https://images.unsplash.com/photo-1542314831-c5a4d407e201?w=600&q=80"
    };

    if (id) {
        let index = state.blogs.findIndex(b => b.id === id);
        state.blogs[index] = { ...state.blogs[index], ...payload };
        showToast('Blog updated successfully.');
    } else {
        payload.id = Date.now();
        state.blogs.unshift(payload);
        showToast('Blog published successfully.');
    }
    saveState();
    closeModal();
    renderBlogs();
}
function deleteBlog(id) {
    if(confirm("Delete this blog post?")) {
        state.blogs = state.blogs.filter(b => b.id !== id);
        saveState();
        showToast('Blog post deleted.', 'error');
        renderBlogs();
    }
}

// =========================================
// FULLY FUNCTIONAL TASK TRACKER (SSOT)
// =========================================
function initTaskTrackerUI() {
    // Mobile toggle logic remains functional inline on index.html, handled by browser.
}

function setTaskFilter(filterMode, btnEl) {
    // Remove active from all tabs, add to clicked
    const tabs = document.querySelectorAll('.task-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if(btnEl) btnEl.classList.add('active');
    
    currentTaskFilter = filterMode;
    renderTasks();
}

function renderTasks() {
    const container = document.getElementById('task-list-container');
    if(!container) return;
    
    let filteredTasks = state.tasks;
    if(currentTaskFilter === 'uncompleted') {
        filteredTasks = state.tasks.filter(t => !t.completed);
    } else if (currentTaskFilter === 'completed') {
        filteredTasks = state.tasks.filter(t => t.completed);
    }
    
    if(filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="task-empty-state">
                <i class="ph ph-check-circle" style="font-size: 32px; margin-bottom: 8px;"></i>
                <p>No tasks found in this view.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredTasks.map(t => `
        <div class="task-item ${t.completed ? 'completed' : (t.priority ? 'active-task' : '')}">
            <div class="checkbox-circle ${t.completed ? '' : 'empty'}" onclick="toggleTaskCompletion(${t.id})">
                ${t.completed ? '<i class="ph-bold ph-check"></i>' : ''}
            </div>
            <div class="task-details">
                <h4 class="flex-between">
                    ${t.title}
                    ${t.priority && !t.completed ? '<span class="badge-blue"><i class="ph-fill ph-sparkle"></i> Priority</span>' : ''}
                </h4>
                <p>Deadline: ${t.deadline} <img src="https://ui-avatars.com/api/?name=${t.assignee.replace(' ', '+')}&background=e2e8f0" class="tiny-avatar"> ${t.assignee}</p>
            </div>
            <div class="task-actions">
                <button onclick="openTaskModal(${t.id})" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                <button class="text-danger" onclick="deleteTask(${t.id})" title="Delete"><i class="ph ph-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function toggleTaskCompletion(id) {
    const task = state.tasks.find(t => t.id === id);
    if(task) {
        task.completed = !task.completed;
        saveState();
        renderTasks(); // Re-render entirely from State
        showToast(task.completed ? 'Task completed!' : 'Task marked active.');
    }
}

function openTaskModal(id = null) {
    const isEdit = id !== null;
    const task = isEdit ? state.tasks.find(t => t.id === id) : { title: '', desc: '', deadline: 'Today', assignee: state.settings.name, priority: false };
    
    // Mobile-optimized Modal form (full-width fields)
    const formHTML = `
        <form onsubmit="saveTask(event, ${id})">
            <div class="form-group">
                <label>Task Title</label>
                <input type="text" id="task-title" class="input-field" value="${task.title}" required>
            </div>
            <div class="form-group">
                <label>Description (Optional)</label>
                <input type="text" id="task-desc" class="input-field" value="${task.desc}">
            </div>
            <div class="form-group toggle-group" style="justify-content: flex-start; gap: 16px;">
                <label>Priority Outline</label>
                <label class="toggle-switch">
                    <input type="checkbox" id="task-priority" ${task.priority ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
            <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
                <div class="w-full">
                    <label style="display: block; font-size: 14px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;">Deadline</label>
                    <input type="text" id="task-deadline" class="input-field" value="${task.deadline}" required style="margin-bottom:0;">
                </div>
                <div class="w-full">
                    <label style="display: block; font-size: 14px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px;">Assignee</label>
                    <input type="text" id="task-assignee" class="input-field" value="${task.assignee}" required style="margin-bottom:0;">
                </div>
            </div>
            
            <div class="form-actions" style="margin-top:32px; text-align:right;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Create Task'}</button>
            </div>
        </form>
    `;
    openModal(isEdit ? 'Edit Task' : 'New Task', formHTML);
}

function saveTask(e, id) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('task-title').value,
        desc: document.getElementById('task-desc').value,
        deadline: document.getElementById('task-deadline').value,
        assignee: document.getElementById('task-assignee').value,
        priority: document.getElementById('task-priority').checked,
        completed: id ? state.tasks.find(t=>t.id===id).completed : false
    };

    if (id) {
        let index = state.tasks.findIndex(t => t.id === id);
        state.tasks[index] = { ...state.tasks[index], ...payload };
        showToast('Task updated successfully.');
    } else {
        payload.id = Date.now();
        state.tasks.unshift(payload);
        showToast('Task created successfully.');
    }
    
    saveState();
    closeModal();
    // Render using current filter tab natively
    renderTasks();
}

function deleteTask(id) {
    if(confirm("Are you sure you want to delete this task permanently?")) {
        state.tasks = state.tasks.filter(t => t.id !== id);
        saveState();
        showToast('Task deleted.', 'error');
        renderTasks();
    }
}

// =========================================
// SETTINGS & SYSTEM
// =========================================
function renderSidebarProfile() {
    document.getElementById('header-title').innerText = `Welcome, ${state.settings.name.split(' ')[0]}!`;
    const rpName = document.getElementById('right-profile-name');
    if(rpName) rpName.innerText = state.settings.name;
    const rpHandle = document.getElementById('right-profile-handle');
    if(rpHandle) rpHandle.innerText = "System Admin";
    
    if(document.getElementById('setting-name')) document.getElementById('setting-name').value = state.settings.name;
    if(document.getElementById('setting-handle')) document.getElementById('setting-handle').value = state.settings.handle;
}

function saveSettings(e) {
    e.preventDefault();
    state.settings.name = document.getElementById('setting-name').value;
    state.settings.handle = document.getElementById('setting-handle').value;
    saveState();
    renderSidebarProfile();
    showToast('Settings saved successfully!');
}

function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if(toggle) toggle.checked = state.settings.darkMode;
    toggleTheme(true);
}

function toggleTheme(isInit = false) {
    const toggle = document.getElementById('theme-toggle');
    state.settings.darkMode = toggle ? toggle.checked : state.settings.darkMode;
    
    if (state.settings.darkMode) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    if(!isInit) {
        saveState();
        showToast('Theme preferences saved.');
    }
}

// =========================================
// MOCK CHART.JS GRAPH
// =========================================
function initChart() {
    const ctx = document.getElementById('performanceChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                datasets: [{
                    label: 'Activity',
                    data: [4, 6, 3, 5, 8, 4, 3],
                    backgroundColor: [
                        '#eef1f6', '#eef1f6', '#eef1f6', '#eef1f6', '#cdfe02', '#eef1f6', '#eef1f6'
                    ],
                    borderRadius: 100,
                    borderSkipped: false,
                    barThickness: 16
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#cdfe02',
                        titleColor: '#000',
                        bodyColor: '#000',
                        padding: 8,
                        displayColors: false,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#a0aec0', font: { family: 'Inter', size: 12 } } },
                    y: { display: false, grid: { display: false }, beginAtZero: true }
                }
            }
        });
    }
}
