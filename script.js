let allPerfumes = [];
let filteredPerfumes = [];
let activeCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('currentYear');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
    loadPerfumes();
    
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.category;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
            applyFilters();
        });
    });
});

async function loadPerfumes() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Veri çekilemedi');
        allPerfumes = await response.json();
        applyFilters();
    } catch (error) {
        console.error('Hata:', error);
        if(document.getElementById('error')) document.getElementById('error').style.display = 'block';
    }
}

function applyFilters() {
    filteredPerfumes = allPerfumes.filter(perfume => {
        const categoryMatch = activeCategory === 'all' || perfume.category === activeCategory;
        
        // SEO: Name, Code, Description ve eklediğin Keywords içinde arama yapar
        const searchMatch = !searchQuery || 
            (perfume.name && perfume.name.toLowerCase().includes(searchQuery)) ||
            (perfume.code && perfume.code.toLowerCase().includes(searchQuery)) ||
            (perfume.description && perfume.description.toLowerCase().includes(searchQuery)) ||
            (perfume.keywords && perfume.keywords.toLowerCase().includes(searchQuery)); 
        
        return categoryMatch && searchMatch;
    });
    renderPerfumes();
}

function renderPerfumes() {
    const container = document.getElementById('productsContainer');
    if (!container) return;

    if (filteredPerfumes.length === 0) {
        container.innerHTML = `<div class="empty"><p>Ürün bulunamadı.</p></div>`;
        return;
    }

    const categories = activeCategory === 'all' ? ['Erkek', 'Kadın', 'Unisex'] : [activeCategory];
    let html = '';

    categories.forEach(cat => {
        const items = filteredPerfumes.filter(p => p.category === cat);
        if (items.length === 0) return;

        html += `
            <div class="category-group">
                <h2 class="category-title">${cat} Modelleri</h2>
                <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
                    ${items.map(p => `
                        <a href="${p.redirectUrl || '#'}" target="_blank" class="perfume-card" style="text-decoration:none; color:inherit; border:1px solid #ddd; padding:15px; border-radius:8px; display:block;">
                            <h3>${p.name}</h3>
                            <p><strong>Kod: ${p.code}</strong></p>
                            <p style="font-size:0.9rem; color:#666;">${p.description || ''}</p>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
