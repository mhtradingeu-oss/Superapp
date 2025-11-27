/**
 * HAIROTICMEN Partner Dashboard
 * Modern JavaScript Application
 * Version: 2.0.0
 */

class HAIROTICMENDashboard {
  constructor() {
    this.currentSection = 'overview';
    this.currentLanguage = 'de';
    this.currentTheme = 'light';
    this.charts = {};
    this.notifications = [];
    this.isLoaded = false;

    // Translations
    this.translations = {
      de: {
        dashboard: 'Dashboard Übersicht',
        orders: 'Bestellungen',
        loyalty: 'Punkte & Belohnungen',
        partnership: 'Vertrieb & Partner',
        affiliate: 'Affiliate-Programm',
        reports: 'Berichte & Analysen',
        marketing: 'Marketing & Angebote',
        messages: 'Nachrichten',
        documents: 'Dokumente',
        settings: 'Konto & Einstellungen'
      },
      en: {
        dashboard: 'Dashboard Overview',
        orders: 'Orders',
        loyalty: 'Points & Rewards',
        partnership: 'Sales & Partners',
        affiliate: 'Affiliate Program',
        reports: 'Reports & Analytics',
        marketing: 'Marketing & Offers',
        messages: 'Messages',
        documents: 'Documents',
        settings: 'Account & Settings'
      },
      ar: {
        dashboard: 'لوحة التحكم',
        orders: 'الطلبات',
        loyalty: 'النقاط والمكافآت',
        partnership: 'المبيعات والشركاء',
        affiliate: 'برنامج التسويق بالعمولة',
        reports: 'التقارير والتحليلات',
        marketing: 'التسويق والعروض',
        messages: 'الرسائل',
        documents: 'المستندات',
        settings: 'الحساب والإعدادات'
      }
    };

    this.init();
  }

  async init() {
    console.log('🚀 Initializing HAIROTICMEN Dashboard...');

    try {
      // Show loading screen
      this.showLoadingScreen();

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
      } else {
        this.onDOMReady();
      }
    } catch (error) {
      console.error('❌ Dashboard initialization failed:', error);
      this.showErrorToast('Initialization Error', 'Failed to load dashboard');
    }
  }

  async onDOMReady() {
    console.log('📚 DOM Ready - Setting up dashboard...');

    try {
      // Setup core functionality
      this.setupEventListeners();
      this.setupNavigation();
      this.setupMobileMenu();
      this.setupTheme();
      this.setupLanguage();
      this.setupTooltips();

      // Initialize default section
      await this.loadSection('overview');

      // Setup charts
      await this.initializeCharts();

      // Load user data
      await this.loadUserData();

      // Hide loading screen
      setTimeout(() => {
        this.hideLoadingScreen();
        this.isLoaded = true;
        console.log('✅ Dashboard loaded successfully');
      }, 1500);

    } catch (error) {
      console.error('❌ Setup failed:', error);
      this.hideLoadingScreen();
      this.showErrorToast('Setup Error', 'Dashboard setup failed');
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const dashboardContainer = document.querySelector('.dashboard-container');

    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }

    if (dashboardContainer) {
      dashboardContainer.classList.add('loaded');
    }
  }

  setupEventListeners() {
    console.log('🔧 Setting up event listeners...');

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Quick actions
    document.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-action]');
      if (actionBtn) {
        e.preventDefault();
        this.handleQuickAction(actionBtn.dataset.action);
      }
    });

    // Language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        this.changeLanguage(e.target.value);
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-profile-dropdown')) {
        document.querySelectorAll('.profile-dropdown').forEach(dropdown => {
          dropdown.style.display = 'none';
        });
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  setupNavigation() {
    console.log('🧭 Setting up navigation...');

    // Main navigation links
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToSection(link.dataset.section);
      });
    });

    // Submenu toggles
    document.querySelectorAll('.has-submenu > .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!link.dataset.section) {
          e.preventDefault();
          this.toggleSubmenu(link.closest('.has-submenu'));
        }
      });
    });

    // Quick action cards
    document.querySelectorAll('.quick-action-card[data-section]').forEach(card => {
      card.addEventListener('click', () => {
        this.navigateToSection(card.dataset.section);
      });
    });
  }

  setupMobileMenu() {
    console.log('📱 Setting up mobile menu...');

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      const sidebar = document.getElementById('sidebar');
      const mobileToggle = document.getElementById('mobile-menu-toggle');

      if (window.innerWidth <= 768 && 
          sidebar && sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }

  setupTheme() {
    console.log('🎨 Setting up theme...');

    // Load saved theme
    const savedTheme = localStorage.getItem('hairoticmen-theme') || 'light';
    this.applyTheme(savedTheme);
  }

  setupLanguage() {
    console.log('🌐 Setting up language...');

    // Load saved language
    const savedLanguage = localStorage.getItem('hairoticmen-language') || 'de';
    this.changeLanguage(savedLanguage);
  }

  setupTooltips() {
    console.log('💡 Setting up tooltips...');

    // Initialize tooltips if Tippy.js is available
    if (typeof tippy !== 'undefined') {
      tippy('[title]', {
        theme: 'dark',
        arrow: true,
        delay: [500, 0]
      });
    }
  }

  async navigateToSection(sectionId) {
    console.log(`📍 Navigating to section: ${sectionId}`);

    try {
      // Update navigation state
      this.updateActiveNavigation(sectionId);

      // Load section content
      await this.loadSection(sectionId);

      // Update breadcrumb
      this.updateBreadcrumb(sectionId);

      // Close mobile menu if open
      this.closeMobileMenu();

      // Update current section
      this.currentSection = sectionId;

      console.log(`✅ Successfully navigated to: ${sectionId}`);
    } catch (error) {
      console.error(`❌ Navigation failed for section: ${sectionId}`, error);
      this.showErrorToast('Navigation Error', `Failed to load ${sectionId}`);
    }
  }

  updateActiveNavigation(sectionId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to current section
    const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');

      // Open parent submenu if needed
      const parentSubmenu = activeLink.closest('.has-submenu');
      if (parentSubmenu) {
        parentSubmenu.classList.add('open');
      }
    }
  }

  async loadSection(sectionId) {
    console.log(`📄 Loading section: ${sectionId}`);

    try {
      // Hide all sections
      document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
      });

      // Show target section
      let targetSection = document.getElementById(sectionId);

      if (targetSection) {
        targetSection.classList.add('active');
      } else {
        // Create section dynamically if it doesn't exist
        targetSection = await this.createDynamicSection(sectionId);
      }

      // Initialize section-specific functionality
      await this.initializeSection(sectionId);

      console.log(`✅ Section loaded: ${sectionId}`);
    } catch (error) {
      console.error(`❌ Failed to load section: ${sectionId}`, error);
      throw error;
    }
  }

  async createDynamicSection(sectionId) {
    console.log(`🏗️ Creating dynamic section: ${sectionId}`);

    const dynamicSections = document.getElementById('dynamic-sections');
    if (!dynamicSections) {
      throw new Error('Dynamic sections container not found');
    }

    const section = document.createElement('section');
    section.id = sectionId;
    section.className = 'dashboard-section active';

    // Get section content based on section ID
    const content = await this.getSectionContent(sectionId);
    section.innerHTML = content;

    dynamicSections.appendChild(section);
    return section;
  }

  async getSectionContent(sectionId) {
    // This would typically fetch content from an API
    // For now, return placeholder content
    const sectionTitles = {
      'order-overview': 'Bestellübersicht',
      'new-order': 'Neue Bestellung',
      'reorder': 'Nachbestellungen',
      'order-tracking': 'Versandverfolgung',
      'scheduled-orders': 'Geplante Bestellungen',
      'points-balance': 'Punktestand',
      'activity-log': 'Aktivitätsprotokoll',
      'rewards-store': 'Geschenke & Prämien',
      'challenges': 'Herausforderungen',
      'levels-badges': 'Levels & Badges',
      'dealers': 'Händler',
      'stand-partners': 'Stand-Partner',
      'sales-reps': 'Verkaufsvertreter',
      'authorized-shops': 'Autorisierte Shops',
      'referral-links': 'Empfehlungslinks',
      'commission-stats': 'Provisionsstatistik',
      'payout-history': 'Auszahlungshistorie',
      'marketing-materials': 'Marketingmaterialien',
      'sales-analytics': 'Umsatzstatistik',
      'performance-reports': 'Performance Berichte',
      'product-analytics': 'Produktanalysen',
      'goal-tracking': 'Zielverfolgung',
      'coupons': 'Coupons & Rabatte',
      'campaigns': 'Aktuelle Kampagnen',
      'download-center': 'Download-Bereich',
      'social-sharing': 'Social Media Teilen',
      'messages': 'Nachrichten-Center',
      'notifications': 'Systembenachrichtigungen',
      'alerts': 'Warnungen & Hinweise',
      'quote-requests': 'Angebotsanforderung',
      'wholesale-forms': 'Großhandelsformular',
      'contracts': 'Verträge & Vereinbarungen',
      'invoices': 'Rechnungen & Belege',
      'profile': 'Profil verwalten',
      'addresses': 'Adressen & Versand',
      'preferences': 'Sprache & Präferenzen',
      'security': 'Sicherheit'
    };

    const title = sectionTitles[sectionId] || 'Bereich';

    return `
      <div class="section-header">
        <h1>${title}</h1>
        <p>Dieser Bereich wird gerade entwickelt und bald verfügbar sein.</p>
      </div>

      <div class="coming-soon-card">
        <div class="coming-soon-content">
          <i class="fas fa-tools"></i>
          <h3>In Entwicklung</h3>
          <p>Wir arbeiten hart daran, Ihnen die beste Erfahrung zu bieten. Diese Funktion wird bald verfügbar sein.</p>
          <button class="btn primary" onclick="dashboard.navigateToSection('overview')">
            <i class="fas fa-arrow-left"></i>
            Zurück zur Übersicht
          </button>
        </div>
      </div>

      <style>
        .coming-soon-card {
          background: var(--accent-white);
          border-radius: var(--radius-xl);
          padding: var(--spacing-2xl);
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--gray-200);
          max-width: 500px;
          margin: 2rem auto;
        }

        .coming-soon-content i {
          font-size: 3rem;
          color: var(--primary-gold);
          margin-bottom: var(--spacing-lg);
        }

        .coming-soon-content h3 {
          font-size: var(--font-size-xl);
          color: var(--gray-900);
          margin-bottom: var(--spacing-md);
        }

        .coming-soon-content p {
          color: var(--gray-600);
          margin-bottom: var(--spacing-xl);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-decoration: none;
        }

        .btn.primary {
          background: var(--primary-gold);
          color: var(--primary-black);
        }

        .btn.primary:hover {
          background: var(--dark-gold);
          transform: translateY(-1px);
        }
      </style>
    `;
  }

  async initializeSection(sectionId) {
    console.log(`⚙️ Initializing section: ${sectionId}`);

    switch (sectionId) {
      case 'overview':
        await this.initializeDashboardOverview();
        break;
      case 'orders':
        await this.initializeOrdersSection();
        break;
      case 'loyalty':
        await this.initializeLoyaltySection();
        break;
      default:
        console.log(`ℹ️ No specific initialization for section: ${sectionId}`);
    }
  }

  async initializeDashboardOverview() {
    console.log('📊 Initializing dashboard overview...');

    // This is where you would load real data
    // For now, we'll simulate data loading
    await this.simulateDataLoading();
  }

  async initializeOrdersSection() {
    console.log('📦 Initializing orders section...');
    // Initialize DataTables, load order data, etc.
  }

  async initializeLoyaltySection() {
    console.log('⭐ Initializing loyalty section...');
    // Load points, badges, rewards data
  }

  async initializeCharts() {
    console.log('📈 Initializing charts...');

    if (typeof ApexCharts === 'undefined') {
      console.warn('⚠️ ApexCharts not loaded, skipping chart initialization');
      return;
    }

    try {
      // Sales Chart
      await this.createSalesChart();

      // Products Chart
      await this.createProductsChart();

      console.log('✅ Charts initialized successfully');
    } catch (error) {
      console.error('❌ Chart initialization failed:', error);
    }
  }

  async createSalesChart() {
    const chartElement = document.getElementById('sales-chart');
    if (!chartElement) return;

    const options = {
      series: [{
        name: 'Umsatz',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 125, 142, 156, 180]
      }],
      chart: {
        height: 300,
        type: 'area',
        toolbar: { show: false },
        fontFamily: 'inherit'
      },
      colors: ['#D4AF37'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return '€' + val + 'k';
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          stops: [0, 90, 100],
          colorStops: [{
            offset: 0,
            color: '#D4AF37',
            opacity: 0.3
          }, {
            offset: 100,
            color: '#D4AF37',
            opacity: 0
          }]
        }
      },
      grid: {
        borderColor: '#f0f0f0',
        strokeDashArray: 5
      }
    };

    this.charts.salesChart = new ApexCharts(chartElement, options);
    await this.charts.salesChart.render();
  }

  async createProductsChart() {
    const chartElement = document.getElementById('products-chart');
    if (!chartElement) return;

    const options = {
      series: [44, 55, 41, 17],
      chart: {
        type: 'donut',
        height: 300
      },
      labels: ['Shampoo', 'Conditioner', 'Styling', 'Tools'],
      colors: ['#D4AF37', '#B8941F', '#F4E87C', '#6b7280'],
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Math.round(val) + '%';
        }
      }
    };

    this.charts.productsChart = new ApexCharts(chartElement, options);
    await this.charts.productsChart.render();
  }

  toggleSubmenu(submenuItem) {
    submenuItem.classList.toggle('open');
  }

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
  }

  toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
  }

  closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
  }

  updateBreadcrumb(sectionId) {
    const breadcrumbTitle = document.getElementById('current-section-title');
    if (breadcrumbTitle) {
      const sectionTitles = {
        'overview': 'Dashboard Übersicht',
        'order-overview': 'Bestellübersicht',
        'new-order': 'Neue Bestellung',
        'points-balance': 'Punktestand',
        'profile': 'Profil verwalten'
        // Add more as needed
      };

      breadcrumbTitle.textContent = sectionTitles[sectionId] || 'Bereich';
    }
  }

  handleQuickAction(action) {
    console.log(`🔥 Quick action: ${action}`);

    switch (action) {
      case 'theme-toggle':
        this.toggleTheme();
        break;
      case 'language-toggle':
        this.cycleLanguage();
        break;
      case 'support':
        this.openSupportModal();
        break;
      case 'logout':
        this.handleLogout();
        break;
      case 'show-notifications':
        this.showNotificationsPanel();
        break;
      default:
        console.log(`Unknown quick action: ${action}`);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('hairoticmen-theme', theme);

    // Update theme toggle icon
    const themeToggleBtn = document.querySelector('[data-action="theme-toggle"] i');
    if (themeToggleBtn) {
      themeToggleBtn.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    this.showSuccessToast('Theme geändert', `${theme === 'dark' ? 'Dunkles' : 'Helles'} Theme aktiviert`);
  }

  cycleLanguage() {
    const languages = ['de', 'en', 'ar'];
    const currentIndex = languages.indexOf(this.currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    this.changeLanguage(languages[nextIndex]);
  }

  changeLanguage(language) {
    this.currentLanguage = language;
    localStorage.setItem('hairoticmen-language', language);

    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = language;
    }

    // Apply RTL for Arabic
    if (language === 'ar') {
      document.body.setAttribute('dir', 'rtl');
    } else {
      document.body.setAttribute('dir', 'ltr');
    }

    // Here you would typically update all text content
    // For now, just show a notification
    const languageNames = { de: 'Deutsch', en: 'English', ar: 'العربية' };
    this.showInfoToast('Sprache geändert', `Sprache auf ${languageNames[language]} geändert`);
  }

  openSupportModal() {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Support kontaktieren',
        html: `
          <div style="text-align: left;">
            <p><strong>Email:</strong> support@hairoticmen.com</p>
            <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
            <p><strong>Geschäftszeiten:</strong> Mo-Fr 9:00-18:00</p>
            <hr>
            <p>Oder nutzen Sie unser <a href="#" target="_blank">Kontaktformular</a></p>
          </div>
        `,
        icon: 'info',
        confirmButtonColor: '#D4AF37',
        confirmButtonText: 'Verstanden'
      });
    } else {
      this.showInfoToast('Support', 'Email: support@hairoticmen.com');
    }
  }

  handleLogout() {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Abmelden',
        text: 'Möchten Sie sich wirklich abmelden?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ja, abmelden',
        cancelButtonText: 'Abbrechen'
      }).then((result) => {
        if (result.isConfirmed) {
          this.performLogout();
        }
      });
    } else {
      if (confirm('Möchten Sie sich wirklich abmelden?')) {
        this.performLogout();
      }
    }
  }

  performLogout() {
    // Clear local storage
    localStorage.removeItem('hairoticmen-auth-token');

    // Show success message
    this.showSuccessToast('Abgemeldet', 'Sie wurden erfolgreich abgemeldet');

    // Redirect to login page (simulate)
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  showNotificationsPanel() {
    // This would typically show a notifications panel
    this.showInfoToast('Benachrichtigungen', 'Sie haben 3 neue Benachrichtigungen');
  }

  handleResize() {
    // Handle responsive behavior
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }

    // Redraw charts if they exist
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.updateOptions) {
        chart.updateOptions({});
      }
    });
  }

  async loadUserData() {
    console.log('👤 Loading user data...');
    // This would typically fetch user data from an API
    await this.simulateDataLoading(500);
  }

  async simulateDataLoading(delay = 1000) {
    return new Promise(resolve => {
      setTimeout(resolve, delay);
    });
  }

  // Toast Notification System
  showToast(title, message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast ${type}`;

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
      <div class="toast-content">
        <i class="toast-icon ${icons[type] || icons.info}"></i>
        <div class="toast-text">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="dashboard.closeToast('${toastId}')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => this.closeToast(toastId), duration);
  }

  closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }
  }

  showSuccessToast(title, message) {
    this.showToast(title, message, 'success');
  }

  showErrorToast(title, message) {
    this.showToast(title, message, 'error');
  }

  showWarningToast(title, message) {
    this.showToast(title, message, 'warning');
  }

  showInfoToast(title, message) {
    this.showToast(title, message, 'info');
  }
}

// Initialize dashboard when DOM is ready
const dashboard = new HAIROTICMENDashboard();

// Make dashboard globally available for debugging
window.dashboard = dashboard;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HAIROTICMENDashboard;
}