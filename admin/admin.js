// =========================================
// WENAMY ADMIN DASHBOARD - MAIN SCRIPT
// Integrated with Wenamy Real Estate Data
// =========================================

// =========================================
// REAL DATA RETRIEVAL FUNCTIONS
// =========================================

// Real Off-Plan Projects Data from offplan.html - All 24 Projects
const offplanProjectsData = [
    {
        id: 1,
        name: "3 Bedroom Bungalow",
        category: "bungalows",
        location: "Accra",
        price: "$145,000",
        image: "../images/offplan/OFFPLAN24/1st.jpeg",
        description: "3 bedroom bungalow on a 70 by 100 plot of land. Comes with 3 bedrooms, 4 washrooms, pool and a large compound. Natural facade with stones, wood and lots of greenery.",
        offplanId: "OFFPLAN24"
    },
    {
        id: 2,
        name: "Modern Scandi Cabin",
        category: "cabins",
        location: "Peduasi",
        price: "$95,000",
        image: "../images/offplan/OFFPLAN23/1st.jpeg",
        description: "Compact cabin with vertical timber cladding, metal roof, open-plan layout with high ceilings, extensive glazing, and modern Scandi aesthetic.",
        offplanId: "OFFPLAN23"
    },
    {
        id: 3,
        name: "T-Shaped Cabin",
        category: "cabins",
        location: "Aburi",
        price: "$165,000",
        image: "../images/offplan/OFFPLAN22/1st.jpeg",
        description: "Single-family house with T-shaped design, where one wing contains common and service areas, and the perpendicular wing contains private areas. 2 bedrooms, 3 washrooms.",
        offplanId: "OFFPLAN22"
    },
    {
        id: 4,
        name: "3 Bedroom Duplex",
        category: "duplexes",
        location: "Accra",
        price: "$225,000",
        image: "../images/offplan/OFFPLAN21/1st.jpeg",
        description: "3 bedroom, 4 washrooms, 2 living rooms with every bedroom ensuite. Features large windows, pool, serene outdoor spaces, greens, and large 270° balcony for great views.",
        offplanId: "OFFPLAN21"
    },
    {
        id: 5,
        name: "3 Bedroom Bungalow",
        category: "retirement-homes",
        subcategory: "bungalows",
        location: "Accra",
        price: "$195,000",
        image: "../images/offplan/OFFPLAN20/1st.jpeg",
        description: "Master bedroom with toilet and closet area, 2 standard bedrooms with toilet, large living room with space, dining, modern kitchen with store.",
        offplanId: "OFFPLAN20"
    },
    {
        id: 6,
        name: "3 Bedroom Family Home",
        category: "retirement-homes",
        subcategory: "bungalows",
        location: "Accra",
        price: "$179,000",
        image: "../images/offplan/OFFPLAN19/1st.jpg",
        description: "Designed for calm and peaceful living, with features that make retirement feel better. Great floor plan with ease in moving, sunlight, fresh natural air.",
        offplanId: "OFFPLAN19"
    },
    {
        id: 7,
        name: "Modern Retirement Bungalow",
        category: "retirement-homes",
        subcategory: "bungalows",
        location: "Accra",
        price: "$185,000",
        image: "../images/offplan/OFFPLAN18/1st.jpeg",
        description: "Precision engineered modern map with optimal space planning, natural light & ventilation, premium layout with master bedroom, open kitchen, and future-ready design.",
        offplanId: "OFFPLAN18"
    },
    {
        id: 8,
        name: "3+1 Bedroom House",
        category: "retirement-homes",
        location: "Accra",
        price: "Contact for Pricing",
        image: "../images/offplan/OFFPLAN17/1st.jpeg",
        description: "Very nice and simple 3 bedroom house with one bedroom Boy's Quarters and a garden. All bedrooms en-suite with huge living room.",
        offplanId: "OFFPLAN17"
    },
    {
        id: 9,
        name: "4 Bedroom Townhouse with Boy's Quarters",
        category: "townhouses",
        location: "Tema Community 25",
        price: "from $320,000",
        image: "../images/offplan/OFFPLAN1/1st.jpg",
        description: "Spacious 4 family bedroom townhouses with boy's quarters, featuring modern design, ample parking, and premium finishes. Perfect for families seeking comfort and elegance.",
        offplanId: "OFFPLAN1"
    },
    {
        id: 10,
        name: "2 Bedroom Leisure Home",
        category: "vacation-homes",
        location: "Akosombo",
        price: "$220,000",
        image: "../images/offplan/OFFPLAN2/1st.jpeg",
        description: "Beautiful 2 bedroom leisure home perfect for vacation getaways. Features modern amenities, scenic views, and comfortable living spaces ideal for relaxation.",
        offplanId: "OFFPLAN2"
    },
    {
        id: 11,
        name: "2 Bedroom Leisure Home - Aburi",
        category: "vacation-homes",
        location: "Aburi",
        price: "$225,000",
        image: "../images/offplan/OFFPLAN3/1st.jpeg",
        description: "Stunning 2 bedroom leisure home nestled in the serene hills of Aburi. Perfect for weekend retreats with beautiful mountain views, fresh air, and peaceful surroundings.",
        offplanId: "OFFPLAN3"
    },
    {
        id: 12,
        name: "4 Bedroom Family Home",
        category: "duplexes",
        location: "Aburi",
        price: "$265,000",
        image: "../images/offplan/OFFPLAN4/1st.jpeg",
        description: "A residential project developed under a contemporary and functional vision. Architecture defined by sober volumes, clean lines, and carefully selected materials. Prioritizes natural lighting and balanced spaces.",
        offplanId: "OFFPLAN4"
    },
    {
        id: 13,
        name: "3 Bedroom Beach Home",
        category: "vacation-homes",
        location: "Kokrobite",
        price: "$355,000",
        image: "../images/offplan/OFFPLAN7/1st.jpeg",
        description: "Who decided bedrooms shouldn't feel like a beachfront observatory? And since when is marble allowed to look this soft? Is this still architecture, or already the world's calmest movie scene?",
        offplanId: "OFFPLAN7"
    },
    {
        id: 14,
        name: "Green Mountain Vacation Home",
        category: "vacation-homes",
        location: "Aburi",
        price: "$325,000",
        image: "../images/offplan/OFFPLAN6/1st.jpeg",
        description: "Concrete floating over a silent valley of Aburi. Warm timber behind cold mass. Glass framing mountains like artwork. Architecture is strongest when it does less.",
        offplanId: "OFFPLAN6"
    },
    {
        id: 15,
        name: "3 Bedroom Family Home",
        category: "duplexes",
        location: "Aburi",
        price: "$245,000",
        image: "../images/offplan/OFFPLAN5/1st.jpeg",
        description: "A project born under a minimalist and contemporary vision, where every line and every volume stands out from its surroundings, creating a harmonious contrast with the surrounding landscape.",
        offplanId: "OFFPLAN5"
    },
    {
        id: 16,
        name: "Vacation Home with Great Views",
        category: "vacation-homes",
        location: "Aburi",
        price: "$365,000",
        image: "../images/offplan/OFFPLAN8/1st.jpeg",
        description: "Stripped down to the essentials, this architectural concept proves that true luxury lies in simplicity and connection to the land.",
        offplanId: "OFFPLAN8"
    },
    {
        id: 17,
        name: "3 Bedroom Vacation Home",
        category: "vacation-homes",
        location: "Aburi",
        price: "$335,000",
        image: "../images/offplan/OFFPLAN9/1st.jpeg",
        description: "With brave lines, long hanging extensions, and a feel of hanging in the air, this beautiful vacation home is built on a mountain top of Aburi with great views and a touch of nature's beauty.",
        offplanId: "OFFPLAN9"
    },
    {
        id: 18,
        name: "3 Bedroom Duplex",
        category: "duplexes",
        location: "East Legon Hills",
        price: "$250,000",
        image: "../images/offplan/OFFPLAN10/1st.jpeg",
        description: "Designed for a half plot in an era where land is scarce and expensive, the 3 bedroom duplex is planned for the family. Big airy spaces are safely designed with children in mind.",
        offplanId: "OFFPLAN10"
    },
    {
        id: 19,
        name: "5 Bedroom Family Home",
        category: "environmentalists",
        location: "East Legon Hills",
        price: "$365,000",
        image: "../images/offplan/OFFPLAN11/1st.jpeg",
        description: "A residence that blends the strength of exposed concrete, the warmth of wood, and the elegance of stone - seamlessly connected with nature and natural light.",
        offplanId: "OFFPLAN11"
    },
    {
        id: 20,
        name: "4 Bedroom Duplex",
        category: "duplexes",
        location: "Community 25",
        price: "$215,000",
        image: "../images/offplan/OFFPLAN12/1st.jpeg",
        description: "4 bedroom house on a half plot. Comes with a pool and a touch of greenery. Option of a maid's quarters. Contact us now.",
        offplanId: "OFFPLAN12"
    },
    {
        id: 21,
        name: "4 Bedroom Duplex with Underground Garage",
        category: "duplexes",
        location: "Peduasi",
        price: "$310,000",
        image: "../images/offplan/OFFPLAN13/1st.jpeg",
        description: "From the most challenging terrains, emerge the most incredible projects. Balestra House is the perfect combination of daring and beauty. Unique features and impressive volume are the hallmark of this project.",
        offplanId: "OFFPLAN13"
    },
    {
        id: 22,
        name: "4 Bedroom Duplex",
        category: "environmentalists",
        location: "East Legon Hills",
        price: "$380,000",
        image: "../images/offplan/OFFPLAN14/1st.jpeg",
        description: "The world suggests a choice between raw power and refined elegance. This is a space for those who understood the answer is to embody both. A testament to a life lived in perfect equilibrium.",
        offplanId: "OFFPLAN14"
    },
    {
        id: 23,
        name: "5 Bedroom Home",
        category: "environmentalists",
        location: "Peduasi",
        price: "$530,000",
        image: "../images/offplan/OFFPLAN15/1st.jpeg",
        description: "This house consists of two floors, which are zoned as public and private areas. The three primary areas pantry, dining and living room are located on the 2nd floor, while the private area is on the first.",
        offplanId: "OFFPLAN15"
    },
    {
        id: 24,
        name: "3 Bedroom Home",
        category: "vacation-homes",
        location: "Peduasi",
        price: "$310,000",
        image: "../images/offplan/OFFPLAN16/1st.jpeg",
        description: "This project is a reflection of architecture-minimal, intentional, and deeply connected to its landscape. The house is situated on a lush, sloping terrain at the base of a mountain range.",
        offplanId: "OFFPLAN16"
    }
];

// Off-Plan Categories
const offplanCategories = [
    { id: 'all', name: 'All', count: 0 },
    { id: 'retirement-homes', name: 'Retirement Homes', count: 0 },
    { id: 'duplexes', name: 'Duplexes', count: 0 },
    { id: 'triplexes', name: 'Triplexes', count: 0 },
    { id: 'bungalows', name: 'Bungalows', count: 0 },
    { id: 'villa', name: 'Villa', count: 0 },
    { id: 'mansions', name: 'Mansions', count: 0 },
    { id: 'townhouses', name: 'Townhouses', count: 0 },
    { id: 'vacation-homes', name: 'Vacation Homes', count: 0 },
    { id: 'cabins', name: 'Cabins', count: 0 },
    { id: 'environmentalists', name: 'Environmentalists', count: 0 }
];

// Real blog posts data from blog.html
const blogPostsData = [
    {
        id: 1,
        title: "Why Ghana's Real Estate Market is Booming: A 2026 Investment Guide",
        excerpt: "Discover the key factors driving Ghana's real estate growth and why now is the perfect time to invest in properties.",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        category: "Investment",
        date: "2026-03-10"
    },
    {
        id: 2,
        title: "The Benefits of Off-Plan Property Investment",
        excerpt: "Learn how investing in properties before completion can maximize your returns and provide unique advantages.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
        category: "Investment",
        date: "2026-03-05"
    },
    {
        id: 3,
        title: "Modern Home Design Trends in Ghana for 2026",
        excerpt: "Explore the latest architectural and interior design trends shaping luxury homes in Ghana this year.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
        category: "Design",
        date: "2026-02-28"
    },
    {
        id: 4,
        title: "Sustainable Building Practices in Modern Construction",
        excerpt: "How eco-friendly materials and energy-efficient designs are transforming the construction industry.",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
        category: "Construction",
        date: "2026-02-20"
    },
    {
        id: 5,
        title: "Choosing the Right Location for Your Dream Home",
        excerpt: "Key factors to consider when selecting the perfect location for your new property investment.",
        image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
        category: "Guide",
        date: "2026-02-15"
    },
    {
        id: 6,
        title: "First-Time Home Buyer's Complete Guide",
        excerpt: "Everything you need to know about purchasing your first property in Ghana's real estate market.",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
        category: "Guide",
        date: "2026-02-08"
    }
];

// Get real properties from projectsData
function getRealProperties() {
    const properties = [];
    let id = 1;
    
    for (const [key, project] of Object.entries(projectsData)) {
        properties.push({
            id: id++,
            key: key,
            title: project.name,
            location: project.location,
            price: project.price,
            type: project.type,
            status: project.status || 'available',
            bedrooms: project.bedrooms,
            bathrooms: project.bathrooms,
            sqft: project.sqft,
            image: project.images && project.images.length > 0 ? '../' + project.images[0] : '../images/icons/logo.png',
            description: project.description,
            amenities: project.amenities || []
        });
    }
    
    return properties;
}

// Get saved properties (basket) from localStorage - represents client interest/leads
function getSavedProperties() {
    try {
        const data = localStorage.getItem('wenamy_basket');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error reading basket:', e);
        return [];
    }
}

// Get unique clients based on saved properties
function getUniqueClients() {
    const saved = getSavedProperties();
    // Each saved property represents a client interaction
    // For now, we'll create client entries based on saved properties
    const clients = [];
    saved.forEach((item, index) => {
        clients.push({
            id: index + 1,
            name: `Client ${index + 1}`,
            email: `client${index + 1}@example.com`,
            savedProperties: 1,
            interestedIn: item.title,
            date: new Date().toISOString().split('T')[0]
        });
    });
    return clients;
}

// Calculate real stats from data
function calculateRealStats() {
    // Use state.properties which includes any admin panel changes
    const properties = state.properties || getRealProperties();
    const saved = getSavedProperties();
    
    // Also count off-plan projects
    const offplanCount = offplanProjectsData ? offplanProjectsData.length : 0;
    
    return {
        totalProperties: properties.length,
        ongoing: properties.filter(p => p.status === 'ongoing').length,
        upcoming: properties.filter(p => p.status === 'upcoming').length,
        completed: properties.filter(p => p.status === 'completed').length,
        offplan: offplanCount,
        totalLeads: saved.length,
        uniqueClients: saved.length,
        byType: getPropertiesByType(properties),
        byLocation: getPropertiesByLocation(properties)
    };
}

function getPropertiesByType(properties) {
    const counts = {};
    properties.forEach(p => {
        counts[p.type] = (counts[p.type] || 0) + 1;
    });
    return counts;
}

function getPropertiesByLocation(properties) {
    const counts = {};
    properties.forEach(p => {
        const location = p.location.split(',')[0]; // Get main location
        counts[location] = (counts[location] || 0) + 1;
    });
    return counts;
}

// =========================================
// DEFAULT STATE - LOADS REAL DATA
// =========================================
const defaultState = {
    settings: { 
        name: "Wenamy Admin", 
        email: "admin@wenamy.com",
        phone: "0243 817 969",
        darkMode: false,
        notifications: true
    },
    properties: [], // Will be populated from projectsData
    leads: [], // Will be populated from localStorage basket
    clients: [], // Will be populated from localStorage basket
    blogs: [],
    activities: [], // Will be populated from real actions
    tasks: [
        { id: 1, title: "Follow up with new leads", desc: "Contact clients who saved properties", deadline: "Today, 14:00", assignee: "Admin", completed: false, priority: true },
        { id: 2, title: "Update property photos", desc: "Upload new images for featured projects", deadline: "Today, 16:00", assignee: "Admin", completed: false, priority: false },
        { id: 3, title: "Prepare sales report", desc: "Monthly sales analysis", deadline: "Tomorrow, 10:00", assignee: "Admin", completed: false, priority: true },
        { id: 4, title: "Review inquiries", desc: "Check and respond to client inquiries", deadline: "Apr 5, 09:00", assignee: "Admin", completed: true, priority: false }
    ]
};

// =========================================
// STATE MANAGEMENT - LOAD REAL DATA
// =========================================
let state = JSON.parse(localStorage.getItem('wenamyAdminState'));

function initializeState() {
    if (!state) {
        state = defaultState;
    }
    
    // Always refresh with real data from projectsData
    state.properties = getRealProperties();
    
    // Load leads from saved properties (basket)
    const savedProperties = getSavedProperties();
    state.leads = savedProperties.map((item, index) => ({
        id: index + 1,
        name: `Lead ${index + 1}`,
        contact: "Contact via basket",
        property: item.title,
        status: "New",
        date: new Date().toISOString().split('T')[0]
    }));
    
    // Load clients from saved properties
    state.clients = savedProperties.map((item, index) => ({
        id: index + 1,
        name: `Client ${index + 1}`,
        email: `client${index + 1}@email.com`,
        savedProperties: 1,
        registered: new Date().toISOString().split('T')[0]
    }));
    
    // Load real blog posts
    state.blogs = [...blogPostsData];
    
    // Generate activities based on real data
    state.activities = generateRealActivities(state.properties, savedProperties);
    
    // Ensure arrays exist
    if(!state.tasks) state.tasks = defaultState.tasks;
    
    saveState();
}

function generateRealActivities(properties, saved) {
    const activities = [];
    
    // Add property-related activities
    if (properties.length > 0) {
        activities.push({
            id: Date.now(),
            type: "view",
            message: `System loaded ${properties.length} properties`,
            time: "Just now"
        });
    }
    
    // Add lead activities from saved properties
    saved.forEach((item, index) => {
        activities.push({
            id: Date.now() + index,
            type: "add",
            message: `Client saved: ${item.title}`,
            time: `${index + 1} hour${index > 0 ? 's' : ''} ago`
        });
    });
    
    // Add sample activities if no real data
    if (activities.length === 0) {
        activities.push(
            { id: 1, type: "view", message: "Dashboard initialized", time: "Just now" }
        );
    }
    
    return activities.slice(0, 10); // Keep last 10 activities
}

function saveState() {
    localStorage.setItem('wenamyAdminState', JSON.stringify(state));
}

// Global Filter Variables
let currentTaskFilter = 'all'; 

// =========================================
// INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize state with real data
    initializeState();
    
    initNavigation();
    initTheme();
    initTaskTrackerUI();
    
    // Initial renders
    renderDashboard();
    renderProperties();
    renderOffplan();
    renderLeads();
    renderClients();
    renderBlogs();
    renderTasks();
    renderActivityFeed();
    
    // Init Chart.js
    initPropertyChart();
    
    // Update current date
    updateCurrentDate();
    
    // Refresh data every 30 seconds to keep it current
    setInterval(() => {
        refreshDashboardData();
    }, 30000);
});

function refreshDashboardData() {
    // Re-calculate stats with current data
    const stats = calculateRealStats();
    
    // Update stat displays
    const statTotal = document.getElementById('stat-total-properties');
    const statOngoing = document.getElementById('stat-ongoing');
    const statCompleted = document.getElementById('stat-completed');
    const statLeads = document.getElementById('stat-leads');
    const navLeadCount = document.getElementById('nav-lead-count');
    
    if (statTotal) statTotal.textContent = stats.totalProperties;
    if (statOngoing) statOngoing.textContent = stats.ongoing;
    if (statCompleted) statCompleted.textContent = stats.completed;
    if (statLeads) statLeads.textContent = stats.totalLeads;
    if (navLeadCount) navLeadCount.textContent = stats.totalLeads > 0 ? `+${stats.totalLeads}` : '';
    
    // Log status breakdown for debugging
    console.log('Property Status Breakdown:', {
        total: stats.totalProperties,
        ongoing: stats.ongoing,
        upcoming: stats.upcoming,
        completed: stats.completed
    });
}

function updateCurrentDate() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

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
            
            // Page heading is handled by each page's section-header
        });
    });

    const hamburgerBtn = document.getElementById('hamburger-menu');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('sidebar-overlay').classList.toggle('active');
        });
    }
    
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }
}

// Global header now shows static "Admin Dashboard" text
// Individual page headings are in each page's section-header

function navigateTo(pageTarget) {
    const targetLink = document.querySelector(`.nav-item[data-target="${pageTarget}"]`);
    if(targetLink) targetLink.click();
}

// =========================================
// GLOBAL HELPERS
// =========================================
function addActivity(msg, type = 'view') {
    state.activities.unshift({
        id: Date.now(),
        type: type,
        message: msg,
        time: "Just now"
    });
    if(state.activities.length > 10) state.activities.pop();
    saveState();
    renderActivityFeed();
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'error' ? 'ph-warning-circle' : 
                 type === 'success' ? 'ph-check-circle' : 'ph-info';
    
    toast.innerHTML = `<i class="ph ${icon}"></i> ${message}`;
    
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
    modal.style.display = 'flex';
    // Small delay to allow display:flex to apply before adding active class
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
    const modal = document.getElementById('modal-container');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

// =========================================
// DASHBOARD VIEW - WITH REAL DATA
// =========================================
function renderDashboard() {
    // Get real stats from data
    const stats = calculateRealStats();
    
    // Update stat cards
    const statTotal = document.getElementById('stat-total-properties');
    const statOngoing = document.getElementById('stat-ongoing');
    const statCompleted = document.getElementById('stat-completed');
    const statLeads = document.getElementById('stat-leads');
    const navLeadCount = document.getElementById('nav-lead-count');
    
    if (statTotal) statTotal.textContent = stats.totalProperties;
    if (statOngoing) statOngoing.textContent = stats.ongoing;
    if (statCompleted) statCompleted.textContent = stats.completed;
    if (statLeads) statLeads.textContent = stats.totalLeads;
    if (navLeadCount) navLeadCount.textContent = stats.totalLeads > 0 ? `+${stats.totalLeads}` : '';
    
    // Render featured properties (first 4 completed properties - main projects)
    const propertiesContainer = document.getElementById('dashboard-properties');
    if (propertiesContainer) {
        // Show completed properties first (main projects), then ongoing, then upcoming
        let featuredProperties = state.properties
            .filter(p => p.status === 'completed')
            .slice(0, 4);
        
        if (featuredProperties.length < 4) {
            const ongoing = state.properties
                .filter(p => p.status === 'ongoing')
                .slice(0, 4 - featuredProperties.length);
            featuredProperties = featuredProperties.concat(ongoing);
        }
        
        if (featuredProperties.length < 4) {
            const upcoming = state.properties
                .filter(p => p.status === 'upcoming')
                .slice(0, 4 - featuredProperties.length);
            featuredProperties = featuredProperties.concat(upcoming);
        }
        
        propertiesContainer.innerHTML = featuredProperties.map(p => `
            <div class="property-mini-card" onclick="navigateTo('properties')">
                <img src="${p.image}" alt="${p.title}" class="property-mini-img" onerror="this.src='../images/icons/logo.png'">
                <div class="property-mini-info">
                    <h4 class="property-mini-title">${p.title}</h4>
                    <p class="property-mini-location">
                        <i class="ph ph-map-pin"></i> ${p.location}
                    </p>
                    <span class="property-mini-price">${p.price}</span>
                    <span class="property-status-badge status-${p.status}">${p.status.toUpperCase()}</span>
                </div>
            </div>
        `).join('');
    }
    
    // Update property type breakdown in console for debugging
    console.log('Dashboard Stats:', {
        'Total Properties': stats.totalProperties,
        'Ongoing': stats.ongoing,
        'Upcoming': stats.upcoming,
        'Completed': stats.completed,
        'Off-Plan Projects': stats.offplan,
        'Total Leads': stats.totalLeads,
        'By Type': stats.byType,
        'By Location': stats.byLocation
    });
}

function renderActivityFeed() {
    const container = document.getElementById('activity-list');
    if (!container) return;
    
    const icons = {
        'add': 'ph-plus-circle',
        'edit': 'ph-pencil-simple',
        'delete': 'ph-trash',
        'view': 'ph-eye'
    };
    
    container.innerHTML = state.activities.slice(0, 5).map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="ph ${icons[activity.type] || 'ph-info'}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-text">${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// =========================================
// CHART.JS - PROPERTY DISTRIBUTION
// =========================================
function initPropertyChart() {
    const ctx = document.getElementById('propertyChart');
    if (!ctx) return;
    
    // Calculate property distribution by type
    const typeCounts = {};
    state.properties.forEach(p => {
        typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
    });
    
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
    
    // Wenamy brand colors
    const colors = [
        '#0a101d',  // Dark Navy
        '#3b82f6',  // Blue
        '#10b981',  // Green
        '#8b5cf6',  // Purple
        '#f59e0b',  // Orange
        '#ef4444'   // Red
    ];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// =========================================
// PROPERTIES CRUD
// =========================================
function renderProperties() {
    const grid = document.getElementById('properties-grid');
    if (!grid) return;
    
    const typeFilter = document.getElementById('property-filter') ? document.getElementById('property-filter').value : 'All';
    const statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value : 'All';
    const search = document.getElementById('property-search') ? document.getElementById('property-search').value.toLowerCase() : '';

    const filtered = state.properties.filter(p => {
        const matchesType = typeFilter === 'All' || p.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesSearch = p.title.toLowerCase().includes(search) || 
                             p.location.toLowerCase().includes(search);
        return matchesType && matchesStatus && matchesSearch;
    });

    // Update total count in heading
    const totalCountEl = document.getElementById('properties-total-count');
    if (totalCountEl) {
        totalCountEl.textContent = `(${state.properties.length})`;
    }
    
    grid.innerHTML = filtered.map(p => `
        <div class="project-card">
            <img src="${p.image}" class="project-card-img" alt="${p.title}" onerror="this.src='../images/icons/logo.png'">
            <div class="project-card-content">
                <h3 class="project-card-title">${p.title}</h3>
                <p class="project-card-loc">
                    <i class="ph ph-map-pin"></i> ${p.location}
                </p>
                <div class="project-card-meta">
                    ${p.bedrooms ? `<span><i class="ph ph-bed"></i> ${p.bedrooms} Beds</span>` : ''}
                    ${p.bathrooms ? `<span><i class="ph ph-shower"></i> ${p.bathrooms} Baths</span>` : ''}
                </div>
                <div class="project-card-footer">
                    <span class="project-card-price">${p.price}</span>
                    <div class="table-actions">
                        <button class="btn-icon" onclick="openPropertyModal(${p.id})" title="Edit">
                            <i class="ph ph-pencil-simple"></i>
                        </button>
                        <button class="btn-icon text-danger" onclick="deleteProperty(${p.id})" title="Delete">
                            <i class="ph ph-trash"></i>
                        </button>
                        <span class="status-badge ${p.status}">
                            <span class="status-dot"></span>${p.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    if(filtered.length === 0) {
        grid.innerHTML = `<p style="padding:40px; color:var(--color-text-muted); text-align:center; grid-column:1/-1;">No properties found matching your criteria.</p>`;
    }
}

// =========================================
// OFF-PLAN PROJECTS CRUD
// =========================================
let currentOffplanCategory = 'all';

function renderOffplan() {
    const grid = document.getElementById('offplan-grid');
    const pillsContainer = document.getElementById('offplan-category-pills');
    if (!grid) return;
    
    const search = document.getElementById('offplan-search') ? document.getElementById('offplan-search').value.toLowerCase() : '';
    const locationFilter = document.getElementById('offplan-location-filter') ? document.getElementById('offplan-location-filter').value : 'All';
    
    // Filter projects
    const filtered = offplanProjectsData.filter(p => {
        const matchesCategory = currentOffplanCategory === 'all' || 
                               p.category === currentOffplanCategory || 
                               p.subcategory === currentOffplanCategory;
        const matchesLocation = locationFilter === 'All' || p.location === locationFilter;
        const matchesSearch = p.name.toLowerCase().includes(search) || 
                             p.location.toLowerCase().includes(search) ||
                             p.description.toLowerCase().includes(search);
        return matchesCategory && matchesLocation && matchesSearch;
    });
    
    // Update total count
    const totalCountEl = document.getElementById('offplan-total-count');
    if (totalCountEl) {
        totalCountEl.textContent = `(${offplanProjectsData.length})`;
    }
    
    // Render category pills
    if (pillsContainer) {
        const categories = [
            { id: 'all', name: 'All' },
            { id: 'retirement-homes', name: 'Retirement Homes' },
            { id: 'duplexes', name: 'Duplexes' },
            { id: 'triplexes', name: 'Triplexes' },
            { id: 'bungalows', name: 'Bungalows' },
            { id: 'villa', name: 'Villa' },
            { id: 'mansions', name: 'Mansions' },
            { id: 'townhouses', name: 'Townhouses' },
            { id: 'vacation-homes', name: 'Vacation Homes' },
            { id: 'cabins', name: 'Cabins' },
            { id: 'environmentalists', name: 'Environmentalists' }
        ];
        
        // Calculate counts for each category
        categories.forEach(cat => {
            if (cat.id === 'all') {
                cat.count = offplanProjectsData.length;
            } else {
                cat.count = offplanProjectsData.filter(p => p.category === cat.id || p.subcategory === cat.id).length;
            }
        });
        
        pillsContainer.innerHTML = categories.map(cat => `
            <button class="category-pill ${currentOffplanCategory === cat.id ? 'active' : ''}" 
                    onclick="setOffplanCategory('${cat.id}')">
                ${cat.name} <span class="pill-count">(${cat.count})</span>
            </button>
        `).join('');
    }
    
    // Render grid
    grid.innerHTML = filtered.map(p => `
        <div class="project-card offplan-card">
            <div class="offplan-image-wrapper">
                <img src="${p.image}" class="project-card-img" alt="${p.name}" onerror="this.src='../images/icons/logo.png'">
                <span class="offplan-badge">${p.offplanId}</span>
            </div>
            <div class="project-card-content">
                <div class="offplan-categories">
                    <span class="category-tag">${p.category.replace(/-/g, ' ')}</span>
                    ${p.subcategory ? `<span class="category-tag sub">${p.subcategory}</span>` : ''}
                </div>
                <h3 class="project-card-title">${p.name}</h3>
                <p class="project-card-loc">
                    <i class="ph ph-map-pin"></i> ${p.location}
                </p>
                <p class="offplan-desc">${p.description.substring(0, 100)}...</p>
                <div class="project-card-footer">
                    <span class="project-card-price">${p.price}</span>
                    <div class="table-actions">
                        <button class="btn-icon" onclick="openOffplanModal(${p.id})" title="Edit">
                            <i class="ph ph-pencil-simple"></i>
                        </button>
                        <button class="btn-icon text-danger" onclick="deleteOffplan(${p.id})" title="Delete">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    if (filtered.length === 0) {
        grid.innerHTML = `<p style="padding:40px; color:var(--color-text-muted); text-align:center; grid-column:1/-1;">No off-plan projects found matching your criteria.</p>`;
    }
}

function setOffplanCategory(category) {
    currentOffplanCategory = category;
    renderOffplan();
}

// Global array for Off-Plan images
let uploadedOffplanImages = [];

function openOffplanModal(id = null) {
    // Reset uploaded images array
    uploadedOffplanImages = [];
    
    const isEdit = id !== null;
    const item = isEdit ? offplanProjectsData.find(p => p.id === id) : {
        name: '', location: '', priceUSD: '', priceGHS: '', category: 'bungalows', description: '', offplanId: '',
        bedrooms: '', bathrooms: '', measurement: ''
    };
    
    // If editing, load existing images
    if (isEdit && item.images && item.images.length > 0) {
        uploadedOffplanImages = [...item.images];
    }
    
    const formHTML = `
        <form onsubmit="saveOffplan(event, ${id})">
            <!-- Project Name -->
            <div class="form-group">
                <label>Project Name</label>
                <input type="text" id="offplan-name" class="input-field" value="${item.name}" required>
            </div>
            
            <!-- Category (Sub-Category only for Off-Plan) -->
            <div class="form-group">
                <label>Category</label>
                <select id="offplan-category" class="input-select">
                    <option value="retirement-homes" ${item.category === 'retirement-homes' ? 'selected' : ''}>Retirement Homes</option>
                    <option value="duplexes" ${item.category === 'duplexes' ? 'selected' : ''}>Duplexes</option>
                    <option value="triplexes" ${item.category === 'triplexes' ? 'selected' : ''}>Triplexes</option>
                    <option value="bungalows" ${item.category === 'bungalows' ? 'selected' : ''}>Bungalows</option>
                    <option value="villa" ${item.category === 'villa' ? 'selected' : ''}>Villa</option>
                    <option value="mansions" ${item.category === 'mansions' ? 'selected' : ''}>Mansions</option>
                    <option value="townhouses" ${item.category === 'townhouses' ? 'selected' : ''}>Townhouses</option>
                    <option value="vacation-homes" ${item.category === 'vacation-homes' ? 'selected' : ''}>Vacation Homes</option>
                    <option value="cabins" ${item.category === 'cabins' ? 'selected' : ''}>Cabins</option>
                    <option value="environmentalists" ${item.category === 'environmentalists' ? 'selected' : ''}>Environmentalists</option>
                    <option value="apartments" ${item.category === 'apartments' ? 'selected' : ''}>Apartments</option>
                </select>
            </div>
            
            <!-- Prices in USD and GHS -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Price (USD)</label>
                    <input type="text" id="offplan-price-usd" class="input-field" value="${item.priceUSD || ''}" placeholder="e.g., $250,000">
                </div>
                <div class="form-group">
                    <label>Price (GHS)</label>
                    <input type="text" id="offplan-price-ghs" class="input-field" value="${item.priceGHS || ''}" placeholder="e.g., GH₵ 3,500,000">
                </div>
            </div>
            
            <!-- Location -->
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="offplan-loc" class="input-field" value="${item.location}" required>
            </div>
            
            <!-- Property Details: Bedrooms, Bathrooms, Measurement -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Bedrooms</label>
                    <input type="number" id="offplan-bedrooms" class="input-field" value="${item.bedrooms || ''}" placeholder="e.g., 3" min="0">
                </div>
                <div class="form-group">
                    <label>Bathrooms</label>
                    <input type="number" id="offplan-bathrooms" class="input-field" value="${item.bathrooms || ''}" placeholder="e.g., 2" min="0">
                </div>
                <div class="form-group">
                    <label>Measurement</label>
                    <input type="text" id="offplan-measurement" class="input-field" value="${item.measurement || ''}" placeholder="e.g., 2,500 sq ft">
                </div>
            </div>
            
            <!-- Description -->
            <div class="form-group">
                <label>Description</label>
                <textarea id="offplan-desc" class="input-field" rows="4" placeholder="Enter project description...">${item.description || ''}</textarea>
            </div>
            
            <!-- Off-Plan ID -->
            <div class="form-group">
                <label>Off-Plan ID</label>
                <input type="text" id="offplan-id" class="input-field" value="${item.offplanId || ''}" placeholder="e.g., OFFPLAN25">
            </div>
            
            <!-- Image Upload (Max 20) -->
            <div class="form-group">
                <label>Project Images (Max 20)</label>
                <div class="image-upload-container">
                    <input type="file" id="offplan-images" class="image-upload-input" accept="image/*" multiple onchange="handleOffplanImageUpload(this)">
                    <label for="offplan-images" class="image-upload-btn">
                        <i class="ph ph-camera"></i> Choose Images
                    </label>
                    <span class="image-upload-count" id="offplan-image-count">0 / 20 images</span>
                </div>
                <div class="image-preview-grid" id="offplan-image-preview-grid">
                    <!-- Preview images will appear here -->
                </div>
                <p class="image-upload-help">First image will be used as the main card image</p>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update' : 'Create'} Project</button>
            </div>
        </form>
    `;
    
    openModal(isEdit ? 'Edit Off-Plan Project' : 'Add Off-Plan Project', formHTML);
    
    // Update preview if editing
    if (isEdit && uploadedOffplanImages.length > 0) {
        updateOffplanImagePreview();
    }
}

function saveOffplan(e, id) {
    e.preventDefault();
    
    // Get price values
    const priceUSD = document.getElementById('offplan-price-usd').value;
    const priceGHS = document.getElementById('offplan-price-ghs').value;
    
    // Format price display
    let priceDisplay = '';
    if (priceUSD && priceGHS) {
        priceDisplay = `${priceUSD} / ${priceGHS}`;
    } else if (priceUSD) {
        priceDisplay = priceUSD;
    } else if (priceGHS) {
        priceDisplay = priceGHS;
    } else {
        priceDisplay = 'Contact for Pricing';
    }
    
    const project = {
        id: id || Date.now(),
        name: document.getElementById('offplan-name').value,
        location: document.getElementById('offplan-loc').value,
        priceUSD: priceUSD,
        priceGHS: priceGHS,
        price: priceDisplay,
        category: document.getElementById('offplan-category').value,
        description: document.getElementById('offplan-desc').value,
        offplanId: document.getElementById('offplan-id').value,
        bedrooms: document.getElementById('offplan-bedrooms').value || null,
        bathrooms: document.getElementById('offplan-bathrooms').value || null,
        measurement: document.getElementById('offplan-measurement').value || '',
        image: uploadedOffplanImages.length > 0 ? uploadedOffplanImages[0] : (id ? offplanProjectsData.find(p => p.id === id)?.image : '../images/icons/logo.png'),
        images: uploadedOffplanImages
    };
    
    if (id) {
        const index = offplanProjectsData.findIndex(p => p.id === id);
        if (index !== -1) offplanProjectsData[index] = project;
    } else {
        offplanProjectsData.push(project);
    }
    
    closeModal();
    renderOffplan();
    addActivity(`${id ? 'Updated' : 'Added'} off-plan project: ${project.name}`, 'edit');
}

function deleteOffplan(id) {
    if (!confirm('Are you sure you want to delete this off-plan project?')) return;
    
    const project = offplanProjectsData.find(p => p.id === id);
    const index = offplanProjectsData.findIndex(p => p.id === id);
    if (index !== -1) {
        offplanProjectsData.splice(index, 1);
        renderOffplan();
        addActivity(`Deleted off-plan project: ${project.name}`, 'delete');
    }
}

function openPropertyModal(id = null) {
    // Reset uploaded images and videos arrays
    uploadedPropertyImages = [];
    uploadedPropertyVideos = [];
    
    const isEdit = id !== null;
    const item = isEdit ? state.properties.find(p => p.id === id) : { 
        title: '', location: '', priceUSD: '', priceGHS: '', mainCategory: 'completed', subCategory: '', status: 'available',
        bedrooms: '', bathrooms: '', measurement: '', description: ''
    };
    
    // If editing, load existing images and videos
    if (isEdit) {
        if (item.images && item.images.length > 0) {
            uploadedPropertyImages = [...item.images];
        }
        if (item.videos && item.videos.length > 0) {
            uploadedPropertyVideos = [...item.videos];
        }
    }
    
    const formHTML = `
        <form onsubmit="saveProperty(event, ${id})">
            <!-- Property Title -->
            <div class="form-group">
                <label>Property Title</label>
                <input type="text" id="prop-title" class="input-field" value="${item.title}" required>
            </div>
            
            <!-- Main Category & Sub-Category -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Main Category</label>
                    <select id="prop-main-category" class="input-select" onchange="updateSubCategories()">
                        <option value="completed" ${item.mainCategory==='completed'?'selected':''}>Completed</option>
                        <option value="ongoing" ${item.mainCategory==='ongoing'?'selected':''}>Ongoing</option>
                        <option value="upcoming" ${item.mainCategory==='upcoming'?'selected':''}>Upcoming</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Sub-Category</label>
                    <select id="prop-sub-category" class="input-select">
                        <option value="">Select Sub-Category</option>
                        <option value="retirement-homes" ${item.subCategory==='retirement-homes'?'selected':''}>Retirement Homes</option>
                        <option value="duplexes" ${item.subCategory==='duplexes'?'selected':''}>Duplexes</option>
                        <option value="triplexes" ${item.subCategory==='triplexes'?'selected':''}>Triplexes</option>
                        <option value="bungalows" ${item.subCategory==='bungalows'?'selected':''}>Bungalows</option>
                        <option value="villa" ${item.subCategory==='villa'?'selected':''}>Villa</option>
                        <option value="mansions" ${item.subCategory==='mansions'?'selected':''}>Mansions</option>
                        <option value="townhouses" ${item.subCategory==='townhouses'?'selected':''}>Townhouses</option>
                        <option value="vacation-homes" ${item.subCategory==='vacation-homes'?'selected':''}>Vacation Homes</option>
                        <option value="cabins" ${item.subCategory==='cabins'?'selected':''}>Cabins</option>
                        <option value="environmentalists" ${item.subCategory==='environmentalists'?'selected':''}>Environmentalists</option>
                        <option value="apartments" ${item.subCategory==='apartments'?'selected':''}>Apartments</option>
                    </select>
                </div>
            </div>
            
            <!-- Prices in USD and GHS -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Price (USD)</label>
                    <input type="text" id="prop-price-usd" class="input-field" value="${item.priceUSD || ''}" placeholder="e.g., $250,000">
                </div>
                <div class="form-group">
                    <label>Price (GHS)</label>
                    <input type="text" id="prop-price-ghs" class="input-field" value="${item.priceGHS || ''}" placeholder="e.g., GH₵ 3,500,000">
                </div>
            </div>
            
            <!-- Location -->
            <div class="form-group">
                <label>Location</label>
                <input type="text" id="prop-loc" class="input-field" value="${item.location}" required>
            </div>
            
            <!-- Property Details: Bedrooms, Bathrooms, Measurement -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Bedrooms</label>
                    <input type="number" id="prop-bedrooms" class="input-field" value="${item.bedrooms || ''}" placeholder="e.g., 3" min="0">
                </div>
                <div class="form-group">
                    <label>Bathrooms</label>
                    <input type="number" id="prop-bathrooms" class="input-field" value="${item.bathrooms || ''}" placeholder="e.g., 2" min="0">
                </div>
                <div class="form-group">
                    <label>Measurement</label>
                    <input type="text" id="prop-measurement" class="input-field" value="${item.measurement || ''}" placeholder="e.g., 2,500 sq ft">
                </div>
            </div>
            
            <!-- Property Description -->
            <div class="form-group">
                <label>Property Description</label>
                <textarea id="prop-description" class="input-field" rows="4" placeholder="Enter property description...">${item.description || ''}</textarea>
            </div>
            
            <!-- Status -->
            <div class="form-group">
                <label>Status</label>
                <select id="prop-status" class="input-select">
                    <option value="available" ${item.status==='available'?'selected':''}>Available</option>
                    <option value="ongoing" ${item.status==='ongoing'?'selected':''}>Ongoing</option>
                    <option value="completed" ${item.status==='completed'?'selected':''}>Completed</option>
                    <option value="sold" ${item.status==='sold'?'selected':''}>Sold</option>
                </select>
            </div>
            
            <!-- Image Upload -->
            <div class="form-group">
                <label>Property Images (Max 10)</label>
                <div class="image-upload-container">
                    <input type="file" id="prop-images" class="image-upload-input" accept="image/*" multiple onchange="handleImageUpload(this)">
                    <label for="prop-images" class="image-upload-btn">
                        <i class="ph ph-camera"></i> Choose Images
                    </label>
                    <span class="image-upload-count" id="image-count">0 / 10 images</span>
                </div>
                <div class="image-preview-grid" id="image-preview-grid">
                    <!-- Preview images will appear here -->
                </div>
                <p class="image-upload-help">First image will be used as the main card image</p>
            </div>
            
            <!-- Video Upload -->
            <div class="form-group">
                <label>Property Videos (Max 5)</label>
                <div class="image-upload-container">
                    <input type="file" id="prop-videos" class="image-upload-input" accept="video/*" multiple onchange="handleVideoUpload(this)">
                    <label for="prop-videos" class="image-upload-btn video-btn">
                        <i class="ph ph-video-camera"></i> Choose Videos
                    </label>
                    <span class="image-upload-count" id="video-count">0 / 5 videos</span>
                </div>
                <div class="video-preview-list" id="video-preview-list">
                    <!-- Video previews will appear here -->
                </div>
                <p class="image-upload-help">Videos will be displayed in the property gallery</p>
            </div>
            
            <div class="form-actions" style="margin-top:24px;">
                <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Add Property'}</button>
            </div>
        </form>
    `;
    openModal(isEdit ? 'Edit Property' : 'Add New Property', formHTML);
}

function updateSubCategories() {
    // This function can be extended to dynamically update sub-categories based on main category
    // For now, all sub-categories are available for selection
}

// Global array to store uploaded images and videos
let uploadedPropertyImages = [];
let uploadedPropertyVideos = [];

function handleImageUpload(input) {
    const files = Array.from(input.files);
    const maxImages = 10;
    
    // Check if adding new files would exceed limit
    if (uploadedPropertyImages.length + files.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images. You already have ${uploadedPropertyImages.length} images.`);
        return;
    }
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedPropertyImages.push(e.target.result);
                updateImagePreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateImagePreview() {
    const grid = document.getElementById('image-preview-grid');
    const count = document.getElementById('image-count');
    
    if (!grid || !count) return;
    
    count.textContent = `${uploadedPropertyImages.length} / 10 images`;
    
    grid.innerHTML = uploadedPropertyImages.map((img, index) => `
        <div class="image-preview-item ${index === 0 ? 'main-image' : ''}">
            <img src="${img}" alt="Property image ${index + 1}">
            ${index === 0 ? '<span class="main-image-badge">Main</span>' : ''}
            <button type="button" class="image-remove-btn" onclick="removeImage(${index})" title="Remove image">
                <i class="ph ph-x"></i>
            </button>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedPropertyImages.splice(index, 1);
    updateImagePreview();
}

function handleVideoUpload(input) {
    const files = Array.from(input.files);
    const maxVideos = 5;
    
    // Check if adding new files would exceed limit
    if (uploadedPropertyVideos.length + files.length > maxVideos) {
        alert(`You can only upload up to ${maxVideos} videos. You already have ${uploadedPropertyVideos.length} videos.`);
        return;
    }
    
    files.forEach(file => {
        if (file.type.startsWith('video/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedPropertyVideos.push({
                    data: e.target.result,
                    name: file.name,
                    size: formatFileSize(file.size)
                });
                updateVideoPreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateVideoPreview() {
    const list = document.getElementById('video-preview-list');
    const count = document.getElementById('video-count');
    
    if (!list || !count) return;
    
    count.textContent = `${uploadedPropertyVideos.length} / 5 videos`;
    
    list.innerHTML = uploadedPropertyVideos.map((video, index) => `
        <div class="video-preview-item">
            <div class="video-icon">
                <i class="ph ph-video"></i>
            </div>
            <div class="video-info">
                <span class="video-name">${video.name}</span>
                <span class="video-size">${video.size}</span>
            </div>
            <button type="button" class="video-remove-btn" onclick="removeVideo(${index})" title="Remove video">
                <i class="ph ph-trash"></i>
            </button>
        </div>
    `).join('');
}

function removeVideo(index) {
    uploadedPropertyVideos.splice(index, 1);
    updateVideoPreview();
}

// Off-Plan Image Upload Functions
function handleOffplanImageUpload(input) {
    const files = Array.from(input.files);
    const maxImages = 20;
    
    // Check if adding new files would exceed limit
    if (uploadedOffplanImages.length + files.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images. You already have ${uploadedOffplanImages.length} images.`);
        return;
    }
    
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedOffplanImages.push(e.target.result);
                updateOffplanImagePreview();
            };
            reader.readAsDataURL(file);
        }
    });
}

function updateOffplanImagePreview() {
    const grid = document.getElementById('offplan-image-preview-grid');
    const count = document.getElementById('offplan-image-count');
    
    if (!grid || !count) return;
    
    count.textContent = `${uploadedOffplanImages.length} / 20 images`;
    
    grid.innerHTML = uploadedOffplanImages.map((img, index) => `
        <div class="image-preview-item ${index === 0 ? 'main-image' : ''}">
            <img src="${img}" alt="Project image ${index + 1}">
            ${index === 0 ? '<span class="main-image-badge">Main</span>' : ''}
            <button type="button" class="image-remove-btn" onclick="removeOffplanImage(${index})" title="Remove image">
                <i class="ph ph-x"></i>
            </button>
        </div>
    `).join('');
}

function removeOffplanImage(index) {
    uploadedOffplanImages.splice(index, 1);
    updateOffplanImagePreview();
}

function saveProperty(e, id) {
    e.preventDefault();
    
    // Get price values
    const priceUSD = document.getElementById('prop-price-usd').value;
    const priceGHS = document.getElementById('prop-price-ghs').value;
    
    // Format price display
    let priceDisplay = '';
    if (priceUSD && priceGHS) {
        priceDisplay = `${priceUSD} / ${priceGHS}`;
    } else if (priceUSD) {
        priceDisplay = priceUSD;
    } else if (priceGHS) {
        priceDisplay = priceGHS;
    } else {
        priceDisplay = 'Contact for Pricing';
    }
    
    const subCategory = document.getElementById('prop-sub-category').value;
    
    // Use first uploaded image as main image, or default if none
    const mainImage = uploadedPropertyImages.length > 0 
        ? uploadedPropertyImages[0] 
        : (id ? (state.properties.find(p => p.id === id)?.image || '../images/icons/logo.png') : '../images/icons/logo.png');
    
    const payload = {
        title: document.getElementById('prop-title').value,
        location: document.getElementById('prop-loc').value,
        price: priceDisplay,
        priceUSD: priceUSD,
        priceGHS: priceGHS,
        type: subCategory, // Type is now the sub-category
        mainCategory: document.getElementById('prop-main-category').value,
        subCategory: subCategory,
        status: document.getElementById('prop-status').value,
        bedrooms: document.getElementById('prop-bedrooms').value || null,
        bathrooms: document.getElementById('prop-bathrooms').value || null,
        measurement: document.getElementById('prop-measurement').value || '',
        description: document.getElementById('prop-description').value || '',
        image: mainImage,
        images: uploadedPropertyImages, // Store all images
        videos: uploadedPropertyVideos // Store all videos
    };

    if (id) {
        let index = state.properties.findIndex(p => p.id === id);
        state.properties[index] = { ...state.properties[index], ...payload };
        addActivity(`Updated property: ${payload.title}`, 'edit');
        showToast('Property updated successfully.');
    } else {
        payload.id = Date.now();
        state.properties.unshift(payload);
        addActivity(`Added new property: ${payload.title}`, 'add');
        showToast('Property created successfully.');
    }
    
    saveState();
    closeModal();
    renderProperties();
    renderDashboard();
}

function deleteProperty(id) {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    const property = state.properties.find(p => p.id === id);
    const index = state.properties.findIndex(p => p.id === id);
    if (index !== -1) {
        state.properties.splice(index, 1);
        renderProperties();
        renderDashboard();
        addActivity(`Deleted property: ${property.title}`, 'delete');
        showToast('Property deleted successfully.');
        saveState();
    }
}

// =========================================
// LEADS & CLIENTS CRUD
// =========================================
function renderLeads() {
    const tbody = document.getElementById('leads-table-body');
    if(!tbody) return;
    
    const statusColors = {
        'New': 'color: var(--color-info);',
        'Contacted': 'color: var(--color-warning);',
        'Closed': 'color: var(--color-success);'
    };
    
    tbody.innerHTML = state.leads.map(l => `
        <tr>
            <td><strong>${l.name}</strong></td>
            <td>${l.contact}</td>
            <td>${l.property}</td>
            <td style="${statusColors[l.status] || ''} font-weight: 600;">${l.status}</td>
            <td>${new Date(l.date).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    ${l.status === 'New' ? `<button class="btn-icon" onclick="markLeadContacted(${l.id})" title="Mark Contacted"><i class="ph ph-check"></i></button>` : ''}
                    <button class="btn-icon text-danger" onclick="deleteLead(${l.id})" title="Delete"><i class="ph ph-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function markLeadContacted(id) {
    const lead = state.leads.find(l => l.id === id);
    if (lead) {
        lead.status = "Contacted";
        saveState();
        addActivity(`Contacted lead: ${lead.name}`, 'edit');
        showToast('Lead marked as contacted.');
        renderLeads();
        renderDashboard();
    }
}

function deleteLead(id) {
    if(confirm("Delete this lead permanently?")) {
        const lead = state.leads.find(l => l.id === id);
        state.leads = state.leads.filter(l => l.id !== id);
        saveState();
        addActivity(`Deleted lead: ${lead ? lead.name : 'Unknown'}`, 'delete');
        showToast('Lead deleted.', 'error');
        renderLeads();
        renderDashboard();
    }
}

function renderClients() {
    const tbody = document.getElementById('clients-table-body');
    if(!tbody) return;
    
    tbody.innerHTML = state.clients.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.email}</td>
            <td>${c.savedProperties} properties</td>
            <td>${new Date(c.registered).toLocaleDateString()}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" title="View"><i class="ph ph-eye"></i></button>
                    <button class="btn-icon text-danger" onclick="deleteClient(${c.id})" title="Delete"><i class="ph ph-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function deleteClient(id) {
    if(confirm("Remove client access?")) {
        const client = state.clients.find(c => c.id === id);
        state.clients = state.clients.filter(c => c.id !== id);
        saveState();
        showToast('Client removed.', 'error');
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
            <img src="${b.image}" class="blog-img" onerror="this.src='../images/icons/logo.png'">
            <div class="blog-content">
                <h3 class="blog-title">${b.title}</h3>
                <p class="blog-excerpt">${b.excerpt}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border);">
                    <span style="font-size:12px; color:var(--color-text-muted);">${new Date(b.date).toLocaleDateString()}</span>
                    <div class="table-actions">
                        <button class="btn-icon" onclick="openBlogModal(${b.id})" title="Edit"><i class="ph ph-pencil-simple"></i></button>
                        <button class="btn-icon text-danger" onclick="deleteBlog(${b.id})" title="Delete"><i class="ph ph-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    if(state.blogs.length === 0) {
        grid.innerHTML = `<p style="padding:40px; color:var(--color-text-muted); text-align:center; grid-column:1/-1;">No blog posts yet.</p>`;
    }
}

function openBlogModal(id = null) {
    const isEdit = id !== null;
    const item = isEdit ? state.blogs.find(b => b.id === id) : { title: '', excerpt: '' };
    
    const formHTML = `
        <form onsubmit="saveBlog(event, ${id})">
            <div class="form-group">
                <label>Title</label>
                <input type="text" id="blog-title" class="input-field" value="${item.title}" required>
            </div>
            <div class="form-group">
                <label>Excerpt</label>
                <textarea id="blog-excerpt" class="input-field" rows="4" required>${item.excerpt}</textarea>
            </div>
            <div class="form-actions" style="margin-top:24px;">
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
        image: "../images/offplan/OFFPLAN10/1st.jpg",
        date: new Date().toISOString().split('T')[0]
    };

    if (id) {
        let index = state.blogs.findIndex(b => b.id === id);
        state.blogs[index] = { ...state.blogs[index], ...payload };
        addActivity(`Updated blog: ${payload.title}`, 'edit');
        showToast('Blog updated successfully.');
    } else {
        payload.id = Date.now();
        state.blogs.unshift(payload);
        addActivity(`Published blog: ${payload.title}`, 'add');
        showToast('Blog published successfully.');
    }
    saveState();
    closeModal();
    renderBlogs();
}

function deleteBlog(id) {
    if(confirm("Delete this blog post?")) {
        const blog = state.blogs.find(b => b.id === id);
        state.blogs = state.blogs.filter(b => b.id !== id);
        saveState();
        addActivity(`Deleted blog: ${blog ? blog.title : 'Unknown'}`, 'delete');
        showToast('Blog post deleted.', 'error');
        renderBlogs();
    }
}

// =========================================
// TASK TRACKER
// =========================================
function initTaskTrackerUI() {
    // Mobile toggle logic handled inline
}

function setTaskFilter(filterMode, btnEl) {
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
                <p>Deadline: ${t.deadline}</p>
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
        renderTasks();
        showToast(task.completed ? 'Task completed!' : 'Task marked active.');
    }
}

function openTaskModal(id = null) {
    const isEdit = id !== null;
    const task = isEdit ? state.tasks.find(t => t.id === id) : { 
        title: '', desc: '', deadline: 'Today', assignee: state.settings.name, priority: false, completed: false 
    };
    
    const formHTML = `
        <form onsubmit="saveTask(event, ${id})">
            <div class="form-group">
                <label>Task Title</label>
                <input type="text" id="task-title" class="input-field" value="${task.title}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input type="text" id="task-desc" class="input-field" value="${task.desc}">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-group">
                    <label>Deadline</label>
                    <input type="text" id="task-deadline" class="input-field" value="${task.deadline}" required>
                </div>
                <div class="form-group toggle-group" style="justify-content:flex-start; gap:12px; padding-top:28px;">
                    <label style="margin:0;">Priority</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="task-priority" ${task.priority ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="form-actions" style="margin-top:24px;">
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
        priority: document.getElementById('task-priority').checked,
        assignee: state.settings.name
    };

    if (id) {
        let index = state.tasks.findIndex(t => t.id === id);
        state.tasks[index] = { ...state.tasks[index], ...payload };
        showToast('Task updated successfully.');
    } else {
        payload.id = Date.now();
        payload.completed = false;
        state.tasks.unshift(payload);
        showToast('Task created successfully.');
    }
    
    saveState();
    closeModal();
    renderTasks();
}

function deleteTask(id) {
    if(confirm("Delete this task?")) {
        state.tasks = state.tasks.filter(t => t.id !== id);
        saveState();
        showToast('Task deleted.', 'error');
        renderTasks();
    }
}

// =========================================
// SETTINGS & SYSTEM
// =========================================
function saveSettings(e) {
    e.preventDefault();
    state.settings.name = document.getElementById('setting-name').value;
    state.settings.email = document.getElementById('setting-email').value;
    state.settings.phone = document.getElementById('setting-phone').value;
    state.settings.notifications = document.getElementById('notify-toggle').checked;
    saveState();
    showToast('Settings saved successfully!');
}

function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if(toggle) toggle.checked = state.settings.darkMode;
    toggleTheme(true);
    
    // Load settings into form
    const nameInput = document.getElementById('setting-name');
    const emailInput = document.getElementById('setting-email');
    const phoneInput = document.getElementById('setting-phone');
    const notifyToggle = document.getElementById('notify-toggle');
    
    if (nameInput) nameInput.value = state.settings.name;
    if (emailInput) emailInput.value = state.settings.email;
    if (phoneInput) phoneInput.value = state.settings.phone;
    if (notifyToggle) notifyToggle.checked = state.settings.notifications;
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
        showToast('Theme updated.');
    }
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
        showToast('Theme updated.');
    }
}

// =========================================
// AUTHENTICATION & LOGOUT
// =========================================
function logoutAdmin() {
    // Clear the session
    localStorage.removeItem('wenamyAdminSession');
    
    // Show logout message (optional)
    if (typeof showToast === 'function') {
        showToast('Logged out successfully');
    }
    
    // Redirect to login page
    window.location.replace('/admin/login');
}

// Check authentication status periodically (every 5 minutes)
setInterval(() => {
    const session = localStorage.getItem('wenamyAdminSession');
    if (!session) {
        window.location.replace('/admin/login');
        return;
    }
    
    try {
        const sessionData = JSON.parse(session);
        const loginTime = new Date(sessionData.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin >= 24) {
            localStorage.removeItem('wenamyAdminSession');
            window.location.replace('/admin/login');
        }
    } catch (e) {
        localStorage.removeItem('wenamyAdminSession');
        window.location.replace('/admin/login');
    }
}, 300000); // Check every 5 minutes

// =========================================
// RIGHT PANEL SCROLL CONTROL
// =========================================
function openRightPanel() {
    document.querySelector('.right-panel').classList.add('active');
    document.getElementById('right-panel-overlay').classList.add('active');
    document.body.classList.add('panel-open');
}

function closeRightPanel() {
    document.querySelector('.right-panel').classList.remove('active');
    document.getElementById('right-panel-overlay').classList.remove('active');
    document.body.classList.remove('panel-open');
}

// Close right panel on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeRightPanel();
    }
});
