// produtos.js - Funcionalidades das páginas de produtos

document.addEventListener('DOMContentLoaded', function() {
    
    // Troca de imagens principais
    window.changeImage = function(imageSrc) {
        const mainImage = document.getElementById('main-product-image');
        if (mainImage) {
            mainImage.src = imageSrc;
        }
    };
    
    // Sistema de abas
    window.showTab = function(tabName) {
        // Remove classe active de todas as abas
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Adiciona classe active na aba selecionada
        const selectedBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
        const selectedPane = document.getElementById(tabName);
        
        if (selectedBtn) selectedBtn.classList.add('active');
        if (selectedPane) selectedPane.classList.add('active');
    };
    
    // Sistema de FAQ expansível
    window.toggleFAQ = function(questionElement) {
        const faqItem = questionElement.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const icon = questionElement.querySelector('i');
        
        const isOpen = faqItem.classList.contains('active');
        
        // Fecha todos os outros itens
        const allFaqItems = document.querySelectorAll('.faq-item');
        allFaqItems.forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                const otherAnswer = item.querySelector('.faq-answer');
                const otherIcon = item.querySelector('.faq-question i');
                if (otherAnswer) {
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.opacity = '0';
                    otherAnswer.style.padding = '0 30px';
                }
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Abre/fecha o item clicado
        if (!isOpen) {
            faqItem.classList.add('active');
            if (icon) icon.style.transform = 'rotate(180deg)';
            if (answer) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                answer.style.padding = '0 30px 25px';
            }
        } else {
            faqItem.classList.remove('active');
            if (icon) icon.style.transform = 'rotate(0deg)';
            if (answer) {
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                answer.style.padding = '0 30px';
            }
        }
    };
    
    // Cálculo de preço baseado nas opções selecionadas
    function calculatePrice() {
        const pageCount = document.getElementById('page-count');
        const deliveryTime = document.getElementById('delivery-time');
        
        if (!pageCount || !deliveryTime) return;
        
        let basePrice = 0;
        let deliveryCost = 0;
        
        // Preço base por quantidade de páginas
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
        
        // Custo adicional por prazo de entrega
        if (deliveryTime.value === '7') {
            deliveryCost = 50;
        }
        
        const totalPrice = basePrice + deliveryCost;
        
        // Atualiza o preço exibido
        const currentPriceElement = document.querySelector('.current-price');
        if (currentPriceElement) {
            currentPriceElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        }
        
        return totalPrice;
    }
    
    // Adiciona event listeners para mudanças de preço
    const pageCountSelect = document.getElementById('page-count');
    const deliveryTimeSelect = document.getElementById('delivery-time');
    
    if (pageCountSelect) {
        pageCountSelect.addEventListener('change', calculatePrice);
    }
    
    if (deliveryTimeSelect) {
        deliveryTimeSelect.addEventListener('change', calculatePrice);
    }
    
    // Inicializa o preço
    calculatePrice();
    
    // Sistema de avaliação por estrelas (interativo)
    const ratingStars = document.querySelectorAll('.stars i');
    ratingStars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            // Reseta todas as estrelas
            ratingStars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = '#ffd700';
                } else {
                    s.style.color = 'rgba(255, 255, 255, 0.3)';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            // Restaura cor original
            ratingStars.forEach(s => {
                s.style.color = '#ffd700';
            });
        });
        
        star.addEventListener('click', function() {
            const rating = index + 1;
            console.log(`Avaliação: ${rating} estrelas`);
            // Aqui você pode implementar o sistema de avaliação real
        });
    });
    
    // Animações de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.product-features li, .spec-item, .review-item, .related-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Efeito de zoom nas imagens dos produtos relacionados
    const relatedImages = document.querySelectorAll('.related-item img');
    relatedImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Smooth scroll para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Validação de formulários (se houver)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aqui você pode implementar a validação real
            console.log('Formulário enviado');
        });
    });
    
    // Sistema de breadcrumb dinâmico
    function updateBreadcrumb() {
        const currentPage = window.location.pathname.split('/').pop();
        const breadcrumbElement = document.querySelector('.product-breadcrumb span:last-child');
        
        if (breadcrumbElement && currentPage) {
            const pageName = currentPage.replace('.html', '').replace('produto-', '').replace('-', ' ');
            breadcrumbElement.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        }
    }
    
    updateBreadcrumb();
    
    // Sistema de notificações para ações do usuário
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4dd5fb' : '#2196F3'};
            color: #141313;
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
    
    // Adiciona estilos CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
            opacity: 0;
            padding: 0 30px;
        }
        
        .faq-item.active .faq-answer {
            max-height: 200px;
            opacity: 1;
            padding: 0 30px 25px;
        }
        
        .faq-question i {
            transition: transform 0.3s ease;
        }
        
        .related-item img {
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Produtos.js carregado com sucesso!');
});
