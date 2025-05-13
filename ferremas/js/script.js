// Datos de prueba
const testUser = {
    name: "Cliente Ejemplo",
    email: "cliente@ferremas.cl"
};

// Base de datos temporal
const products = [
    { id: 1, name: "Taladro Percutor", price: 89990, image: "https://via.placeholder.com/200" },
    { id: 2, name: "Juego de Llaves", price: 25990, image: "https://via.placeholder.com/200" },
    { id: 3, name: "Pintura Latex 4L", price: 34990, image: "https://via.placeholder.com/200" },
    { id: 4, name: "Martillo", price: 12990, image: "https://via.placeholder.com/200" },
    { id: 5, name: "Destornilladores", price: 15990, image: "https://via.placeholder.com/200" },
    { id: 6, name: "Sierra Circular", price: 59990, image: "https://via.placeholder.com/200" }
];

// Estado inicial
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Elementos del DOM
const userNameSpan = document.getElementById('user-name');
const loginLink = document.getElementById('login-link');
const logoutBtn = document.getElementById('logout-btn');
const cartCount = document.getElementById('cart-count');
const themeToggle = document.getElementById('theme-toggle');
const productsContainer = document.getElementById('products-container');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadProducts();
    loadTheme();
    updateCartCount();
    
    // Verificar si hay usuario en localStorage (simulación)
    if (!currentUser && window.location.pathname.includes('index.html')) {
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        currentUser = testUser;
        updateAuthUI();
    }
});

// Funciones principales
function updateAuthUI() {
    if (currentUser) {
        userNameSpan.textContent = `Hola, ${currentUser.name}`;
        loginLink.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        userNameSpan.textContent = '';
        loginLink.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
    }
}

function loadProducts() {
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const isFavorite = favorites.includes(product.id);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toLocaleString('es-CL')}</p>
            <div class="product-actions">
                <button class="btn-favorite ${isFavorite ? 'active' : ''}">❤️</button>
                <button class="btn-add-cart">🛒 Añadir</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });

    // Event listeners para los botones
    document.querySelectorAll('.btn-favorite').forEach(btn => {
        btn.addEventListener('click', toggleFavorite);
    });

    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
}

function toggleFavorite(e) {
    const productCard = e.target.closest('.product-card');
    const productId = parseInt(productCard.dataset.id);
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
        e.target.classList.add('active');
    } else {
        favorites.splice(index, 1);
        e.target.classList.remove('active');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function addToCart(e) {
    const productCard = e.target.closest('.product-card');
    const productId = parseInt(productCard.dataset.id);
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Modo oscuro
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

function loadTheme() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

  function loadCartItems() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const container = document.getElementById('cart-items');
            const totalElement = document.getElementById('total-amount');
            
            container.innerHTML = '';
            
            if (cart.length === 0) {
                container.innerHTML = '<p>Tu carrito está vacío</p>';
                totalElement.textContent = '0';
                return;
            }
            
            let total = 0;
            
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                
                const subtotal = item.price * item.quantity;
                total += subtotal;
                
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p>$${item.price.toLocaleString('es-CL')} x ${item.quantity}</p>
                        <p>Subtotal: $${subtotal.toLocaleString('es-CL')}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                `;
                
                container.appendChild(itemElement);
            });
            
            totalElement.textContent = total.toLocaleString('es-CL');
            
            // Actualizar contador del carrito
            updateCartCount();
            
            // Agregar event listeners a los botones de eliminar
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(productId);
                });
            });
        }
        
        function removeFromCart(productId) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
        }
        
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
        }
        
        // Inicialización
        document.addEventListener('DOMContentLoaded', () => {
            loadCartItems();
            
            // Cargar estado de usuario
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                document.getElementById('user-name').textContent = `Hola, ${currentUser.name}`;
                document.getElementById('login-link').classList.add('hidden');
                document.getElementById('logout-btn').classList.remove('hidden');
            }
            
            // Configurar botón de logout
            document.getElementById('logout-btn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            });
            
            // Configurar modo oscuro
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
            }
            
            document.getElementById('theme-toggle').addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
        })

// Cerrar sesión
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    currentUser = null;
    updateAuthUI();
});