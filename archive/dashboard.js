
/**
 * HAIROTICMEN Partner Dashboard - Clean Unified JavaScript
 * Professional, scalable, and modular code structure
 */

class HairoticmenDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.mobileBreakpoint = 768;
        this.charts = {};
        
        this.init();
    }

    /**
     * Initialize the dashboard
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.handleResponsiveLayout();
        this.loadLastActiveTab();
        this.initializeCharts();
        this.initializeLucideIcons();
        
        console.log('🎯 HAIROTICMEN Partner Dashboard initialized');
    }

    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        // Navigation
        this.navigationLinks = document.querySelectorAll('.nav-link[data-section]');
        this.contentSections = document.querySelectorAll('.content-section[data-section]');
        this.pageTitle = document.querySelector('.page-title');
        
        // Layout elements
        this.sidebar = document.querySelector('.sidebar');
        this.mobileOverlay = document.querySelector('.mobile-overlay');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.sidebarClose = document.querySelector('.sidebar-close');
        
        // Profile dropdown
        this.profileBtn = document.querySelector('.profile-btn');
        this.profileDropdown = document.querySelector('.profile-dropdown');
        
        // Language switcher
        this.langBtns = document.querySelectorAll('.lang-btn');
        
        console.log('📦 DOM elements cached');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Navigation
        this.navigationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Mobile menu
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (this.sidebarClose) {
            this.sidebarClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Profile dropdown
        if (this.profileBtn) {
            this.profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleProfileDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeProfileDropdown();
        });

        // Language switcher
        this.langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchLanguage(btn.getAttribute('data-lang'));
            });
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResponsiveLayout();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        console.log('🔗 Event listeners bound');
    }

    /**
     * Initialize Lucide icons
     */
    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('✨ Lucide icons initialized');
        }
    }

    /**
     * Navigate to a specific section
     */
    navigateToSection(sectionId) {
        if (!sectionId || sectionId === this.currentSection) {
            return;
        }

        // Validate section exists
        const targetSection = document.querySelector(`.content-section[data-section="${sectionId}"]`);
        if (!targetSection) {
            console.warn(`Section "${sectionId}" not found`);
            return;
        }

        // Update navigation state
        this.updateNavigationState(sectionId);
        
        // Update content visibility
        this.updateContentVisibility(sectionId);
        
        // Update page title
        this.updatePageTitle(sectionId);
        
        // Save to localStorage
        this.saveActiveTab(sectionId);
        
        // Update current section
        this.currentSection = sectionId;
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        console.log(`📍 Navigated to section: ${sectionId}`);
    }

    /**
     * Update navigation active states
     */
    updateNavigationState(sectionId) {
        this.navigationLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Update content section visibility
     */
    updateContentVisibility(sectionId) {
        this.contentSections.forEach(section => {
            const contentSection = section.getAttribute('data-section');
            if (contentSection === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    /**
     * Update page title based on section
     */
    updatePageTitle(sectionId) {
        if (!this.pageTitle) return;
        
        const titleMap = {
            dashboard: 'Dashboard',
            orders: 'Orders',
            products: 'Products',
            reports: 'Reports',
            settings: 'Settings'
        };
        
        const newTitle = titleMap[sectionId] || 'Dashboard';
        this.pageTitle.textContent = newTitle;
    }

    /**
     * Save active tab to localStorage
     */
    saveActiveTab(sectionId) {
        try {
            localStorage.setItem('hairoticmen_active_tab', sectionId);
        } catch (e) {
            console.warn('Could not save active tab to localStorage:', e);
        }
    }

    /**
     * Load last active tab from localStorage
     */
    loadLastActiveTab() {
        try {
            const savedTab = localStorage.getItem('hairoticmen_active_tab');
            if (savedTab && document.querySelector(`.content-section[data-section="${savedTab}"]`)) {
                this.navigateToSection(savedTab);
                return;
            }
        } catch (e) {
            console.warn('Could not load active tab from localStorage:', e);
        }
        
        // Default to dashboard
        this.navigateToSection('dashboard');
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.sidebar && this.mobileOverlay) {
            const isOpen = this.sidebar.classList.contains('open');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        if (this.sidebar && this.mobileOverlay) {
            this.sidebar.classList.add('open');
            this.mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        if (this.sidebar && this.mobileOverlay) {
            this.sidebar.classList.remove('open');
            this.mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Toggle profile dropdown
     */
    toggleProfileDropdown() {
        if (this.profileBtn && this.profileDropdown) {
            const isOpen = this.profileDropdown.classList.contains('open');
            
            if (isOpen) {
                this.closeProfileDropdown();
            } else {
                this.openProfileDropdown();
            }
        }
    }

    /**
     * Open profile dropdown
     */
    openProfileDropdown() {
        if (this.profileBtn && this.profileDropdown) {
            this.profileBtn.classList.add('open');
            this.profileDropdown.classList.add('open');
        }
    }

    /**
     * Close profile dropdown
     */
    closeProfileDropdown() {
        if (this.profileBtn && this.profileDropdown) {
            this.profileBtn.classList.remove('open');
            this.profileDropdown.classList.remove('open');
        }
    }

    /**
     * Switch language
     */
    switchLanguage(lang) {
        this.langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Save to localStorage
        try {
            localStorage.setItem('hairoticmen_language', lang);
        } catch (e) {
            console.warn('Could not save language to localStorage:', e);
        }
        
        console.log(`🌐 Language switched to: ${lang}`);
    }

    /**
     * Handle responsive layout changes
     */
    handleResponsiveLayout() {
        const isMobile = window.innerWidth <= this.mobileBreakpoint;
        
        if (isMobile) {
            this.closeMobileMenu();
        }
        
        // Refresh charts on resize
        this.refreshCharts();
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyboardNavigation(e) {
        // ESC key to close mobile menu and dropdowns
        if (e.key === 'Escape') {
            this.closeMobileMenu();
            this.closeProfileDropdown();
        }
    }

    /**
     * Initialize charts
     */
    initializeCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, skipping chart initialization');
            return;
        }

        // Initialize sales chart
        this.initSalesChart();
        
        // Initialize orders chart
        this.initOrdersChart();
        
        console.log('📊 Charts initialized');
    }

    /**
     * Initialize sales chart
     */
    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Monthly Sales',
                    data: [18500, 22300, 19800, 24500, 21200, 24580],
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#d4af37',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: '#f1f5f9'
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + (value / 1000) + 'k';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    /**
     * Initialize orders chart
     */
    initOrdersChart() {
        const ctx = document.getElementById('ordersChart');
        if (!ctx) return;

        this.charts.orders = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Shipping', 'Processing', 'Pending'],
                datasets: [{
                    data: [65, 20, 10, 5],
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    /**
     * Refresh all charts
     */
    refreshCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    /**
     * Destroy all charts
     */
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }

    /**
     * Get current section
     */
    getCurrentSection() {
        return this.currentSection;
    }

    /**
     * Check if section exists
     */
    sectionExists(sectionId) {
        return Boolean(document.querySelector(`.content-section[data-section="${sectionId}"]`));
    }

    /**
     * Get all available sections
     */
    getAllSections() {
        return Array.from(this.navigationLinks).map(link => 
            link.getAttribute('data-section')
        );
    }
}

/**
 * Utility functions
 */
class DashboardUtils {
    /**
     * Format currency for display
     */
    static formatCurrency(amount, currency = 'EUR') {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    /**
     * Format date for display
     */
    static formatDate(date) {
        const dateObj = new Date(date);
        return new Intl.DateTimeFormat('de-DE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(dateObj);
    }

    /**
     * Debounce function calls
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Show loading state
     */
    static showLoading(element) {
        if (element) {
            element.classList.add('loading');
            element.setAttribute('aria-busy', 'true');
        }
    }

    /**
     * Hide loading state
     */
    static hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
            element.setAttribute('aria-busy', 'false');
        }
    }

    /**
     * Show notification
     */
    static showNotification(message, type = 'info') {
        // Simple notification implementation
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            info: '#3b82f6',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

/**
 * Initialize dashboard when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main dashboard
    window.dashboard = new HairoticmenDashboard();
    
    // Make utilities available globally
    window.DashboardUtils = DashboardUtils;
    
    // Development mode helpers
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('repl')) {
        console.log('🔧 Development mode: Dashboard API available as window.dashboard');
        console.log('🛠️ Available methods:', Object.getOwnPropertyNames(HairoticmenDashboard.prototype));
    }
});

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('👁️ Dashboard hidden');
    } else {
        console.log('👁️ Dashboard visible');
        // Refresh charts when page becomes visible
        if (window.dashboard) {
            window.dashboard.refreshCharts();
        }
    }
});

/**
 * Clean up before page unload
 */
window.addEventListener('beforeunload', () => {
    if (window.dashboard && typeof window.dashboard.destroyCharts === 'function') {
        window.dashboard.destroyCharts();
    }
});

/**
 * Export for module systems (if needed)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HairoticmenDashboard, DashboardUtils };
}
