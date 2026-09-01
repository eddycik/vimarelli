document.addEventListener("DOMContentLoaded", function() {
    const stars = document.querySelectorAll("#star-rating i");
    const statusText = document.getElementById("rating-status");
    let hasVoted = false;

    stars.forEach(star => {
        // Fare üzerine gelince yıldızları yak
        star.addEventListener("mouseover", function() {
            if(!hasVoted) highlight(this.getAttribute("data-value"));
        });

        // Fare çıkınca yıldızları söndür
        star.addEventListener("mouseout", function() {
            if(!hasVoted) highlight(0);
        });

        // Tıklayınca oyu kilitle
        star.addEventListener("click", function() {
            const rating = this.getAttribute("data-value");
            hasVoted = true;
            highlight(rating);
            statusText.innerHTML = `<span style="color: #D4AF37;">Teşekkürler! ${rating} yıldız verdiniz.</span>`;
            
            // Not: İleride bu oyları kalıcı yapmak için veriyi Firebase'e veya JSON'a buradan göndereceğiz.
        });
    });

    function highlight(count) {
        stars.forEach(star => {
            if (star.getAttribute("data-value") <= count) {
                star.classList.replace("far", "fas");
            } else {
                star.classList.replace("fas", "far");
            }
        });
    }
});
