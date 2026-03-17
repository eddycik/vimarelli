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
    // Eğer veriler henüz yüklenmediyse fonksiyondan çık
    if (!allPerfumes || !Array.isArray(allPerfumes)) return;

    filteredPerfumes = allPerfumes.filter(perfume => {
        // Kategori eşleşmesi
        const categoryMatch = activeCategory === 'all' || perfume.category === activeCategory;
        
        // Arama sorgusunu bir kez küçük harfe çevir
        const s = searchQuery ? searchQuery.toLowerCase() : "";
        
        // Güvenli arama: Her alanın varlığını kontrol eder (&&) ve küçük harfe çevirir
        const searchMatch = !s || 
            (perfume.name && perfume.name.toLowerCase().includes(s)) ||
            (perfume.code && perfume.code.toLowerCase().includes(s)) ||
            (perfume.description && perfume.description.toLowerCase().includes(s)) ||
            (perfume.keywords && perfume.keywords.toLowerCase().includes(s)); 
        
        return categoryMatch && searchMatch;
    });

    // Sayacı güncelleme fonksiyonun varsa buraya ekle
    if (typeof updateCategoryCounts === "function") {
        updateCategoryCounts();
    }

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
function updateCategoryCounts() {
    // HTML'deki span'ları buluyoruz
    const allEl = document.getElementById('count-all');
    const erkekEl = document.getElementById('count-erkek');
    const kadinEl = document.getElementById('count-kadın');
    const unisexEl = document.getElementById('count-unisex');

    // Eğer bu elementler sayfada varsa sayıları yazıyoruz
    if (allEl) allEl.textContent = allPerfumes.length;
    if (erkekEl) erkekEl.textContent = allPerfumes.filter(p => p.category === 'Erkek').length;
    if (kadinEl) kadinEl.textContent = allPerfumes.filter(p => p.category === 'Kadın').length;
    if (unisexEl) unisexEl.textContent = allPerfumes.filter(p => p.category === 'Unisex').length;
}
