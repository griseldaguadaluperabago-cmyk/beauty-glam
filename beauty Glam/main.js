// Variable global para almacenar el carrito
let cart = [];
const LOGGED_IN_KEY = 'beautyGlamLoggedIn'; 
const USER_NAME_KEY = 'beautyGlamUserName'; 
const USER_EMAIL_KEY = 'beautyGlamUserEmail'; 

document.addEventListener('DOMContentLoaded', () => {
    
    // ================================================================
    // 1. INICIALIZACIÓN Y LÓGICA DE AUTENTICACIÓN
    // ================================================================

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoggedIn = !!loggedInUser;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; 

    // Lógica de Redirección Forzada
    if (currentPage === 'index.html' || currentPage === 'registro.html' || currentPage === '') {
        // Redirige al home si está logueado y trata de acceder a login/registro
        if (isLoggedIn) {
            window.location.replace('home.html');
        }
    } else {
        // Redirige al login si NO está logueado y trata de acceder a contenido
        if (!isLoggedIn) {
            window.location.replace('index.html');
            return; 
        }
    }
    
    // Si el usuario está logueado y en una página de contenido
    if (isLoggedIn && currentPage !== 'index.html' && currentPage !== 'registro.html' && currentPage !== '') {
        displayUserName(); 
        
        // Cargar detalles del usuario en Mi Cuenta
        if (currentPage === 'cuenta.html') {
            renderAccountDetails(loggedInUser);
        }
    }
    
    // ================================================================
    // 2. LÓGICA DEL MODO OSCURO (PERSISTENTE)
    // ================================================================
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) { 
        const currentTheme = localStorage.getItem('theme'); 
        
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        const updateTheme = () => {
            document.body.classList.toggle('dark-mode');
            let theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            darkModeToggle.textContent = (theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro');
        }
        
        darkModeToggle.addEventListener('click', updateTheme);

        let initialTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        darkModeToggle.textContent = (initialTheme === 'dark' ? 'Modo Claro' : 'Modo Oscuro');
    }


    // ================================================================
    // 3. LÓGICA FUNCIONAL PARA FORMULARIOS (Simulación)
    // ================================================================
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;

            // Simulación de Login Exitoso.
            const simulatedUser = {
                name: "Usuario Glam", 
                email: email
            };
            
            localStorage.setItem('loggedInUser', JSON.stringify(simulatedUser));
            
            alert('¡Inicio de Sesión Exitoso! Bienvenido de vuelta.');
            window.location.replace('home.html'); 
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('register-email').value;
            
            const registeredUser = { name: name, email: email };
            
            alert(`¡Registro Exitoso para ${name}! Ahora inicia sesión.`);
            window.location.replace('index.html');
        });
    }
    
    // ================================================================
    // 4. INICIALIZACIÓN Y LÓGICA DEL CARRITO
    // ================================================================
    
    const savedCart = localStorage.getItem('beautyGlamCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }
    
    updateCartCount();

    if (document.querySelector('.cart-container')) {
        renderCartItems();
    }

}); // Fin de DOMContentLoaded


// ================================================================
// 5. FUNCIONES DE AUTENTICACIÓN Y MENÚ (GLOBALES)
// ================================================================

function displayUserName() {
    const greetingElement = document.getElementById('user-greeting');
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userName = loggedInUser ? loggedInUser.name.split(' ')[0] : null; 
    
    if (greetingElement && userName) {
        greetingElement.innerHTML = `<p style="font-weight: bold; margin: 0; color: var(--color-primary);">Hola, ${userName}!</p>`;
    }
}

/**
 * Función que carga los detalles de la cuenta y el botón de Cerrar Sesión.
 */
function renderAccountDetails(user) {
    const accountDetailsDiv = document.getElementById('account-details');
    if (accountDetailsDiv && user) {
        accountDetailsDiv.innerHTML = `
            <div class="user-detail">
                <p><strong>Nombre:</strong> ${user.name}</p>
                <p><strong>Correo:</strong> ${user.email}</p>
            </div>
            <button onclick="logout()" class="btn-primary btn-logout">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
        `;
    }
}


function switchForm(formType) {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (formType === 'register') {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    } else {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('loggedInUser'); 
    localStorage.removeItem(LOGGED_IN_KEY); 
    localStorage.removeItem(USER_NAME_KEY); 
    
    alert('Has cerrado tu sesión.');
    window.location.replace('index.html'); 
}


// ================================================================
// 6. FUNCIONES DE CARRITO ACCESIBLES GLOBALMENTE
// ================================================================

const formatCurrency = (amount) => {
    return '$' + amount.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + ' MXN';
};

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    alert(`"${name}" se ha añadido al carrito.`);
}

function saveCart() {
    localStorage.setItem('beautyGlamCart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

function renderCartItems() {
    const listElement = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total-amount');
    
    if (!listElement || !totalElement) return;

    listElement.innerHTML = '';
    let totalAmount = 0;

    if (cart.length === 0) {
        listElement.innerHTML = '<p style="text-align: center; padding: 20px;">El carrito está vacío. ¡Es hora de un poco de glamour!</p>';
        totalElement.textContent = formatCurrency(0);
        return;
    }

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalAmount += subtotal;

        const itemHTML = `
            <div class="cart-item">
                <div class="item-info">
                    ${item.name}
                    <span>Precio: ${formatCurrency(item.price)}</span>
                </div>
                <div class="item-quantity">
                    x${item.quantity}
                </div>
                <div class="item-price">
                    ${formatCurrency(subtotal)}
                </div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        listElement.innerHTML += itemHTML;
    });

    totalElement.textContent = formatCurrency(totalAmount);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCartCount();
    renderCartItems(); 
}

function checkout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. ¡Añade productos antes de pagar!");
        return;
    }
    const total = document.getElementById('cart-total-amount').textContent;
    alert(`Procesando el pago de ${total}. ¡Gracias por tu compra en Beauty Glam!`);
    
    clearCart(false); 
    window.location.replace('home.html'); 
}

function clearCart(showAlert = true) {
    if (showAlert && !confirm("¿Estás segura de que quieres vaciar todo el carrito?")) {
        return;
    }
    cart = [];
    saveCart();
    updateCartCount();
    if (document.querySelector('.cart-container')) {
        renderCartItems();
    }
    if (showAlert) {
        alert("El carrito ha sido vaciado.");
    }
}