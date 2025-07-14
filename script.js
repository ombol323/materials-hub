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
let cartItems = [];
let cartCount = 0;

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
    updateCartDisplay();
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
    }

    // Suggestion tags
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = this.textContent;
                handleSearch();
            }
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
        // Simulate search results
        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h4>Search Results for "${query}"</h4>
                <div class="search-result-items">
                    <div class="search-result-item">
                        <strong>Dell OptiPlex 7090</strong>
                        <p>Desktop computer with Intel i7 processor</p>
                    </div>
                    <div class="search-result-item">
                        <strong>IoT Temperature Sensor</strong>
                        <p>Wireless sensor for environmental monitoring</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        searchResults.innerHTML = `
            <div class="search-suggestions">
                <h4>Popular Searches</h4>
                <div class="suggestion-tags">
                    <span class="suggestion-tag">Dell Laptops</span>
                    <span class="suggestion-tag">IoT Sensors</span>
                    <span class="suggestion-tag">Network Switches</span>
                    <span class="suggestion-tag">Workstations</span>
                </div>
            </div>
        `;
    }
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
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

function closeCart() {
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

function addToCart(productId) {
    cartCount++;
    updateCartDisplay();
    
    // Show success message
    showNotification('Item added to cart!', 'success');
    
    // Update cart content
    updateCartContent();
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
    
    if (cartCount === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛒</div>
                <p>Your cart is empty</p>
                <a href="catalog.html" class="btn btn-primary">Browse Catalog</a>
            </div>
        `;
    } else {
        cartContent.innerHTML = `
            <div class="cart-items">
                <div class="cart-item">
                    <img src="https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop" alt="Product">
                    <div class="cart-item-details">
                        <h4>Dell OptiPlex 7090</h4>
                        <p>$1,299</p>
                    </div>
                    <button class="remove-item">×</button>
                </div>
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Total: $${(cartCount * 1299).toLocaleString()}</strong>
                </div>
                <button class="btn btn-primary btn-full">Proceed to Checkout</button>
            </div>
        `;
    }
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
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading();
        showNotification('Procurement request submitted successfully!', 'success');
        e.target.reset();
    }, 2000);
}

function handleSupportSubmit(e) {
    e.preventDefault();
    
    showLoading();
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading();
        showNotification('Support request submitted successfully!', 'success');
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
            <span>${file.name}</span>
            <span>${(file.size / 1024 / 1024).toFixed(2)} MB</span>
        `;
        uploadedFiles.appendChild(fileItem);
    });
}

// Catalog
function initializeCatalog() {
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

    if (addAssetBtn) addAssetBtn.addEventListener('click', () => showNotification('Add Asset dialog would open here', 'info'));
    if (bulkUpdateBtn) bulkUpdateBtn.addEventListener('click', () => showNotification('Bulk Update dialog would open here', 'info'));
    if (exportBtn) exportBtn.addEventListener('click', () => showNotification('Exporting inventory data...', 'info'));
    if (generateReportBtn) generateReportBtn.addEventListener('click', () => showNotification('Generating report...', 'info'));
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
        exportReport.addEventListener('click', () => {
            showNotification('Exporting analytics report...', 'info');
        });
    }

    if (scheduleReport) {
        scheduleReport.addEventListener('click', () => {
            showNotification('Schedule Report dialog would open here', 'info');
        });
    }

    // Chart filters
    const chartFilters = document.querySelectorAll('.chart-filter, .analysis-filter, .products-filter');
    chartFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            updateChartData(this.value);
        });
    });
}

function updateAnalyticsData(timeRange) {
    showNotification(`Analytics updated for ${timeRange}`, 'info');
    // Here you would typically fetch new data and update the charts
}

function updateChartData(filterValue) {
    showNotification(`Chart updated with filter: ${filterValue}`, 'info');
    // Here you would typically update the specific chart
}

// Support
function initializeSupport() {
    // FAQ toggles
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                item.classList.toggle('active');
            });
        }
    });

    // Help search
    const helpSearch = document.getElementById('helpSearch');
    if (helpSearch) {
        helpSearch.addEventListener('input', function() {
            // Simulate help search
            if (this.value.length > 2) {
                showNotification(`Searching for: ${this.value}`, 'info');
            }
        });
    }

    // Support action buttons
    const supportButtons = document.querySelectorAll('.support-card .btn');
    supportButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            showNotification(`${action} functionality would be implemented here`, 'info');
        });
    });
}

// Utility Functions
function showLoading() {
    // Create or show loading spinner
    let spinner = document.querySelector('.loading-spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
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
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">×</button>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '3000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
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

// Add CSS for notification animation
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
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Handle page-specific functionality
function initializePageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'catalog.html':
            // Initialize catalog-specific features
            break;
        case 'inventory.html':
            // Initialize inventory-specific features
            break;
        case 'procurement.html':
            // Initialize procurement-specific features
            break;
        case 'analytics.html':
            // Initialize analytics-specific features
            break;
        case 'support.html':
            // Initialize support-specific features
            break;
        default:
            // Initialize home page features
            break;
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

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}