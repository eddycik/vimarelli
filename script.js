// Parfüm verileri - Buraya parfümleri ekleyebilirsiniz
const perfumesData = [
    // Örnek veriler - Kendi verilerinizi ekleyin
    // {
    //     id: "1",
    //     name: "Örnek Parfüm",
    //     code: "VM001",
    //     category: "Erkek",
    //     description: "Açıklama buraya",
    //     redirectUrl: "https://example.com"
    // }
];

// State
let allPerfumes = [];
let filteredPerfumes = [];
let activeCategory = 'all';
let searchQuery = '';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const productsContainer = document.getElementById('productsContainer');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const emptyEl = document.getElementById('empty');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Load perfumes
    loadPerfumes();
    
    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn.dataset.category));
    });
});

// Load perfumes from JSON file
async function loadPerfumes() {
    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        emptyEl.style.display = 'none';
        productsContainer.innerHTML = '';
        
        // Try to load from data.json, fallback to inline data
        try {
            const response = await fetch('data.json');
            if (response.ok) {
                const data = await response.json();
                allPerfumes = Array.isArray(data) ? data : (data.perfumes || []);
            } else {
                allPerfumes = perfumesData;
            }
        } catch (e) {
            allPerfumes = perfumesData;
        }
        
        loadingEl.style.display = 'none';
        
        if (allPerfumes.length === 0) {
            emptyEl.style.display = 'block';
            updateCategoryCounts();
            return;
        }
        
        applyFilters();
    } catch (error) {
        console.error('Error loading perfumes:', error);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
}

// Handle search
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
}

// Handle category filter
function handleFilter(category) {
    activeCategory = category;
    
    // Update active button
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    applyFilters();
}

// Apply filters
function applyFilters() {
    // Check if "Orijinal Modeller" is selected
    if (activeCategory === 'Orijinal') {
        filteredPerfumes = [];
        updateCategoryCounts();
        renderPerfumes();
        return;
    }
    
    filteredPerfumes = allPerfumes.filter(perfume => {
        // Category filter
        const categoryMatch = activeCategory === 'all' || perfume.category === activeCategory;
        
        // Search filter
        const searchMatch = !searchQuery || 
            perfume.name.toLowerCase().includes(searchQuery) ||
            perfume.code.toLowerCase().includes(searchQuery) ||
            (perfume.description && perfume.description.toLowerCase().includes(searchQuery));
        
        return categoryMatch && searchMatch;
    });
    
    updateCategoryCounts();
    renderPerfumes();
}

// Update category counts
function updateCategoryCounts() {
    const counts = {
        all: allPerfumes.length,
        Erkek: allPerfumes.filter(p => p.category === 'Erkek').length,
        Kadın: allPerfumes.filter(p => p.category === 'Kadın').length,
        Unisex: allPerfumes.filter(p => p.category === 'Unisex').length
    };
    
    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-erkek').textContent = counts.Erkek;
    document.getElementById('count-kadın').textContent = counts.Kadın;
    document.getElementById('count-unisex').textContent = counts.Unisex;
}

// Render perfumes
function renderPerfumes() {
    // Show "yakında..." message for Orijinal Modeller
    if (activeCategory === 'Orijinal') {
        productsContainer.innerHTML = `
            <div class="empty">
                <p class="empty-text">Yakında...</p>
            </div>
        `;
        return;
    }
    
    if (filteredPerfumes.length === 0) {
        productsContainer.innerHTML = `
            <div class="empty">
                <p class="empty-text">${searchQuery ? 'Aramanızla eşleşen parfüm bulunamadı' : 'Henüz parfüm eklenmemiş'}</p>
            </div>
        `;
        return;
    }
    
    // Group by category
    const grouped = filteredPerfumes.reduce((acc, perfume) => {
        if (!acc[perfume.category]) {
            acc[perfume.category] = [];
        }
        acc[perfume.category].push(perfume);
        return acc;
    }, {});
    
    // Determine which categories to show
    const categoriesToShow = activeCategory === 'all' 
        ? ['Erkek', 'Kadın', 'Unisex'] 
        : [activeCategory];
    
    const categoryLabels = {
        Erkek: 'Erkek Modelleri',
        Kadın: 'Kadın Modelleri',
        Unisex: 'Unisex Modelleri'
    };
    
    // Render
    let html = '';
    categoriesToShow.forEach(cat => {
        const items = grouped[cat] || [];
        if (items.length === 0) return;
        
        html += `
            <div class="category-group">
                <div class="category-header">
                    <h2 class="category-title">${categoryLabels[cat]}</h2>
                    <span class="category-count">${items.length} ürün</span>
                </div>
                <div class="products-grid">
                    ${items.map(perfume => renderPerfumeCard(perfume)).join('')}
                </div>
            </div>
        `;
    });
    
    productsContainer.innerHTML = html;
}

// Render single perfume card
function renderPerfumeCard(perfume) {
    const hasLink = perfume.redirectUrl && perfume.redirectUrl !== '#';
    const cardClass = hasLink ? 'perfume-card' : 'perfume-card no-link';
    const href = hasLink ? perfume.redirectUrl : '#';
    const target = hasLink ? '_blank' : '_self';
    const rel = hasLink ? 'noopener noreferrer' : '';
    
    return `
        <a href="${href}" target="${target}" rel="${rel}" class="${cardClass}">
            <div class="perfume-info">
                <h3 class="perfume-name">${escapeHtml(perfume.name)}</h3>
                <p class="perfume-code">
                    <span class="perfume-code-label">Kod:</span> ${escapeHtml(perfume.code)}
                </p>
                ${perfume.description ? `<p class="perfume-description">${escapeHtml(perfume.description)}</p>` : ''}
            </div>
            ${hasLink ? `
                <div class="perfume-link-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </div>
            ` : ''}
        </a>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

