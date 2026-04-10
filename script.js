$(document).ready(function() {
    let cart = JSON.parse(localStorage.getItem('animeCart')) || [];
    updateCartUI();

    // --- 1. ADD TO CART FUNCTION ---
    function addItem(title, price, img) {
        cart.push({ title, price, imgSrc: img });
        localStorage.setItem('animeCart', JSON.stringify(cart));
        updateCartUI();
        
        // Show Toast
        let toastEl = document.getElementById('cartToast');
        if (toastEl) {
            $('#toast-message').text(title + " added to cart!");
            new bootstrap.Toast(toastEl).show();
        }
    }

    // From Main Grid
    $(document).on('click', '.add-to-cart', function() {
        let card = $(this).closest('.product-card');
        let title = card.find('.card-title').text();
        let price = parseFloat(card.find('.price-text').text().replace('RM', '').trim());
        let img = card.find('img').attr('src');
        addItem(title, price, img);
    });

    // From Modal
    $('.add-to-cart-modal').click(function() {
        let title = $('#modalTitle').text();
        let price = parseFloat($('#modalPrice').text().replace('RM', '').trim());
        let img = $('#modalImg').attr('src');
        addItem(title, price, img);
        let modalEl = document.getElementById('productModal');
        if (modalEl) {
            bootstrap.Modal.getInstance(modalEl).hide();
        }
    });

    // --- 2. MODAL POPULATOR ---
    $('.product-img-wrapper').click(function() {
        let card = $(this).closest('.product-card');
        $('#modalTitle').text(card.find('.card-title').text());
        $('#modalPrice').text(card.find('.price-text').text());
        $('#modalImg').attr('src', $(this).find('img').attr('src'));
        $('#modalDesc').text($(this).data('desc'));
        $('#modalMat').text($(this).data('material'));
    });

    // --- 3. CATEGORY & SEARCH ---
    $('.filter-btn').click(function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        let choice = $(this).text().toLowerCase().trim();
        choice === "all" ? $('.col-lg-3, .col-6').fadeIn() : ($('.col-lg-3, .col-6').hide(), $('.' + choice).fadeIn());
    });

    $('#productSearch').on('keyup', function() {
        let value = $(this).val().toLowerCase();
        $('.col-lg-3, .col-6').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // --- 4. UI REFRESH ---
    function updateCartUI() {
        // Updates BOTH the desktop link and the floating mobile button
        $('#cart-count, #floating-count').text(cart.length); 
        
        let cartList = $('#cart-items-list').empty();
        let total = 0;

        if (cart.length === 0) {
            cartList.append('<div class="text-center py-5"><i class="bi bi-cart-x fs-1"></i><p>Empty</p></div>');
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                cartList.append(`
                    <div class="d-flex align-items-center mb-2 p-2 cart-item-row">
                        <img src="${item.imgSrc}" width="50" height="50" class="rounded me-2" style="object-fit:cover;">
                        <div class="flex-grow-1">
                            <h6 class="mb-0 small fw-bold">${item.title}</h6>
                            <small class="text-dark">RM ${item.price.toFixed(2)}</small>
                        </div>
                        <button class="btn btn-sm text-danger remove-item" data-index="${index}">&times;</button>
                    </div>
                `);
            });
        }
        $('#cart-total-amount').text(total.toFixed(2));
    }

    // --- 5. REMOVE & CLEAR ---
    $(document).on('click', '.remove-item', function() {
        let index = $(this).data('index');
        cart.splice(index, 1);
        localStorage.setItem('animeCart', JSON.stringify(cart));
        updateCartUI();
    });

    $('#clear-cart').click(function() {
        if(confirm("Clear all items?")) { 
            cart = []; 
            localStorage.removeItem('animeCart'); 
            updateCartUI(); 
        }
    });

    // --- 6. CHECKOUT ---
    $('#checkout-whatsapp').click(function() {
        if (!cart.length) return;
        let msg = "Order for FEAAA's MERCH:%0a";
        cart.forEach((item, i) => msg += `${i+1}. ${item.title} (RM${item.price.toFixed(2)})%0a`);
        window.open(`https://wa.me/60182705756?text=${msg}%0a*Total: RM${$('#cart-total-amount').text()}*`);
    });
});
