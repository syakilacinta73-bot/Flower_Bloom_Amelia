// --- DATABASE BUNGA ---
const defaultFlowers = [
    { id: 1, name: "Buket Peony Pink", image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", price: 350000 },
    { id: 2, name: "Mawar Merah Klasik", image: "https://images.unsplash.com/photo-1548094891-c4ba474efd16?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", price: 250000 },
    { id: 3, name: "Campuran Musim Semi", image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", price: 420000 },
    { id: 4, name: "Bunga Matahari Rustic", image: "https://images.unsplash.com/photo-1565012582173-03a11880a614?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60", price: 180000 }
];

let flowers = JSON.parse(localStorage.getItem('ameliaFlowers')) || defaultFlowers;

function saveToLocalStorage() { localStorage.setItem('ameliaFlowers', JSON.stringify(flowers)); }
function formatRupiah(angka) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka); }

// --- DATABASE PENGGUNA (USERS) ---
const users = [
    { username: 'amelia', password: 'owner123', role: 'owner', name: 'Amelia' },
    { username: 'pelanggan', password: 'user123', role: 'customer', name: 'Kak Pelanggan' }
];

// --- RENDER TAMPILAN ---
function renderCustomerView() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    flowers.forEach(flower => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${flower.image}" alt="${flower.name}" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${flower.name}</h3>
                <div class="product-price">${formatRupiah(flower.price)}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderAdminView() {
    const adminList = document.getElementById('adminProductList');
    adminList.innerHTML = '';
    flowers.forEach(flower => {
        const item = document.createElement('div');
        item.className = 'admin-list-item';
        item.innerHTML = `
            <div class="admin-list-info">
                <img src="${flower.image}" alt="${flower.name}">
                <span><strong>${flower.name}</strong></span>
            </div>
            <div>
                <input type="number" class="edit-price-input" value="${flower.price}" id="price-${flower.id}">
                <button type="submit" onclick="updatePrice(${flower.id})">Simpan</button>
            </div>
        `;
        adminList.appendChild(item);
    });
}

// --- FITUR ADMIN ---
document.getElementById('addFlowerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('flowerName').value;
    const image = document.getElementById('flowerImage').value;
    const price = parseInt(document.getElementById('flowerPrice').value);
    const newId = flowers.length > 0 ? Math.max(...flowers.map(f => f.id)) + 1 : 1;
    
    flowers.push({ id: newId, name, image, price });
    saveToLocalStorage();
    this.reset();
    renderCustomerView();
    renderAdminView();
    alert('Bunga baru berhasil ditambahkan!');
});

window.updatePrice = function(id) {
    const newPrice = parseInt(document.getElementById(`price-${id}`).value);
    const flowerIndex = flowers.findIndex(f => f.id === id);
    if (flowerIndex !== -1 && !isNaN(newPrice)) {
        flowers[flowerIndex].price = newPrice;
        saveToLocalStorage();
        renderCustomerView();
        alert('Harga berhasil diperbarui!');
    }
};

// --- SISTEM LOGIN MULTI-USER ---
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');
const customerView = document.getElementById('customerView');
const adminView = document.getElementById('adminView');
const loginError = document.getElementById('loginError');
const userGreeting = document.getElementById('userGreeting');

loginBtn.addEventListener('click', () => { loginModal.classList.remove('hidden'); });

closeModal.addEventListener('click', () => { 
    loginModal.classList.add('hidden'); 
    loginError.classList.add('hidden'); 
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const userForm = document.getElementById('username').value;
    const passForm = document.getElementById('password').value;

    // Cek apakah username dan password cocok dengan data di array users
    const matchedUser = users.find(u => u.username === userForm && u.password === passForm);

    if (matchedUser) {
        // Login Sukses
        loginModal.classList.add('hidden');
        loginError.classList.add('hidden');
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        
        userGreeting.innerText = `Halo, ${matchedUser.name}!`;
        userGreeting.classList.remove('hidden');

        // Atur Tampilan Berdasarkan Role
        if (matchedUser.role === 'owner') {
            customerView.classList.add('hidden');
            adminView.classList.remove('hidden');
        } else if (matchedUser.role === 'customer') {
            adminView.classList.add('hidden');
            customerView.classList.remove('hidden');
        }
        
        loginForm.reset();
    } else {
        // Login Gagal
        loginError.classList.remove('hidden'); 
    }
});

// Proses Logout
logoutBtn.addEventListener('click', () => {
    // Kembalikan ke mode Guest (Tamu)
    adminView.classList.add('hidden');
    customerView.classList.remove('hidden');
    
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    userGreeting.classList.add('hidden');
});

// Inisialisasi awal (Sebagai Guest)
renderCustomerView();
renderAdminView();