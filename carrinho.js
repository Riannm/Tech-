// carrinho.js - Sistema de Carrinho de Compras

// Estrutura do carrinho
let cart = JSON.parse(localStorage.getItem('techplus_cart')) || [];
let cartTotal = 0;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateCartTotal();
    renderCartItems();
});

// Funções do carrinho
window.toggleCart = function() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    } else {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
    }
};

window.addToCart = function() {
    // Tenta encontrar elementos de produto padrão
    let productName = document.querySelector('.product-info h1')?.textContent;
    let productImage = document.getElementById('main-product-image')?.src;
    let pageCount = document.getElementById('page-count');
    let deliveryTime = document.getElementById('delivery-time');
    let testOption = document.getElementById('test-option');
    
    if (!productName || !productImage) {
        showNotification('Erro ao adicionar produto ao carrinho', 'error');
        return;
    }
    
    let totalPrice = 0;
    let options = {};
    
    // Se for um produto com opções de páginas (criação de sites)
    if (pageCount && deliveryTime) {
        let basePrice = 0;
        let deliveryCost = 0;
        
        switch(pageCount.value) {
            case '5':
                basePrice = 299;
                break;
            case '10':
                basePrice = 449;
                break;
            case '15':
                basePrice = 599;
                break;
            case 'unlimited':
                basePrice = 799;
                break;
        }
        
        if (deliveryTime.value === '7') {
            deliveryCost = 50;
        }
        
        totalPrice = basePrice + deliveryCost;
        options = {
            pages: pageCount.value,
            delivery: deliveryTime.value
        };
    }
    // Se for um produto de teste
    else if (testOption) {
        switch(testOption.value) {
            case 'basic':
                totalPrice = 99;
                break;
            case 'premium':
                totalPrice = 149;
                break;
            case 'ultimate':
                totalPrice = 199;
                break;
        }
        options = {
            type: testOption.value
        };
    }
    // Produto padrão sem opções
    else {
        // Tenta extrair preço do texto da página
        const priceElement = document.querySelector('.current-price');
        if (priceElement) {
            const priceText = priceElement.textContent;
            const priceMatch = priceText.match(/R\$\s*([\d,]+)/);
            if (priceMatch) {
                totalPrice = parseFloat(priceMatch[1].replace(',', '.'));
            }
        }
        
        if (totalPrice === 0) {
            totalPrice = 99; // Preço padrão
        }
        
        options = {
            type: 'standard'
        };
    }
    
    // Cria o item do carrinho
    const cartItem = {
        id: generateCartItemId(),
        name: productName,
        image: productImage,
        price: totalPrice,
        options: options,
        quantity: 1
    };
    
    // Verifica se o produto já está no carrinho
    const existingItemIndex = cart.findIndex(item => 
        item.name === cartItem.name && 
        JSON.stringify(item.options) === JSON.stringify(cartItem.options)
    );
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
        showNotification('Quantidade atualizada no carrinho!', 'success');
    } else {
        cart.push(cartItem);
        showNotification('Produto adicionado ao carrinho!', 'success');
    }
    
    // Salva no localStorage e atualiza a interface
    saveCart();
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    
    // Abre o carrinho automaticamente
    setTimeout(() => {
        toggleCart();
    }, 1000);
};

window.buyNow = function() {
    // Adiciona ao carrinho primeiro
    addToCart();
    
    // Redireciona para o checkout (implementar depois)
    setTimeout(() => {
        showNotification('Redirecionando para o checkout...', 'info');
        // window.location.href = 'checkout.html';
    }, 1500);
};

window.removeFromCart = function(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    showNotification('Item removido do carrinho', 'success');
};

window.updateQuantity = function(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        saveCart();
        updateCartCount();
        updateCartTotal();
        renderCartItems();
    }
};

window.clearCart = function() {
    if (cart.length === 0) {
        showNotification('Carrinho já está vazio', 'info');
        return;
    }
    
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        saveCart();
        updateCartCount();
        updateCartTotal();
        renderCartItems();
        showNotification('Carrinho limpo com sucesso', 'success');
    }
};

window.checkout = function() {
    if (cart.length === 0) {
        showNotification('Adicione produtos ao carrinho primeiro', 'error');
        return;
    }
    
    // Aqui você implementaria o redirecionamento para o checkout
    showNotification('Sistema de checkout será implementado em breve!', 'info');
    console.log('Itens para checkout:', cart);
};

// Funções auxiliares
function generateCartItemId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveCart() {
    localStorage.setItem('techplus_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const cartCountMobileElement = document.getElementById('cart-count-mobile');
    
    if (cartCountElement || cartCountMobileElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            // Adiciona classe para animação quando há itens
            if (totalItems > 0) {
                cartCountElement.classList.add('has-items');
            } else {
                cartCountElement.classList.remove('has-items');
            }
        }
        
        if (cartCountMobileElement) {
            cartCountMobileElement.textContent = totalItems;
        }
    }
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal.toFixed(2).replace('.', ',');
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <small>Adicione produtos para começar</small>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-options">
                    <small>${formatOptions(item.options)}</small>
                </div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity('${item.id}', -1)" class="qty-btn">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" class="qty-btn">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="cart-item-remove" title="Remover">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function formatOptions(options) {
    if (options.pages && options.delivery) {
        // Produto de criação de sites
        const pagesText = options.pages === 'unlimited' ? 'Páginas ilimitadas' : `${options.pages} páginas`;
        const deliveryText = options.delivery === '7' ? 'Entrega rápida' : `${options.delivery} dias úteis`;
        return `${pagesText} • ${deliveryText}`;
    } else if (options.type) {
        // Produto de teste ou padrão
        const typeText = {
            'basic': 'Básico',
            'premium': 'Premium',
            'ultimate': 'Ultimate',
            'standard': 'Padrão'
        };
        return typeText[options.type] || options.type;
    }
    return 'Padrão';
}

function showNotification(message, type = 'success') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Adiciona estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4dd5fb' : type === 'error' ? '#e74c3c' : '#2196F3'};
        color: ${type === 'success' || type === 'error' ? '#141313' : '#141313'};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10002;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Adiciona estilos CSS para o carrinho
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .empty-cart {
        text-align: center;
        padding: 40px 20px;
        color: rgba(255, 255, 255, 0.7);
    }
    
    .empty-cart i {
        font-size: 3rem;
        margin-bottom: 15px;
        color: rgba(255, 255, 255, 0.3);
    }
    
    .empty-cart p {
        margin-bottom: 5px;
        font-size: 1.1rem;
    }
    
    .empty-cart small {
        font-size: 0.9rem;
        opacity: 0.7;
    }
    
    .cart-item-options {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        margin-bottom: 8px;
    }
    
    .cart-item-quantity {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 8px;
    }
    
    .qty-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .qty-btn:hover {
        background: #4dd5fb;
        color: #141313;
    }
    
    .qty-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    #cart-count.has-items {
        animation: pulse 0.6s ease-in-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .cart-item {
        animation: slideInLeft 0.3s ease-out;
    }
    
    @keyframes slideInLeft {
        from {
            transform: translateX(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .cart-sidebar {
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(cartStyles);

// Event listeners para fechar o carrinho com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Persistência do carrinho entre páginas
window.addEventListener('beforeunload', function() {
    saveCart();
});

console.log('Carrinho.js carregado com sucesso!');
