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
    // Yılı güncelle
    const yearEl = document.getElementById('currentYear');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
    
    // Verileri yükle
    loadPerfumes();
    
    // Arama dinleyicisi
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    // Filtre butonları dinleyicisi
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.category;
            filterButtons.forEach(b => b.classList.toggle('active', b === btn));
            applyFilters();
        });
    });
});

async function loadPerfumes() {
    try {
        if(loadingEl) loadingEl.style.display = 'block';
        
        // data.json dosyasını çek
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('data.json dosyası bulunamadı!');
        
        const data = await response.json();
        
        // Senin JSON yapın doğrudan liste olduğu için direkt atıyoruz
        allPerfumes = data; 
        
        if(loadingEl) loadingEl.style.display = 'none';
        
        if (allPerfumes.length === 0) {
            if(emptyEl) emptyEl.style.display = 'block';
            return;
        }
        
        applyFilters();
    } catch (error) {
        console.error('Yükleme hatası:', error);
        if(loadingEl) loadingEl.style.display = 'none';
        if(errorEl) errorEl.style.display = 'block';
    }
}

function applyFilters() {
    filteredPerfumes = allPerfumes.filter(perfume => {
        const categoryMatch = activeCategory === 'all' || perfume.category === activeCategory;
        const searchMatch = !searchQuery || 
            perfume.name.toLowerCase().includes(searchQuery) ||
            perfume.code.toLowerCase().includes(searchQuery) ||
            (perfume.description && perfume.description.toLowerCase().includes(searchQuery));
        
        return categoryMatch && searchMatch;
    });
    
    updateCategoryCounts();
    renderPerfumes();
}

function updateCategoryCounts() {
    const counts = {
        all: allPerfumes.length,
        Erkek: allPerfumes.filter(p => p.category === 'Erkek').length,
        Kadın: allPerfumes.filter(p => p.category === 'Kadın').length,
        Unisex: allPerfumes.filter(p => p.category === 'Unisex').length
    };
    
    if(document.getElementById('count-all')) document.getElementById('count-all').textContent = counts.all;
    if(document.getElementById('count-erkek')) document.getElementById('count-erkek').textContent = counts.Erkek;
    if(document.getElementById('count-kadın')) document.getElementById('count-kadın').textContent = counts.Kadın;
    if(document.getElementById('count-unisex')) document.getElementById('count-unisex').textContent = counts.Unisex;
}

function renderPerfumes() {
    if (!productsContainer) return;

    if (filteredPerfumes.length === 0) {
        productsContainer.innerHTML = `<div class="empty"><p class="empty-text">Aradığınız kriterlere uygun Vi Marélli ürünü bulunamadı.</p></div>`;
        return;
    }

    const grouped = filteredPerfumes.reduce((acc, perfume) => {
        if (!acc[perfume.category]) acc[perfume.category] = [];
        acc[perfume.category].push(perfume);
        return acc;
    }, {});

    const categoriesToShow = activeCategory === 'all' ? ['Erkek', 'Kadın', 'Unisex'] : [activeCategory];
    
    let html = '';
    categoriesToShow.forEach(cat => {
        const items = grouped[cat] || [];
        if (items.length === 0) return;
        
        html += `
            <article class="category-group">
                <header class="category-header">
                    <h2 class="category-title" style="margin-top: 20px; font-weight: bold;">${cat} Parfüm Modelleri</h2>
                    <span class="category-count">${items.length} Ürün</span>
                </header>
                <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                    ${items.map(perfume => renderPerfumeCard(perfume)).join('')}
                </div>
            </article>
        `;
    });
    
    productsContainer.innerHTML = html;
}

function renderPerfumeCard(perfume) {
    const hasLink = perfume.redirectUrl && perfume.redirectUrl !== '#';
    
    return `
        <div class="perfume-card-wrapper">
            <a href="${perfume.redirectUrl}" 
               target="_blank" 
               rel="noopener" 
               class="perfume-card" 
               style="text-decoration: none; color: inherit; display: block; border: 1px solid #eee; padding: 15px; border-radius: 8px;">
                <article class="perfume-info">
                    <h3 class="perfume-name" style="margin: 0; font-size: 1.1rem;">${escapeHtml(perfume.name)}</h3>
                    <p class="perfume-code" style="margin: 5px 0; color: #666;">
                        <strong>Kod: ${escapeHtml(perfume.code)}</strong>
                    </p>
                    ${perfume.description ? `<p class="perfume-description" style="font-size: 0.9rem; color: #888;">${escapeHtml(perfume.description)}</p>` : ''}
                </article>
            </a>
        </div>
    `;
}

function escapeHtml(text) {
    if(!text) return "";
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
