// 1. Statik Veriler
const categories = [
    { id: 1, name: 'Ana Yemekler' },
    { id: 2, name: 'Tatlılar' },
    { id: 3, name: 'Kahvaltılık' }
];

const staticProducts = [
    { 
        id: 101, 
        name: 'Örnek Yemek', 
        author: 'Sistem', // Statik veriye yazar eklendi
        categoryId: 1, 
        price: 'Tarif', 
        image: 'https://via.placeholder.com/300', 
        description: 'Bu bir örnek tariftir. Kendi tariflerinizi eklemeye başlayın!' 
    }
];

// 2. Ürünleri Listeleme Fonksiyonu
function displayProducts(productsToDisplay) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = '<div class="col-12"><p class="text-center">Henüz tarif bulunamadı.</p></div>';
        return;
    }

    productsToDisplay.forEach((product) => {
        // Kategori adını bul
        const cat = categories.find(c => c.id == product.categoryId);
        const categoryName = cat ? cat.name : "Genel";

        const div = document.createElement('div');
        div.className = 'col-md-4 mb-4'; 
        div.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img src="${product.image || 'https://via.placeholder.com/300'}" class="card-img-top" style="height:200px; object-fit:cover; border-radius: 15px 15px 0 0;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${categoryName}</span>
                        <small class="text-muted fw-bold">✍️ ${product.author || 'Anonim'}</small>
                    </div>
                    <h5 class="card-title fw-bold">${product.name}</h5>
                    <p class="card-text text-muted small">${product.description ? product.description.substring(0, 60) + '...' : ''}</p>
                    
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <a href="details.html?id=${product.id}" class="btn btn-outline-primary btn-sm">Detay</a>
                        
                        <button class="btn btn-outline-danger btn-sm" onclick="addToFavorites(${product.id})">
                            ❤️ Beğen
                        </button>

                       
                        <div class="mt-2">
                            <div class="rating" data-id="${product.id}">
                                <span onclick="rateRecipe(${product.id}, 5)">★</span>
                                <span onclick="rateRecipe(${product.id}, 4)">★</span>
                                <span onclick="rateRecipe(${product.id}, 3)">★</span>
                                <span onclick="rateRecipe(${product.id}, 2)">★</span>
                                <span onclick="rateRecipe(${product.id}, 1)">★</span>
                            </div>
                            <small class="text-muted" id="rate-count-${product.id}">
                                Puan: ${product.rating || 0} / 5
                            </small>
                        </div>

                        <button class="btn btn-light btn-sm text-danger" onclick="deleteRecipe(${product.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `;
        productsContainer.appendChild(div);
    });
}

// 3. Beğenilenlere Ekleme Fonksiyonu
function addToFavorites(id) {
    const localRecipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    const allProducts = [...staticProducts, ...localRecipes];
    
    const product = allProducts.find(p => p.id == id);
    let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
    
    if (!favorites.some(f => f.id == id)) {
        favorites.push(product);
        localStorage.setItem('myFavorites', JSON.stringify(favorites));
        alert('❤️ Tarif beğenilenlere eklendi!');
    } else {
        alert('Bu tarif zaten favorilerinizde.');
    }
}

// 4. Silme Fonksiyonu
function deleteRecipe(id) {
    if (confirm('Bu tarifi silmek istediğinize emin misiniz?')) {
        let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
        const updatedRecipes = recipes.filter(r => r.id != id);
        localStorage.setItem('myRecipes', JSON.stringify(updatedRecipes));
        
        // Eğer favorilerdeyse oradan da sil
        let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
        favorites = favorites.filter(f => f.id != id);
        localStorage.setItem('myFavorites', JSON.stringify(favorites));

        location.reload(); 
    }
}

// 5. Sayfa Yüklendiğinde Çalışacak Kısım
document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categoryid');
    const localRecipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    const allProducts = [...staticProducts, ...localRecipes];

    // Kategorileri Select kutusuna doldur
    if (categorySelect) {
        // "Tümü" seçeneği zaten HTML'de varsa (-1 gibi), sadece kategorileri döngüyle ekler
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', (e) => {
            const selectedId = parseInt(e.target.value);
            // Eğer "Tümü" seçildiyse (HTML'de value'su -1 veya boş olabilir)
            if (selectedId === -1 || isNaN(selectedId)) {
                displayProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p => p.categoryId === selectedId);
                displayProducts(filtered);
            }
        });
    }

    displayProducts(allProducts);
});

function rateRecipe(id, score) {
    let recipes = JSON.parse(localStorage.getItem('myRecipes')) || [];
    
    // İlgili tarifi bul ve puanını güncelle
    const recipeIndex = recipes.findIndex(r => r.id == id);
    
    if (recipeIndex !== -1) {
        recipes[recipeIndex].rating = score;
        localStorage.setItem('myRecipes', JSON.stringify(recipes));
        
        // Ekranda anlık güncelle (Sayfa yenilemeden)
        document.getElementById(`rate-count-${id}`).innerText = `Puan: ${score} / 5`;
        alert(`Teşekkürler! Bu tarife ${score} puan verdiniz.`);
    } else {
        alert("Statik tariflere (örnek tarif) şu an puan verilemiyor, önce kendi tarifini ekle kanka!");
    }
}