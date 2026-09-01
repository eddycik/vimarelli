document.addEventListener("DOMContentLoaded", function() {
    
    const container = document.querySelector(".fragrance-container");
    
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Veri yüklenirken hata oluştu!");
            }
            return response.json();
        })
        .then(data => {
            displayPerfumes(data);
            setupSearch(data);
        })
        .catch(error => {
            console.error("Hata:", error);
            container.innerHTML = `<h2 style="color:var(--gold); text-align:center; margin-top:50px;">Ürünler yüklenemedi. Lütfen sayfayı yenileyin.</h2>`;
        });

    
    function displayPerfumes(perfumes) {
        container.innerHTML = ""; 
        
        if (perfumes.length === 0) {
            container.innerHTML = `<h2 style="color:var(--gold); text-align:center; width:100%; margin-top:50px;">Aradığınız kriterlere uygun parfüm bulunamadı.</h2>`;
            return;
        }

        perfumes.forEach(perfume => {
            const perfumeHTML = `
                <aside class="fragrance-visual">
                    <div class="image-showcase" style="padding: 0; overflow: hidden;">
                        <!-- İŞTE BURASI DEĞİŞTİ: Artık senin image klasöründeki kod isimli .jpg dosyalarını çekecek -->
                        <!-- Eğer o koda ait fotoğrafı henüz yüklemediysen, hata vermeyip otomatik logonu gösterecek -->
                        <img src="image/${perfume.code}.jpg" alt="${perfume.name}" onerror="this.src='image/logo.png'" style="width: 100%; height: auto; object-fit: cover;">
                    </div>
                    
                    <div class="rating-box">
                        <h3>Kullanıcı Puanı</h3>
                        <div class="score-display">4.9 <span>/ 5</span></div>
                        <div class="stars star-rating" data-id="${perfume.id}">
                            <i class="far fa-star" data-value="1"></i>
                            <i class="far fa-star" data-value="2"></i>
                            <i class="far fa-star" data-value="3"></i>
                            <i class="far fa-star" data-value="4"></i>
                            <i class="far fa-star" data-value="5"></i>
                        </div>
                        <p class="rating-status">Kendi oyunu ver</p>
                    </div>
                </aside>

                <section class="fragrance-details">
                    <h1 class="perfume-name">${perfume.name}</h1>
                    <h2 class="perfume-brand">Vi Marélli <span>${perfume.category}</span></h2>
                    
                    <div class="description">
                        <p>${perfume.description}</p>
                    </div>
                    
                    <div style="margin-bottom: 40px;">
                         <a href="${perfume.redirectUrl}" target="_blank" style="background-color: var(--gold); color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 5px; display: inline-block; transition: 0.3s; font-family: 'Montserrat', sans-serif; text-transform: uppercase; letter-spacing: 1px;">Sipariş Ver / İncele</a>
                    </div>

                    <div class="notes-pyramid">
                        <h3><i class="fas fa-layer-group"></i> Etiketler / Notalar</h3>
                        
                        <div class="note-level">
                            <div class="note-items" style="gap: 10px;">
                                ${generateKeywordsHTML(perfume.keywords)}
                            </div>
                        </div>
                    </div>
                </section>

                <aside class="right-sidebar">
                    <div class="ad-space side-ad">
                        <span>[300x250]<br>Sponsorlu İçerik</span>
                    </div>
                    
                    <div class="similar-perfumes">
                        <h3>Koleksiyon Kodu</h3>
                        <div style="font-size: 48px; color: var(--gold); font-family: 'Playfair Display', serif; text-align: center; border: 1px solid #333; padding: 20px; border-radius: 10px;">
                            #${perfume.code}
                        </div>
                    </div>
                </aside>
                
                <div style="grid-column: 1 / -1; height: 1px; background-color: #222; margin: 40px 0;"></div>
            `;
            
            container.innerHTML += perfumeHTML;
        });

        setupRatingSystem();
    }


    function generateKeywordsHTML(keywordsString) {
        if (!keywordsString) return `<span class="note"><span>Genel</span></span>`;
        
        const keywordsArray = keywordsString.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
        const limitedKeywords = keywordsArray.slice(0, 8);
        
        let html = "";
        limitedKeywords.forEach(kw => {
            const capitalizedKw = kw.charAt(0).toUpperCase() + kw.slice(1);
            html += `<div class="note"><span style="color:#D4AF37;">#</span><span style="margin-left:5px;">${capitalizedKw}</span></div>`;
        });
        
        return html;
    }


    function setupSearch(allPerfumes) {
        const searchInput = document.querySelector(".search-box input");
        const searchButton = document.querySelector(".search-box button");

        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === "") {
                displayPerfumes(allPerfumes);
                return;
            }

            const filteredPerfumes = allPerfumes.filter(perfume => {
                return perfume.name.toLowerCase().includes(searchTerm) || 
                       perfume.description.toLowerCase().includes(searchTerm) ||
                       (perfume.keywords && perfume.keywords.toLowerCase().includes(searchTerm)) ||
                       perfume.code.includes(searchTerm);
            });

            displayPerfumes(filteredPerfumes);
        }

        searchInput.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                performSearch();
            }
        });

        searchButton.addEventListener("click", performSearch);
        searchInput.addEventListener("input", performSearch); 
    }


    function setupRatingSystem() {
        const ratingContainers = document.querySelectorAll(".star-rating");

        ratingContainers.forEach(container => {
            const stars = container.querySelectorAll("i");
            const statusText = container.nextElementSibling; 
            let hasVoted = false;

            stars.forEach(star => {
                star.addEventListener("mouseover", function() {
                    if(!hasVoted) highlight(stars, this.getAttribute("data-value"));
                });

                star.addEventListener("mouseout", function() {
                    if(!hasVoted) highlight(stars, 0);
                });

                star.addEventListener("click", function() {
                    if(hasVoted) return; 
                    
                    const rating = this.getAttribute("data-value");
                    hasVoted = true;
                    highlight(stars, rating);
                    statusText.innerHTML = `<span style="color: #D4AF37; font-weight:bold;">${rating} Yıldız - Kaydedildi</span>`;
                });
            });
        });
    }

    function highlight(stars, count) {
        stars.forEach(star => {
            if (star.getAttribute("data-value") <= count) {
                star.classList.replace("far", "fas");
            } else {
                star.classList.replace("fas", "far");
            }
        });
    }
});
