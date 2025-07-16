// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const searchBtn = document.getElementById('searchBtn');
const cartBtn = document.getElementById('cartBtn');
const searchModal = document.getElementById('searchModal');
const cartSidebar = document.getElementById('cartSidebar');
const searchClose = document.getElementById('searchClose');
const cartClose = document.getElementById('cartClose');

// State
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let cartCount = cartItems.length;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeCart();
    initializeScrollEffects();
    initializeForms();
    initializeCatalog();
    initializeInventory();
    initializeProcurement();
    initializeAnalytics();
    initializeSupport();
    initializeCheckout();
    initializePayment();
    updateCartDisplay();
    updateCartContent();
});

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks) navLinks.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        });
    });

    // Update active nav link based on current page
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinkElements = document.querySelectorAll('.nav-link');
    
    navLinkElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Search
function initializeSearch() {
    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', function() {
            searchModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }

    if (searchModal) {
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearch();
            }
        });
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }

    // Suggestion tags
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            performSearch(this.textContent);
        });
    });
}

function closeSearch() {
    if (searchModal) {
        searchModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    const query = searchInput.value.trim();
    
    if (query.length > 2) {
        const mockResults = [
            { name: 'Dell OptiPlex 7090', category: 'Computers', price: '$1,299' },
            { name: 'IoT Temperature Sensor', category: 'Smart Devices', price: '$89' },
            { name: 'Cisco Catalyst 9300', category: 'Network', price: '$1,899' },
            { name: 'Lenovo ThinkPad E15', category: 'Computers', price: '$899' }
        ].filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h4>Search Results for "${query}"</h4>
                <div class="search-result-items">
                    ${mockResults.map(item => `
                        <div class="search-result-item" onclick="goToProduct('${item.name}')">
                            <strong>${item.name}</strong>
                            <p>${item.category} • ${item.price}</p>
                        </div>
                    `).join('')}
                    ${mockResults.length === 0 ? '<p>No results found. Try different keywords.</p>' : ''}
                </div>
                <div class="search-actions">
                    <button class="btn btn-primary" onclick="performSearch('${query}')">View All Results</button>
                </div>
            </div>
        `;
    } else {
        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h4>Popular Searches</h4>
                <div class="suggestion-tags">
                    <span class="suggestion-tag" onclick="performSearch('Dell Laptops')">Dell Laptops</span>
                    <span class="suggestion-tag" onclick="performSearch('IoT Sensors')">IoT Sensors</span>
                    <span class="suggestion-tag" onclick="performSearch('Network Switches')">Network Switches</span>
                    <span class="suggestion-tag" onclick="performSearch('Workstations')">Workstations</span>
                </div>
            </div>
        `;
    }
}

function performSearch(query) {
    closeSearch();
    window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
}

function goToProduct(productName) {
    closeSearch();
    window.location.href = `catalog.html?product=${encodeURIComponent(productName)}`;
}

// Cart
function initializeCart() {
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productData = {
                id: this.getAttribute('data-product-id') || Date.now().toString(),
                name: productCard.querySelector('.product-title').textContent,
                price: productCard.querySelector('.price').textContent,
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            addToCart(productData);
        });
    });
}

function closeCart() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

function addToCart(productData) {
    const existingItem = cartItems.find(item => item.id === productData.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push(productData);
    }
    
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    updateCartDisplay();
    updateCartContent();
    
    showNotification('Item added to cart!', 'success');
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    updateCartDisplay();
    updateCartContent();
    
    showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateCartDisplay();
            updateCartContent();
        }
    }
}

function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'block' : 'none';
    }
}

function updateCartContent() {
    const cartContent = document.querySelector('.cart-content');
    if (!cartContent) return;
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <a href="catalog.html" class="btn btn-primary">Browse Catalog</a>
            </div>
        `;
    } else {
        const total = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', '').replace(',', ''));
            return sum + (price * item.quantity);
        }, 0);

        cartContent.innerHTML = `
            <div class="cart-items">
                ${cartItems.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>${item.price}</p>
                            <div class="quantity-controls">
                                <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Total: $${total.toLocaleString()}</strong>
                </div>
                <button class="btn btn-primary btn-full" onclick="proceedToCheckout()">Proceed to Checkout</button>
            </div>
        `;
    }
}

function proceedToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    closeCart();
    window.location.href = 'checkout.html';
}

// Checkout functionality
function initializeCheckout() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Store checkout data
                const formData = new FormData(this);
                const checkoutData = Object.fromEntries(formData);
                localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
                
                showNotification('Information saved. Proceeding to payment...', 'success');
                setTimeout(() => {
                    window.location.href = 'payment.html';
                }, 1500);
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        });
    }
}

// Payment functionality
function initializePayment() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment forms
            document.querySelectorAll('.payment-form').forEach(form => {
                form.style.display = 'none';
            });
            
            // Show selected payment form
            const selectedForm = document.getElementById(this.value + 'Form');
            if (selectedForm) {
                selectedForm.style.display = 'block';
            }
        });
    });

    const processPaymentBtn = document.getElementById('processPaymentBtn');
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
}

function processPayment() {
    showLoading();
    
    // Simulate payment processing
    setTimeout(() => {
        hideLoading();
        
        // Generate order number
        const orderNumber = 'ORD-2024-' + String(Math.floor(Math.random() * 900000) + 100000);
        localStorage.setItem('orderNumber', orderNumber);
        localStorage.setItem('orderDate', new Date().toLocaleDateString());
        
        // Clear cart
        cartItems = [];
        cartCount = 0;
        localStorage.removeItem('cartItems');
        updateCartDisplay();
        
        showNotification('Payment processed successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 1500);
    }, 3000);
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        // Navbar scroll effect
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Animate elements on scroll
        animateOnScroll();
    });
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.quick-action-card, .category-card, .feature-card, .product-card, .stat-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Forms
function initializeForms() {
    // Procurement form
    const procurementForm = document.getElementById('procurementForm');
    if (procurementForm) {
        procurementForm.addEventListener('submit', handleProcurementSubmit);
        
        // Add item functionality
        const addItemBtn = document.getElementById('addItemBtn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', addItemRow);
        }
        
        // File upload
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (fileUploadArea && fileInput) {
            fileUploadArea.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', handleFileUpload);
        }
    }

    // Support contact form
    const supportContactForm = document.getElementById('supportContactForm');
    if (supportContactForm) {
        supportContactForm.addEventListener('submit', handleSupportSubmit);
    }
}

function handleProcurementSubmit(e) {
    e.preventDefault();
    
    showLoading();
    
    // Generate request ID
    const requestId = 'REQ-2024-' + String(Math.floor(Math.random() * 9000) + 1000);
    
    setTimeout(() => {
        hideLoading();
        showNotification(`Procurement request ${requestId} submitted successfully!`, 'success');
        e.target.reset();
        
        // Add to recent requests (simulate)
        addToRecentRequests({
            id: requestId,
            title: document.getElementById('requestTitle').value,
            department: document.getElementById('department').value,
            status: 'pending',
            date: new Date().toLocaleDateString()
        });
    }, 2000);
}

function handleSupportSubmit(e) {
    e.preventDefault();
    
    showLoading();
    
    const ticketId = 'TICKET-' + String(Math.floor(Math.random() * 90000) + 10000);
    
    setTimeout(() => {
        hideLoading();
        showNotification(`Support ticket ${ticketId} created successfully! We'll respond within 4 hours.`, 'success');
        e.target.reset();
    }, 2000);
}

function addItemRow() {
    const itemsContainer = document.getElementById('itemsContainer');
    if (!itemsContainer) return;
    
    const newRow = document.createElement('div');
    newRow.className = 'item-row';
    newRow.innerHTML = `
        <div class="form-group">
            <label>Item Name *</label>
            <input type="text" name="itemName[]" required placeholder="e.g., Dell OptiPlex 7090">
        </div>
        <div class="form-group">
            <label>Quantity *</label>
            <input type="number" name="quantity[]" required min="1" placeholder="1">
        </div>
        <div class="form-group">
            <label>Estimated Cost</label>
            <input type="number" name="estimatedCost[]" step="0.01" placeholder="0.00">
        </div>
        <div class="form-group">
            <label>Category</label>
            <select name="category[]">
                <option value="">Select Category</option>
                <option value="computers">Computers</option>
                <option value="smart-devices">Smart Devices</option>
                <option value="network">Network Equipment</option>
                <option value="accessories">Accessories</option>
            </select>
        </div>
        <button type="button" class="remove-item-btn" onclick="removeItem(this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
            </svg>
        </button>
    `;
    
    itemsContainer.appendChild(newRow);
}

function removeItem(button) {
    button.closest('.item-row').remove();
}

function handleFileUpload(e) {
    const files = e.target.files;
    const uploadedFiles = document.getElementById('uploadedFiles');
    
    if (!uploadedFiles) return;
    
    uploadedFiles.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'uploaded-file';
        fileItem.innerHTML = `
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <button class="remove-file" onclick="this.parentElement.remove()">×</button>
        `;
        uploadedFiles.appendChild(fileItem);
    });
}

// Catalog
function initializeCatalog() {
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const category = urlParams.get('category');
    
    if (searchQuery) {
        const searchInput = document.querySelector('#inventorySearch, .search-box input');
        if (searchInput) {
            searchInput.value = searchQuery;
            applyFilters();
        }
    }
    
    if (category) {
        const categoryCheckbox = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            applyFilters();
        }
    }

    // Filters
    const filterOptions = document.querySelectorAll('.filter-option input[type="checkbox"]');
    filterOptions.forEach(option => {
        option.addEventListener('change', applyFilters);
    });

    // Price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            const priceValue = document.getElementById('priceValue');
            if (priceValue) {
                priceValue.textContent = `$${parseInt(this.value).toLocaleString()}`;
            }
            applyFilters();
        });
    }

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }

    // View toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const view = this.getAttribute('data-view');
            toggleView(view);
        });
    });

    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            filterOptions.forEach(option => option.checked = false);
            if (priceRange) priceRange.value = 5000;
            applyFilters();
        });
    }

    // Quick view buttons
    const quickViewBtns = document.querySelectorAll('.action-btn[title="Quick View"]');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            showQuickView(productName);
        });
    });
}

function showQuickView(productName) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <div class="quick-view-header">
                <h3>${productName}</h3>
                <button class="close-quick-view">×</button>
            </div>
            <div class="quick-view-body">
                <div class="product-image">
                    <img src="https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" alt="${productName}">
                </div>
                <div class="product-details">
                    <p>Detailed specifications and features would be displayed here.</p>
                    <div class="product-specs">
                        <h4>Specifications:</h4>
                        <ul>
                            <li>Intel Core i7 Processor</li>
                            <li>16GB DDR4 RAM</li>
                            <li>512GB SSD Storage</li>
                            <li>Windows 11 Pro</li>
                        </ul>
                    </div>
                    <div class="quick-view-actions">
                        <button class="btn btn-primary">Add to Cart</button>
                        <button class="btn btn-outline">View Full Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.close-quick-view').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
}

function applyFilters() {
    const productCards = document.querySelectorAll('.product-card');
    const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    const checkedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(cb => cb.value);
    const priceRange = document.getElementById('priceRange');
    const maxPrice = priceRange ? parseInt(priceRange.value) : 10000;
    
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const brand = card.getAttribute('data-brand');
        const price = parseInt(card.getAttribute('data-price'));
        
        const categoryMatch = checkedCategories.length === 0 || checkedCategories.includes(category);
        const brandMatch = checkedBrands.length === 0 || checkedBrands.includes(brand);
        const priceMatch = price <= maxPrice;
        
        if (categoryMatch && brandMatch && priceMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Showing 1-${Math.min(visibleCount, 24)} of ${visibleCount} products`;
    }
}

function applySorting() {
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!sortSelect || !productsGrid) return;
    
    const sortValue = sortSelect.value;
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
            case 'price-high':
                return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
            case 'name':
                return a.querySelector('.product-title').textContent.localeCompare(b.querySelector('.product-title').textContent);
            default:
                return 0;
        }
    });
    
    productCards.forEach(card => productsGrid.appendChild(card));
}

function toggleView(view) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (view === 'list') {
        productsGrid.classList.add('list-view');
    } else {
        productsGrid.classList.remove('list-view');
    }
}

// Inventory
function initializeInventory() {
    // Search
    const inventorySearch = document.getElementById('inventorySearch');
    if (inventorySearch) {
        inventorySearch.addEventListener('input', filterInventory);
    }

    // Filters
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterInventory);
    if (statusFilter) statusFilter.addEventListener('change', filterInventory);

    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const rowSelects = document.querySelectorAll('.row-select');
            rowSelects.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // Quick action buttons
    const addAssetBtn = document.getElementById('addAssetBtn');
    const bulkUpdateBtn = document.getElementById('bulkUpdateBtn');
    const exportBtn = document.getElementById('exportBtn');
    const generateReportBtn = document.getElementById('generateReportBtn');

    if (addAssetBtn) addAssetBtn.addEventListener('click', showAddAssetModal);
    if (bulkUpdateBtn) bulkUpdateBtn.addEventListener('click', () => showNotification('Bulk Update functionality would be implemented here', 'info'));
    if (exportBtn) exportBtn.addEventListener('click', exportInventoryData);
    if (generateReportBtn) generateReportBtn.addEventListener('click', generateInventoryReport);
}

function showAddAssetModal() {
    const modal = document.createElement('div');
    modal.className = 'add-asset-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Add New Asset</h3>
                <button class="close-modal">×</button>
            </div>
            <form class="add-asset-form">
                <div class="form-group">
                    <label>Asset Name *</label>
                    <input type="text" name="assetName" required>
                </div>
                <div class="form-group">
                    <label>Category *</label>
                    <select name="category" required>
                        <option value="">Select Category</option>
                        <option value="computers">Computers</option>
                        <option value="smart-devices">Smart Devices</option>
                        <option value="network">Network Equipment</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Location *</label>
                    <input type="text" name="location" required>
                </div>
                <div class="form-group">
                    <label>Assigned To</label>
                    <input type="text" name="assignedTo">
                </div>
                <div class="form-group">
                    <label>Purchase Value</label>
                    <input type="number" name="value" step="0.01">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Asset</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });
    });
    
    modal.querySelector('.add-asset-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const assetId = 'ST-' + String(Math.floor(Math.random() * 900000) + 100000);
        showNotification(`Asset ${assetId} added successfully!`, 'success');
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
}

function exportInventoryData() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Inventory data exported successfully!', 'success');
        
        // Simulate file download
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,Asset ID,Name,Category,Location,Status,Value\nST-001847,Dell OptiPlex 7090,Computers,Engineering - Floor 3,Active,$1299';
        link.download = 'inventory_export.csv';
        link.click();
    }, 2000);
}

function generateInventoryReport() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Inventory report generated successfully!', 'success');
        window.open('analytics.html', '_blank');
    }, 2000);
}

function filterInventory() {
    const searchTerm = document.getElementById('inventorySearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    const rows = document.querySelectorAll('.inventory-table tbody tr');
    
    rows.forEach(row => {
        const assetName = row.querySelector('.asset-name')?.textContent.toLowerCase() || '';
        const assetId = row.querySelector('.asset-id')?.textContent.toLowerCase() || '';
        const category = row.querySelector('.category-tag')?.textContent.toLowerCase() || '';
        const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';
        
        const matchesSearch = assetName.includes(searchTerm) || assetId.includes(searchTerm);
        const matchesCategory = !categoryFilter || category.includes(categoryFilter);
        const matchesStatus = !statusFilter || status.includes(statusFilter);
        
        if (matchesSearch && matchesCategory && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Procurement
function initializeProcurement() {
    // Set minimum date for needed by field
    const neededByInput = document.getElementById('neededBy');
    if (neededByInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        neededByInput.min = tomorrow.toISOString().split('T')[0];
    }

    // Load recent requests
    loadRecentRequests();
}

function loadRecentRequests() {
    const recentRequests = JSON.parse(localStorage.getItem('recentRequests')) || [];
    const requestsList = document.querySelector('.requests-list');
    
    if (requestsList && recentRequests.length > 0) {
        requestsList.innerHTML = recentRequests.map(request => `
            <div class="request-item">
                <div class="request-info">
                    <div class="request-title">${request.title}</div>
                    <div class="request-meta">${request.id} • ${request.department}</div>
                    <div class="request-date">Submitted ${request.date}</div>
                </div>
                <div class="request-status">
                    <span class="status-badge ${request.status}">${request.status}</span>
                </div>
            </div>
        `).join('');
    }
}

function addToRecentRequests(request) {
    let recentRequests = JSON.parse(localStorage.getItem('recentRequests')) || [];
    recentRequests.unshift(request);
    recentRequests = recentRequests.slice(0, 10); // Keep only last 10
    localStorage.setItem('recentRequests', JSON.stringify(recentRequests));
    loadRecentRequests();
}

// Analytics
function initializeAnalytics() {
    // Time range selector
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            updateAnalyticsData(this.value);
        });
    }

    // Export and schedule buttons
    const exportReport = document.getElementById('exportReport');
    const scheduleReport = document.getElementById('scheduleReport');

    if (exportReport) {
        exportReport.addEventListener('click', exportAnalyticsReport);
    }

    if (scheduleReport) {
        scheduleReport.addEventListener('click', showScheduleModal);
    }

    // Chart filters
    const chartFilters = document.querySelectorAll('.chart-filter, .analysis-filter, .products-filter');
    chartFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updateChartData(this.value);
        });
    });
}

function exportAnalyticsReport() {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification('Analytics report exported successfully!', 'success');
        
        // Simulate file download
        const link = document.createElement('a');
        link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKEFuYWx5dGljcyBSZXBvcnQp';
        link.download = 'analytics_report.pdf';
        link.click();
    }, 2000);
}

function showScheduleModal() {
    const modal = document.createElement('div');
    modal.className = 'schedule-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Schedule Report</h3>
                <button class="close-modal">×</button>
            </div>
            <form class="schedule-form">
                <div class="form-group">
                    <label>Report Frequency</label>
                    <select name="frequency" required>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Email Recipients</label>
                    <input type="email" name="recipients" required placeholder="email@stellantis.com">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Schedule Report</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    const closeButtons = modal.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        });
    });
    
    modal.querySelector('.schedule-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Report scheduled successfully!', 'success');
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
}

function updateAnalyticsData(timeRange) {
    showNotification(`Analytics updated for ${timeRange}`, 'info');
    // Simulate data update with animation
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.style.opacity = '0.5';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 500);
    });
}

function updateChartData(filterValue) {
    showNotification(`Chart updated with filter: ${filterValue}`, 'info');
}

// Support
function initializeSupport() {
    // FAQ toggles
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // Close other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                item.classList.toggle('active');
            });
        }
    });

    // Help search
    const helpSearch = document.getElementById('helpSearch');
    if (helpSearch) {
        helpSearch.addEventListener('input', function() {
            if (this.value.length > 2) {
                showHelpResults(this.value);
            }
        });
    }

    // Support action buttons
    const supportButtons = document.querySelectorAll('.support-card .btn');
    supportButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            switch(action) {
                case 'Start Chat':
                    startLiveChat();
                    break;
                case 'Send Email':
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'Call Now':
                    window.open('tel:+15551234567');
                    break;
                default:
                    showNotification(`${action} functionality would be implemented here`, 'info');
            }
        });
    });

    // Help category clicks
    const helpCategories = document.querySelectorAll('.help-category');
    helpCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            showCategoryHelp(categoryName);
        });
    });
}

function showHelpResults(query) {
    const mockResults = [
        { title: 'How to submit a procurement request', category: 'Procurement' },
        { title: 'Tracking your order status', category: 'Orders' },
        { title: 'Managing inventory assets', category: 'Inventory' },
        { title: 'Understanding approval workflows', category: 'Process' }
    ].filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.category.toLowerCase().includes(query.toLowerCase())
    );

    showNotification(`Found ${mockResults.length} help articles for "${query}"`, 'info');
}

function startLiveChat() {
    const chatModal = document.createElement('div');
    chatModal.className = 'chat-modal';
    chatModal.innerHTML = `
        <div class="chat-window">
            <div class="chat-header">
                <h4>Live Support Chat</h4>
                <button class="close-chat">×</button>
            </div>
            <div class="chat-messages">
                <div class="message support">
                    <strong>Support Agent:</strong> Hello! How can I help you today?
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." id="chatInput">
                <button class="send-message">Send</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatModal);
    
    chatModal.querySelector('.close-chat').addEventListener('click', () => {
        document.body.removeChild(chatModal);
    });
    
    const chatInput = chatModal.querySelector('#chatInput');
    const sendBtn = chatModal.querySelector('.send-message');
    const messagesContainer = chatModal.querySelector('.chat-messages');
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            messagesContainer.innerHTML += `
                <div class="message user">
                    <strong>You:</strong> ${message}
                </div>
            `;
            chatInput.value = '';
            
            // Simulate response
            setTimeout(() => {
                messagesContainer.innerHTML += `
                    <div class="message support">
                        <strong>Support Agent:</strong> Thank you for your message. Let me help you with that.
                    </div>
                `;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000);
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function showCategoryHelp(categoryName) {
    showNotification(`Opening help for ${categoryName}`, 'info');
    // In a real implementation, this would navigate to specific help content
}

// Utility Functions
function showLoading() {
    let spinner = document.querySelector('.loading-spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-overlay">
                <div class="spinner"></div>
                <p>Processing...</p>
            </div>
        `;
        document.body.appendChild(spinner);
    }
    spinner.style.display = 'flex';
}

function hideLoading() {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ';
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">×</button>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6',
        color: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '3000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        maxWidth: '400px',
        minWidth: '300px',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notifications and modals
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-icon {
        font-weight: bold;
        font-size: 16px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .loading-spinner {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 4000;
    }
    
    .spinner-overlay {
        background: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f4f6;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .quick-view-modal, .add-asset-modal, .schedule-modal, .chat-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
    }
    
    .quick-view-content, .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .quick-view-header, .modal-header {
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .close-quick-view, .close-modal {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
    }
    
    .quick-view-body {
        padding: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .product-specs ul {
        list-style: none;
        padding: 0;
    }
    
    .product-specs li {
        padding: 8px 0;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .quick-view-actions {
        display: flex;
        gap: 12px;
        margin-top: 20px;
    }
    
    .chat-window {
        background: white;
        border-radius: 12px;
        width: 400px;
        height: 500px;
        display: flex;
        flex-direction: column;
    }
    
    .chat-header {
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f9fafb;
        border-radius: 12px 12px 0 0;
    }
    
    .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
    }
    
    .message {
        margin-bottom: 12px;
        padding: 8px 12px;
        border-radius: 8px;
    }
    
    .message.user {
        background: #dbeafe;
        margin-left: 20px;
    }
    
    .message.support {
        background: #f3f4f6;
        margin-right: 20px;
    }
    
    .chat-input {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
    }
    
    .chat-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
    }
    
    .send-message {
        padding: 8px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
    }
    
    .quantity-controls button {
        width: 24px;
        height: 24px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .quantity-controls span {
        min-width: 20px;
        text-align: center;
    }
    
    .uploaded-file {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f9fafb;
        border-radius: 6px;
        margin-bottom: 8px;
    }
    
    .file-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .file-name {
        font-weight: 500;
    }
    
    .file-size {
        font-size: 12px;
        color: #6b7280;
    }
    
    .remove-file {
        background: none;
        border: none;
        color: #ef4444;
        cursor: pointer;
        font-size: 18px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }
    
    .remove-file:hover {
        background: #fee2e2;
    }
`;
document.head.appendChild(style);

// Handle page-specific functionality
function initializePageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'confirmation.html':
            initializeConfirmation();
            break;
    }
}

function initializeConfirmation() {
    // Load order data
    const orderNumber = localStorage.getItem('orderNumber');
    const orderDate = localStorage.getItem('orderDate');
    
    if (orderNumber) {
        const orderNumberElements = document.querySelectorAll('.order-number, [data-order-number]');
        orderNumberElements.forEach(el => {
            el.textContent = orderNumber;
        });
    }
    
    if (orderDate) {
        const orderDateElements = document.querySelectorAll('.order-date, [data-order-date]');
        orderDateElements.forEach(el => {
            el.textContent = orderDate;
        });
    }
    
    // Print and email buttons
    const printBtn = document.getElementById('printOrder');
    const emailBtn = document.getElementById('emailOrder');
    
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            showNotification('Order confirmation sent to your email!', 'success');
        });
    }
}

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', initializePageSpecific);

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        closeSearch();
        closeCart();
        
        // Close any open modals
        const modals = document.querySelectorAll('.quick-view-modal, .add-asset-modal, .schedule-modal, .chat-modal');
        modals.forEach(modal => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Ctrl/Cmd + K opens search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchBtn) searchBtn.click();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        if (navLinks) navLinks.classList.remove('active');
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Auto-save form data
function autoSaveFormData() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const formId = form.id || 'default';
                const savedData = JSON.parse(localStorage.getItem(`formData_${formId}`)) || {};
                savedData[this.name] = this.value;
                localStorage.setItem(`formData_${formId}`, JSON.stringify(savedData));
            });
        });
    });
}

// Load saved form data
function loadSavedFormData() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const formId = form.id || 'default';
        const savedData = JSON.parse(localStorage.getItem(`formData_${formId}`)) || {};
        
        Object.keys(savedData).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && savedData[fieldName]) {
                field.value = savedData[fieldName];
            }
        });
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', function() {
    autoSaveFormData();
    loadSavedFormData();
});