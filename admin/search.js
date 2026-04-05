// =========================================
// GLOBAL SEARCH FUNCTIONALITY
// =========================================
function handleGlobalSearch(event) {
    if (event.key === 'Enter') {
        openSearchModal();
        const searchInput = document.getElementById('global-search-input');
        const modalInput = document.getElementById('search-modal-input');
        if (modalInput && searchInput) {
            modalInput.value = searchInput.value;
            performSearch(searchInput.value);
        }
    }
}

function openSearchModal() {
    const modal = document.getElementById('search-modal');
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    
    const modalInput = document.getElementById('search-modal-input');
    if (modalInput) {
        modalInput.focus();
        // If there's text in the header search, copy it
        const headerInput = document.getElementById('global-search-input');
        if (headerInput && headerInput.value) {
            modalInput.value = headerInput.value;
            performSearch(headerInput.value);
        }
    }
}

function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    modal.classList.remove('active');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    
    // Clear results
    const resultsContainer = document.getElementById('search-results');
    const statsContainer = document.getElementById('search-stats');
    if (resultsContainer) resultsContainer.innerHTML = '';
    if (statsContainer) statsContainer.textContent = '';
}

function performSearch(query) {
    if (!query || query.trim().length < 2) {
        document.getElementById('search-results').innerHTML = '<div class="search-empty">Type at least 2 characters to search...</div>';
        document.getElementById('search-stats').textContent = '';
        return;
    }
    
    query = query.toLowerCase().trim();
    const results = [];
    
    // Search Properties
    state.properties.forEach(p => {
        if (matchesSearch(p, query, ['title', 'location', 'type', 'status', 'description'])) {
            results.push({
                type: 'property',
                title: p.title,
                subtitle: p.location,
                meta: `${p.price} • ${p.type}`,
                image: p.image,
                page: 'properties',
                data: p
            });
        }
    });
    
    // Search Off-Plan Projects
    offplanProjectsData.forEach(p => {
        if (matchesSearch(p, query, ['name', 'location', 'category', 'description', 'offplanId'])) {
            results.push({
                type: 'offplan',
                title: p.name,
                subtitle: p.location,
                meta: `${p.price} • ${p.category}`,
                image: p.image,
                page: 'offplan',
                data: p
            });
        }
    });
    
    // Search Leads
    state.leads.forEach(l => {
        if (matchesSearch(l, query, ['name', 'contact', 'property', 'status'])) {
            results.push({
                type: 'lead',
                title: l.name,
                subtitle: l.property,
                meta: `${l.status} • ${l.date}`,
                icon: 'ph-user',
                page: 'leads',
                data: l
            });
        }
    });
    
    // Search Clients
    state.clients.forEach(c => {
        if (matchesSearch(c, query, ['name', 'email'])) {
            results.push({
                type: 'client',
                title: c.name,
                subtitle: c.email,
                meta: `${c.savedProperties} saved properties`,
                icon: 'ph-users',
                page: 'clients',
                data: c
            });
        }
    });
    
    // Search Blog Posts
    state.blogs.forEach(b => {
        if (matchesSearch(b, query, ['title', 'excerpt', 'category'])) {
            results.push({
                type: 'blog',
                title: b.title,
                subtitle: b.category,
                meta: b.date,
                image: b.image,
                page: 'blog',
                data: b
            });
        }
    });
    
    renderSearchResults(results, query);
}

function matchesSearch(item, query, fields) {
    return fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(query);
    });
}

function renderSearchResults(results, query) {
    const container = document.getElementById('search-results');
    const statsContainer = document.getElementById('search-stats');
    
    if (!container) return;
    
    // Update stats
    if (statsContainer) {
        const counts = {
            property: results.filter(r => r.type === 'property').length,
            offplan: results.filter(r => r.type === 'offplan').length,
            lead: results.filter(r => r.type === 'lead').length,
            client: results.filter(r => r.type === 'client').length,
            blog: results.filter(r => r.type === 'blog').length
        };
        const total = results.length;
        statsContainer.textContent = total > 0 ? `${total} results` : 'No results';
    }
    
    if (results.length === 0) {
        container.innerHTML = `
            <div class="search-empty">
                <i class="ph ph-magnifying-glass" style="font-size: 48px; opacity: 0.3;"></i>
                <p>No results found for "${escapeHtml(query)}"</p>
                <span>Try searching for properties, locations, or names</span>
            </div>
        `;
        return;
    }
    
    // Group results by type
    const grouped = {
        property: results.filter(r => r.type === 'property'),
        offplan: results.filter(r => r.type === 'offplan'),
        lead: results.filter(r => r.type === 'lead'),
        client: results.filter(r => r.type === 'client'),
        blog: results.filter(r => r.type === 'blog')
    };
    
    const typeLabels = {
        property: 'Properties',
        offplan: 'Off-Plan Projects',
        lead: 'Leads',
        client: 'Clients',
        blog: 'Blog Posts'
    };
    
    const typeIcons = {
        property: 'ph-house',
        offplan: 'ph-blueprint',
        lead: 'ph-user',
        client: 'ph-users',
        blog: 'ph-article'
    };
    
    let html = '';
    
    for (const [type, items] of Object.entries(grouped)) {
        if (items.length === 0) continue;
        
        html += `
            <div class="search-section">
                <div class="search-section-header">
                    <i class="ph ${typeIcons[type]}"></i>
                    <span>${typeLabels[type]}</span>
                    <span class="search-section-count">${items.length}</span>
                </div>
                <div class="search-section-items">
                    ${items.map(item => `
                        <div class="search-result-item" onclick="navigateToResult('${item.page}', ${item.data.id})">
                            ${item.image ? `
                                <img src="${item.image}" alt="${item.title}" class="search-result-img" onerror="this.style.display='none'">
                            ` : `
                                <div class="search-result-icon">
                                    <i class="ph ${item.icon || 'ph-file'}"></i>
                                </div>
                            `}
                            <div class="search-result-info">
                                <h4 class="search-result-title">${highlightMatch(item.title, query)}</h4>
                                <p class="search-result-subtitle">${highlightMatch(item.subtitle, query)}</p>
                                <span class="search-result-meta">${item.meta}</span>
                            </div>
                            <i class="ph ph-caret-right search-result-arrow"></i>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

function highlightMatch(text, query) {
    if (!text) return '';
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function navigateToResult(page, id) {
    closeSearchModal();
    navigateTo(page);
    
    // Clear header search input
    const headerInput = document.getElementById('global-search-input');
    if (headerInput) headerInput.value = '';
}

// Close search modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSearchModal();
    }
});
