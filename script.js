// ============================================
// GÜR RENT A CAR - ANA JAVASCRIPT DOSYASI
// GitHub Pages Uyumlu - GÜNCELLENMİŞ
// ============================================

// Konfigürasyon
const CONFIG = {
    WHATSAPP_NUMBER: '905449709712',
    INSTAGRAM_USERNAME: 'gurrentacar',
    COMPANY_NAME: 'Gür Rent A Car',
    COMPANY_ADDRESS: 'Külhan Mh. 2. İstasyon Cd. No:29/E Merkez/Karaman',
    ADMIN_PASSWORD: 'gur2023',
    STORAGE_PREFIX: 'gurRent_',
    MAP_EMBED_URL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3169.382693073944!2d33.214343315639!3d37.1817976798305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d9fd5c5d5d5d5d%3A0x5d5d5d5d5d5d5d5d!2sKaraman!5e0!3m2!1str!2str!4v1641234567890!5m2!1str!2str'
};

// Global değişkenler
let flatpickrLoaded = false;
let vehiclesData = [];
let testimonialSlider = null;
let autoScrollInterval = null;

// ===== DOM YÜKLENDİĞİNDE =====
document.addEventListener('DOMContentLoaded', function() {
    console.log(`${CONFIG.COMPANY_NAME} - Web sitesi yükleniyor...`);
    
    // GitHub Pages kontrolü
    if (window.location.hostname.includes('github.io')) {
        console.log('GitHub Pages ortamında çalışıyor: https://flux-gold.github.io/gur-rent-a-car/');
        // Admin panel linkini gösterme kontrolü
        const adminLinks = document.querySelectorAll('.admin-link');
        adminLinks.forEach(link => {
            link.href = 'https://flux-gold.github.io/gur-rent-a-car/admin.html';
        });
    }
    
    initializeApp();
});

// ===== UYGULAMA BAŞLATMA =====
function initializeApp() {
    // Mobil menüyü başlat
    initMobileMenu();
    
    // Tarih seçiciyi başlat
    initDatePickers();
    
    // LocalStorage'ı başlat
    initStorage();
    
    // Navigasyon bağlantılarını başlat
    initNavigation();
    
    // Araçları yükle
    loadVehicles();
    
    // Filtre butonlarını başlat
    initFilters();
    
    // Rezervasyon formunu başlat
    initBookingForm();
    
    // Testimonial slider'ı başlat
    initTestimonialSlider();
    
    // Haritayı yükle
    loadMap();
    
    // Scroll olaylarını başlat
    initScrollEvents();
    
    // Admin linkini gizle
    hideAdminLink();
    
    // WhatsApp butonunu güncelle
    updateWhatsAppButton();
    
    // Performans iyileştirmeleri
    initPerformance();
    
    // Konsola hoş geldin mesajı
    showWelcomeMessage();
}

// ===== MOBİL MENÜ =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (!mobileMenuBtn || !mainNav) return;
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mainNav.classList.toggle('active');
        const isActive = mainNav.classList.contains('active');
        this.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        document.body.style.overflow = isActive ? 'hidden' : 'auto';
        this.setAttribute('aria-expanded', isActive);
    });
    
    // Dışarı tıklayınca menüyü kapat
    document.addEventListener('click', function(e) {
        if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Esc tuşu ile menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        if (window.innerWidth <= 768) {
            mainNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

// ===== NAVİGASYON BAĞLANTILARI =====
function initNavigation() {
    // Ana navigasyon linkleri
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Mobil menüyü kapat
                closeMobileMenu();
                
                // Scroll
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Aktif link'i güncelle
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Footer navigasyon linkleri
    const footerLinks = document.querySelectorAll('.footer-nav-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== TARİH SEÇİCİ =====
function initDatePickers() {
    // Flatpickr kontrolü
    if (typeof flatpickr === 'undefined') {
        console.warn('Flatpickr kütüphanesi yüklenemedi');
        setupFallbackDateInputs();
        return;
    }
    
    try {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const pickupConfig = {
            locale: "tr",
            dateFormat: "d.m.Y",
            minDate: "today",
            defaultDate: today,
            disableMobile: false,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    const nextDay = new Date(selectedDates[0]);
                    nextDay.setDate(nextDay.getDate() + 1);
                    
                    if (returnPicker) {
                        returnPicker.set('minDate', nextDay);
                        
                        if (returnPicker.selectedDates[0] && returnPicker.selectedDates[0] < nextDay) {
                            returnPicker.setDate(nextDay);
                        }
                    }
                }
            }
        };
        
        const returnConfig = {
            locale: "tr",
            dateFormat: "d.m.Y",
            minDate: tomorrow,
            defaultDate: tomorrow,
            disableMobile: false
        };
        
        const pickupPicker = flatpickr("#pickup-date", pickupConfig);
        const returnPicker = flatpickr("#return-date", returnConfig);
        
        flatpickrLoaded = true;
        console.log('Tarih seçici başarıyla yüklendi');
        
    } catch (error) {
        console.error('Tarih seçici yüklenirken hata:', error);
        setupFallbackDateInputs();
    }
}

function setupFallbackDateInputs() {
    document.querySelectorAll('.datepicker').forEach(input => {
        input.type = 'text';
        input.pattern = '[0-9]{2}.[0-9]{2}.[0-9]{4}';
        input.title = 'GG.AA.YYYY formatında giriniz';
    });
}

// ===== LOCALSTORAGE BAŞLATMA =====
function initStorage() {
    const storageKey = CONFIG.STORAGE_PREFIX + 'vehicles_' + window.location.hostname;
    
    // Varsayılan araç verileri
    const defaultVehicles = [
        { 
            id: 1, 
            name: "Hyundai Accent Blue", 
            segment: "ekonomik", 
            transmission: "Otomatik", 
            fuel: "Benzin", 
            year: "2022", 
            available: true,
            features: ["Klima", "Bluetooth", "Park Sensörü", "USB"],
            image: "fa-car",
            price: 750
        },
        { 
            id: 2, 
            name: "Ford Fiesta", 
            segment: "ekonomik", 
            transmission: "Manuel", 
            fuel: "Benzin", 
            year: "2021", 
            available: true,
            features: ["Klima", "USB", "ABS"],
            image: "fa-car",
            price: 650
        },
        { 
            id: 3, 
            name: "Peugeot 301", 
            segment: "ekonomik", 
            transmission: "Manuel", 
            fuel: "Dizel", 
            year: "2021", 
            available: false,
            features: ["Klima", "Cruise Control", "Yol Bilgisayarı"],
            image: "fa-car",
            price: 700
        },
        { 
            id: 4, 
            name: "Citroen C-Elysee", 
            segment: "ekonomik", 
            transmission: "Otomatik", 
            fuel: "Benzin", 
            year: "2022", 
            available: true,
            features: ["Klima", "Android Auto", "Park Sensörü"],
            image: "fa-car",
            price: 800
        },
        { 
            id: 5, 
            name: "Fiat Egea", 
            segment: "orta", 
            transmission: "Otomatik", 
            fuel: "Dizel", 
            year: "2023", 
            available: true,
            features: ["Klima", "Yol Bilgisayarı", "Park Sensörü", "Start-Stop"],
            image: "fa-car-side",
            price: 950
        },
        { 
            id: 6, 
            name: "Renault Clio", 
            segment: "ekonomik", 
            transmission: "Otomatik", 
            fuel: "Benzin", 
            year: "2022", 
            available: true,
            features: ["Klima", "Bluetooth", "USB"],
            image: "fa-car",
            price: 780
        },
        { 
            id: 7, 
            name: "Toyota Corolla", 
            segment: "orta", 
            transmission: "Otomatik", 
            fuel: "Hibrit", 
            year: "2023", 
            available: true,
            features: ["Klima", "Apple CarPlay", "Kameralı Park", "Hız Sabitleyici"],
            image: "fa-car-side",
            price: 1200
        },
        { 
            id: 8, 
            name: "Volkswagen Polo", 
            segment: "ekonomik", 
            transmission: "Manuel", 
            fuel: "Benzin", 
            year: "2022", 
            available: false,
            features: ["Klima", "USB", "ABS", "ESP"],
            image: "fa-car",
            price: 700
        },
        { 
            id: 9, 
            name: "Opel Astra", 
            segment: "orta", 
            transmission: "Otomatik", 
            fuel: "Dizel", 
            year: "2022", 
            available: true,
            features: ["Klima", "Isıtmalı Koltuk", "Yol Bilgisayarı"],
            image: "fa-car-side",
            price: 1050
        },
        { 
            id: 10, 
            name: "Hyundai i20", 
            segment: "ekonomik", 
            transmission: "Otomatik", 
            fuel: "Benzin", 
            year: "2023", 
            available: true,
            features: ["Klima", "Bluetooth", "Arkadan Kamera"],
            image: "fa-car",
            price: 850
        },
        { 
            id: 11, 
            name: "BMW 3.20", 
            segment: "lüks", 
            transmission: "Otomatik", 
            fuel: "Benzin", 
            year: "2022", 
            available: true,
            features: ["Klima", "Navigasyon", "Deri Koltuk", "Panoramik Tavan"],
            image: "fa-car",
            price: 2200
        },
        { 
            id: 12, 
            name: "Mercedes C200", 
            segment: "lüks", 
            transmission: "Otomatik", 
            fuel: "Dizel", 
            year: "2021", 
            available: false,
            features: ["Klima", "Panoramik Tavan", "Memory Koltuk", "Adaptive Cruise"],
            image: "fa-car",
            price: 2400
        },
        { 
            id: 13, 
            name: "Audi A3", 
            segment: "lüks", 
            transmission: "Otomatik", 
            fuel: "Benzin", 
            year: "2023", 
            available: true,
            features: ["Klima", "Virtual Cockpit", "LED Farlar", "Bang & Olufsen Ses"],
            image: "fa-car",
            price: 2300
        },
        { 
            id: 14, 
            name: "Volvo S60", 
            segment: "lüks", 
            transmission: "Otomatik", 
            fuel: "Dizel", 
            year: "2022", 
            available: true,
            features: ["Klima", "Pilot Assist", "Premium Ses", "Isıtmalı Direksiyon"],
            image: "fa-car",
            price: 2100
        },
        { 
            id: 15, 
            name: "Skoda Octavia", 
            segment: "orta", 
            transmission: "Otomatik", 
            fuel: "Dizel", 
            year: "2023", 
            available: true,
            features: ["Klima", "Yol Bilgisayarı", "Park Sensörü", "Start-Stop"],
            image: "fa-car-side",
            price: 1100
        },
        { 
            id: 16, 
            name: "Honda Civic", 
            segment: "orta", 
            transmission: "Otomatik", 
            fuel: "Benzin", 
            year: "2022", 
            available: false,
            features: ["Klima", "Honda Sensing", "Lane Assist", "Adaptive Cruise"],
            image: "fa-car-side",
            price: 1150
        },
        { 
            id: 17, 
            name: "Nissan Qashqai", 
            segment: "orta", 
            transmission: "Otomatik", 
            fuel: "Dizel", 
            year: "2023", 
            available: true,
            features: ["Klima", "360 Kamera", "Otomatik Bagaj", "Yolculuk Bilgisayarı"],
            image: "fa-truck-pickup",
            price: 1300
        }
    ];
    
    // Varsayılan yorumlar
    const defaultTestimonials = [
        {
            id: 1,
            content: "Tıkır tıkır işleyen sistemleri var, Karaman'da araç kiralayacaksanız kesinlikle tavsiye ederim.",
            author: "Fatih P.",
            role: "İş Adamı",
            rating: 5,
            date: "15 Ara 2023"
        },
        {
            id: 2,
            content: "Aldığımız araç çok temiz ve bakımlıydı, fiyat performans açısından çok iyi. Tekrar tercih edeceğim.",
            author: "Salih K.",
            role: "Öğretmen",
            rating: 4.5,
            date: "10 Kas 2023"
        },
        {
            id: 3,
            content: "Firma çok ilgili ve profesyonel, biz tatil için kiraladık, herşey çok güzeldi, memnun kaldık.",
            author: "Melike A.",
            role: "Doktor",
            rating: 5,
            date: "5 Eki 2023"
        },
        {
            id: 4,
            content: "Karaman'a geldiğimde hep Gür Rent A Car'dan kiralıyorum. Hem uygun fiyatlı hem de araçları temiz.",
            author: "Ahmet Y.",
            role: "İş Seyahati",
            rating: 5,
            date: "20 Eyl 2023"
        },
        {
            id: 5,
            content: "7/24 destek hizmeti harika! Gece yarısı bir sorun olduğunda bile hemen çözüm buldular.",
            author: "Emre D.",
            role: "İş Seyahati",
            rating: 5,
            date: "15 Ağu 2023"
        },
        {
            id: 6,
            content: "Araçlar her zaman temiz ve bakımlı. Fiyatları da çok uygun. Karaman'da tek tercihim.",
            author: "Cemal T.",
            role: "Serbest Meslek",
            rating: 5,
            date: "10 Tem 2023"
        },
        {
            id: 7,
            content: "Havaalanı teslimi çok kolay oldu. Araç tam zamanında hazırdı ve çok temizdi.",
            author: "Seda M.",
            role: "Turist",
            rating: 4.5,
            date: "5 Haz 2023"
        },
        {
            id: 8,
            content: "Fiyatları çok uygun, araçları yeni ve temiz. Kesinlikle tavsiye ediyorum.",
            author: "Mustafa K.",
            role: "Öğrenci",
            rating: 5,
            date: "25 May 2023"
        }
    ];
    
    // Storage key'leri
    const vehiclesKey = CONFIG.STORAGE_PREFIX + 'vehicles_' + window.location.hostname;
    const testimonialsKey = CONFIG.STORAGE_PREFIX + 'testimonials';
    const bookingsKey = CONFIG.STORAGE_PREFIX + 'bookings';
    const statsKey = CONFIG.STORAGE_PREFIX + 'stats';
    
    // Araçları kontrol et ve yükle
    if (!localStorage.getItem(vehiclesKey)) {
        localStorage.setItem(vehiclesKey, JSON.stringify(defaultVehicles));
        console.log('Varsayılan araçlar yüklendi');
    }
    
    // Yorumları kontrol et ve yükle
    if (!localStorage.getItem(testimonialsKey)) {
        localStorage.setItem(testimonialsKey, JSON.stringify(defaultTestimonials));
        console.log('Varsayılan yorumlar yüklendi');
    }
    
    // Rezervasyonları kontrol et
    if (!localStorage.getItem(bookingsKey)) {
        localStorage.setItem(bookingsKey, JSON.stringify([]));
    }
    
    // İstatistikleri kontrol et
    if (!localStorage.getItem(statsKey)) {
        const stats = {
            totalBookings: 0,
            happyCustomers: 1000,
            averageRating: 4.8,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(statsKey, JSON.stringify(stats));
    }
}

// ===== ARAÇ YÜKLEME =====
function loadVehicles(filter = 'all') {
    const vehicleList = document.getElementById('vehicleList');
    const vehicleSelect = document.getElementById('vehicle-select');
    
    if (!vehicleList && !vehicleSelect) return;
    
    // Araçları LocalStorage'dan al
    const storageKey = CONFIG.STORAGE_PREFIX + 'vehicles_' + window.location.hostname;
    vehiclesData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (vehiclesData.length === 0) {
        showVehicleError();
        return;
    }
    
    // Filtrele
    let filteredVehicles = vehiclesData;
    if (filter !== 'all') {
        if (filter === 'available') {
            filteredVehicles = vehiclesData.filter(v => v.available);
        } else {
            filteredVehicles = vehiclesData.filter(v => v.segment === filter);
        }
    }
    
    // Araç listesini güncelle
    if (vehicleList) {
        updateVehicleList(vehicleList, filteredVehicles);
    }
    
    // Seçim kutusunu güncelle
    if (vehicleSelect) {
        updateVehicleSelect(vehicleSelect, vehiclesData);
    }
}

function updateVehicleList(container, vehicles) {
    container.innerHTML = '';
    
    if (vehicles.length === 0) {
        container.innerHTML = `
            <div class="no-vehicles" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-car" style="font-size: 60px; color: #999; margin-bottom: 20px;"></i>
                <h3 style="color: white; margin-bottom: 10px;">Bu kategoride araç bulunmamaktadır</h3>
                <p style="color: #999;">Lütfen başka bir kategori seçin veya daha sonra tekrar kontrol edin.</p>
            </div>
        `;
        return;
    }
    
    vehicles.forEach((vehicle, index) => {
        const vehicleCard = createVehicleCard(vehicle);
        vehicleCard.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(vehicleCard);
    });
}

function updateVehicleSelect(select, vehicles) {
    // Mevcut seçenekleri temizle (ilk seçeneği koru)
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    // Müsait araçları ekle
    const availableVehicles = vehicles.filter(v => v.available);
    availableVehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.name} (${vehicle.segment}) - ${vehicle.price} TL/gün`;
        select.appendChild(option);
    });
}

function showVehicleError() {
    const vehicleList = document.getElementById('vehicleList');
    if (vehicleList) {
        vehicleList.innerHTML = `
            <div class="vehicle-error" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 60px; color: #F0C037; margin-bottom: 20px;"></i>
                <h3 style="color: white; margin-bottom: 10px;">Araçlar yüklenemedi</h3>
                <p style="color: #999;">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #F0C037; color: #0F0F0F; border: none; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-redo"></i> Sayfayı Yenile
                </button>
            </div>
        `;
    }
}

// ===== ARAÇ KARTI OLUŞTURMA =====
function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.dataset.id = vehicle.id;
    card.dataset.segment = vehicle.segment;
    card.dataset.available = vehicle.available;
    
    const availabilityClass = vehicle.available ? 'available' : 'unavailable';
    const availabilityText = vehicle.available ? 'Müsait' : 'Kiralık';
    const availabilityIcon = vehicle.available ? 'check' : 'times';
    
    const featuresHTML = vehicle.features.map(feature => 
        `<span class="feature-tag">${feature}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="availability-badge ${availabilityClass}">
            <i class="fas fa-${availabilityIcon}"></i> ${availabilityText}
        </div>
        <div class="vehicle-image">
            <i class="fas ${vehicle.image}"></i>
        </div>
        <div class="vehicle-details">
            <h3>${vehicle.name}</h3>
            <div class="vehicle-specs">
                <span><i class="fas fa-cog"></i> ${vehicle.transmission}</span>
                <span><i class="fas fa-gas-pump"></i> ${vehicle.fuel}</span>
                <span><i class="fas fa-calendar-alt"></i> ${vehicle.year}</span>
                <span><i class="fas fa-tag"></i> ${vehicle.price} TL/gün</span>
            </div>
            <div class="vehicle-features">
                ${featuresHTML}
            </div>
            <button class="book-btn" onclick="quickBook(${vehicle.id})" 
                    ${!vehicle.available ? 'disabled' : ''}
                    aria-label="${vehicle.name} aracını kirala">
                <i class="fas fa-calendar-check"></i> 
                ${vehicle.available ? 'Hemen Kirala' : 'Müsait Değil'}
            </button>
        </div>
    `;
    
    return card;
}

// ===== TESTIMONIAL SLIDER =====
function initTestimonialSlider() {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) return;
    
    // Yorumları LocalStorage'dan al
    const storageKey = CONFIG.STORAGE_PREFIX + 'testimonials';
    const testimonials = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (testimonials.length === 0) {
        slider.innerHTML = `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <p>Henüz yorum bulunmamaktadır.</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Yorumları slider'a ekle
    testimonials.forEach((testimonial, index) => {
        const card = createTestimonialCard(testimonial, index);
        slider.appendChild(card);
    });
    
    // Otomatik kaydırma başlat
    startAutoScroll();
    
    // Slider kontrollerini başlat
    initSliderControls();
}

function createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    card.dataset.id = testimonial.id;
    
    // Rating yıldızları oluştur
    let ratingStars = '';
    const fullStars = Math.floor(testimonial.rating);
    const hasHalfStar = testimonial.rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            ratingStars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            ratingStars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            ratingStars += '<i class="far fa-star"></i>';
        }
    }
    
    // Avatar için ilk harf
    const firstLetter = testimonial.author.charAt(0).toUpperCase();
    
    card.innerHTML = `
        <div class="testimonial-content">
            <p>"${testimonial.content}"</p>
        </div>
        <div class="testimonial-author">
            <div class="author-avatar">${firstLetter}</div>
            <div class="author-info">
                <h4>${testimonial.author}</h4>
                <p>${testimonial.role}</p>
                <div class="rating">
                    ${ratingStars}
                </div>
                <small style="color: #666; font-size: 12px;">${testimonial.date}</small>
            </div>
        </div>
    `;
    
    card.style.animationDelay = `${index * 0.1}s`;
    return card;
}

function startAutoScroll() {
    const slider = document.getElementById('testimonialSlider');
    if (!slider) return;
    
    // CSS animasyonunu durdur
    slider.classList.remove('paused');
    
    // Her 5 saniyede bir otomatik kaydırma
    autoScrollInterval = setInterval(() => {
        const firstCard = slider.firstElementChild;
        if (firstCard) {
            slider.appendChild(firstCard);
        }
    }, 5000);
    
    // Mouse hover'da durdur
    slider.addEventListener('mouseenter', () => {
        slider.classList.add('paused');
        clearInterval(autoScrollInterval);
    });
    
    // Mouse ayrılınca devam et
    slider.addEventListener('mouseleave', () => {
        slider.classList.remove('paused');
        startAutoScroll();
    });
    
    // Touch için de aynı işlev
    slider.addEventListener('touchstart', () => {
        slider.classList.add('paused');
        clearInterval(autoScrollInterval);
    });
    
    slider.addEventListener('touchend', () => {
        setTimeout(() => {
            slider.classList.remove('paused');
            startAutoScroll();
        }, 3000);
    });
}

function initSliderControls() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const slider = document.getElementById('testimonialSlider');
    
    if (!prevBtn || !nextBtn || !slider) return;
    
    prevBtn.addEventListener('click', () => {
        const lastCard = slider.lastElementChild;
        if (lastCard) {
            slider.insertBefore(lastCard, slider.firstElementChild);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const firstCard = slider.firstElementChild;
        if (firstCard) {
            slider.appendChild(firstCard);
        }
    });
}

// ===== FİLTRELEME =====
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Tüm butonlardan active class'ını kaldır
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Tıklanan butona active class'ını ekle
            this.classList.add('active');
            
            // Filtreyi uygula
            const filter = this.dataset.filter;
            loadVehicles(filter);
        });
    });
}

// ===== REZERVASYON FORMU =====
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });
    
    // Telefon numarası formatlama
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Hazır notlar seçimini dinle
    const quickNotes = document.querySelectorAll('input[name="quick-note"]');
    quickNotes.forEach(note => {
        note.addEventListener('change', updateMessageFromQuickNotes);
    });
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.substring(0, 10);
    
    if (value.length > 6) {
        value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
    } else if (value.length > 3) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
    }
    
    e.target.value = value;
}

function updateMessageFromQuickNotes() {
    const messageField = document.getElementById('message');
    const quickNotes = document.querySelectorAll('input[name="quick-note"]:checked');
    
    if (!messageField) return;
    
    const selectedNotes = Array.from(quickNotes).map(note => note.value);
    let currentMessage = messageField.value.trim();
    
    // Mevcut mesajda hazır notları temizle
    selectedNotes.forEach(note => {
        const noteRegex = new RegExp(note.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        currentMessage = currentMessage.replace(noteRegex, '').trim();
    });
    
    // Yeni notları ekle
    if (selectedNotes.length > 0) {
        const notesText = selectedNotes.join(', ');
        messageField.value = currentMessage ? `${currentMessage}\n\nEk olarak: ${notesText}` : `Ek olarak: ${notesText}`;
    } else {
        messageField.value = currentMessage;
    }
}

function submitBooking() {
    // Form verilerini topla
    const countryCode = document.getElementById('country-code').value;
    const phoneNumber = document.getElementById('phone').value;
    const fullPhone = `${countryCode} ${phoneNumber}`;
    
    const quickNotes = Array.from(document.querySelectorAll('input[name="quick-note"]:checked'))
        .map(note => note.value);
    
    const formData = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        phone: fullPhone,
        email: document.getElementById('email').value.trim() || '',
        vehicle: document.getElementById('vehicle-select').value,
        pickupDate: document.getElementById('pickup-date').value,
        returnDate: document.getElementById('return-date').value,
        quickNotes: quickNotes,
        message: document.getElementById('message').value.trim() || '',
        date: new Date().toLocaleString('tr-TR'),
        status: 'pending',
        source: window.location.href
    };
    
    // Validasyon
    if (!validateBooking(formData)) return;
    
    // Rezervasyonu kaydet
    saveBooking(formData);
    
    // Başarı mesajı göster
    showAlert('Rezervasyon talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçilecektir.', 'success');
    
    // Formu temizle
    resetBookingForm();
    
    // WhatsApp mesajı öner
    suggestWhatsAppMessage(formData);
}

function validateBooking(formData) {
    // Zorunlu alanlar
    if (!formData.name || !formData.phone || !formData.pickupDate || !formData.returnDate) {
        showAlert('Lütfen zorunlu alanları doldurunuz!', 'error');
        return false;
    }
    
    // Telefon validasyonu
    const phoneRegex = /^\+?\d{1,3}\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        showAlert('Lütfen geçerli bir telefon numarası giriniz!', 'error');
        return false;
    }
    
    // E-posta validasyonu (opsiyonel)
    if (formData.email && !isValidEmail(formData.email)) {
        showAlert('Lütfen geçerli bir e-posta adresi giriniz!', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function saveBooking(booking) {
    const storageKey = CONFIG.STORAGE_PREFIX + 'bookings';
    let bookings = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Benzersiz ID kontrolü
    while (bookings.some(b => b.id === booking.id)) {
        booking.id = Date.now() + Math.floor(Math.random() * 1000);
    }
    
    bookings.push(booking);
    localStorage.setItem(storageKey, JSON.stringify(bookings));
    
    // İstatistikleri güncelle
    updateStats();
    
    console.log('Rezervasyon kaydedildi:', booking);
}

function resetBookingForm() {
    const form = document.getElementById('bookingForm');
    if (form) form.reset();
    
    // Ülke kodunu Türkiye'ye sıfırla
    document.getElementById('country-code').value = '+90';
    
    // Hazır notları temizle
    document.querySelectorAll('input[name="quick-note"]').forEach(note => {
        note.checked = false;
    });
    
    // Tarihleri sıfırla
    if (flatpickrLoaded) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const pickup = document.querySelector('#pickup-date')._flatpickr;
        const returnPick = document.querySelector('#return-date')._flatpickr;
        
        if (pickup) pickup.setDate(today, false);
        if (returnPick) returnPick.setDate(tomorrow, false);
    }
}

function suggestWhatsAppMessage(booking) {
    setTimeout(() => {
        if (confirm('Rezervasyon talebiniz alındı. WhatsApp üzerinden bilgi almak ister misiniz?')) {
            const vehicleSelect = document.getElementById('vehicle-select');
            const selectedVehicle = vehicleSelect.options[vehicleSelect.selectedIndex];
            const vehicleName = selectedVehicle ? selectedVehicle.text : '';
            
            let message = `Merhaba, ${CONFIG.COMPANY_NAME}'dan rezervasyon yaptırmak istiyorum:%0A%0A`;
            message += `Ad Soyad: ${booking.name}%0A`;
            message += `Telefon: ${booking.phone}%0A`;
            message += `E-posta: ${booking.email || 'Belirtilmemiş'}%0A`;
            message += `Alış Tarihi: ${booking.pickupDate}%0A`;
            message += `İade Tarihi: ${booking.returnDate}%0A`;
            
            if (booking.vehicle) {
                message += `Araç: ${vehicleName}%0A`;
            }
            
            if (booking.quickNotes && booking.quickNotes.length > 0) {
                message += `Notlar: ${booking.quickNotes.join(', ')}%0A`;
            }
            
            if (booking.message) {
                message += `Ek Mesaj: ${booking.message}`;
            }
            
            window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
        }
    }, 1000);
}

// ===== HIZLI KİRALAMA =====
window.quickBook = function(vehicleId) {
    const vehicle = vehiclesData.find(v => v.id === vehicleId);
    
    if (!vehicle) {
        showAlert('Araç bulunamadı!', 'error');
        return;
    }
    
    if (!vehicle.available) {
        showAlert('Bu araç şu anda müsait değil!', 'error');
        return;
    }
    
    // Formu doldur
    const vehicleSelect = document.getElementById('vehicle-select');
    if (vehicleSelect) {
        vehicleSelect.value = vehicle.id;
    }
    
    // Mesaj alanını doldur
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.value = `Merhaba, ${vehicle.name} aracını kiralamak istiyorum.`;
    }
    
    // Rezervasyon bölümüne kaydır
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Odak noktasını isim alanına taşı
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
        }, 500);
    }
};

// ===== HARİTA YÜKLEME =====
function loadMap() {
    const mapContainer = document.getElementById('googleMap');
    if (!mapContainer) return;
    
    // Google Maps embed kodu
    const mapHTML = `
        <iframe 
            src="${CONFIG.MAP_EMBED_URL}"
            width="100%" 
            height="100%" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    `;
    
    mapContainer.innerHTML = mapHTML + mapContainer.innerHTML;
}

// ===== SCROLL OLAYLARI =====
function initScrollEvents() {
    // Yukarı çık butonu
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ===== ADMIN LİNKİ GİZLEME =====
function hideAdminLink() {
    if (window.location.pathname === '/' || 
        window.location.pathname.endsWith('index.html') || 
        window.location.pathname.endsWith('/')) {
        const adminLinks = document.querySelectorAll('.admin-link');
        adminLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
}

// ===== WHATSAPP BUTONU GÜNCELLEME =====
function updateWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}`;
        
        // Hover efektleri
        whatsappBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#128C7E';
        });
        
        whatsappBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#25D366';
        });
    }
}

// ===== PERFORMANS İYİLEŞTİRMELERİ =====
function initPerformance() {
    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Gözlemlenecek elementler
        document.querySelectorAll('.vehicle-card, .feature, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Offline/Online durum takibi
    window.addEventListener('online', () => {
        showAlert('İnternet bağlantınız yeniden sağlandı!', 'success');
    });
    
    window.addEventListener('offline', () => {
        showAlert('İnternet bağlantınız kesildi. Bazı özellikler kısıtlı olabilir.', 'warning');
    });
}

// ===== İSTATİSTİK GÜNCELLEME =====
function updateStats() {
    const storageKey = CONFIG.STORAGE_PREFIX + 'bookings';
    const bookings = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const stats = {
        totalBookings: bookings.length,
        happyCustomers: 1000 + bookings.length,
        averageRating: 4.8,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(CONFIG.STORAGE_PREFIX + 'stats', JSON.stringify(stats));
    
    // UI'da güncelle
    const happyCustomerStat = document.querySelector('.vehicle-stats .stat-item:nth-child(3) h3');
    if (happyCustomerStat) {
        happyCustomerStat.textContent = stats.happyCustomers + '+';
    }
}

// ===== ALERT SİSTEMİ =====
function showAlert(message, type = 'info') {
    // Mevcut alert'leri temizle
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Yeni alert oluştur
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', 'assertive');
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
            <span>${message}</span>
            <button class="alert-close" aria-label="Kapat">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Kapatma butonu
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => alert.remove(), 300);
    });
    
    // Otomatik kapatma
    setTimeout(() => {
        if (alert.parentNode) {
            alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

// ===== HOŞ GELDİN MESAJI =====
function showWelcomeMessage() {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║      GÜR RENT A CAR - KARAMAN         ║
    ║      ----------------------           ║
    ║    Web sitesi başarıyla yüklendi!    ║
    ║                                       ║
    ║    Tel: +90 544 970 9712             ║
    ║    Adres: Külhan Mh. Karaman         ║
    ║                                       ║
    ║    GitHub Pages: Aktif               ║
    ║    Testimonial Slider: Aktif         ║
    ║    Admin Panel: Hazır                ║
    ╚═══════════════════════════════════════╝
    `);
}

// ===== TEMİZLİK FONKSİYONLARI =====
function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav && window.innerWidth <= 768) {
        mainNav.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

// Sayfa kapanırken interval'leri temizle
window.addEventListener('beforeunload', () => {
    if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
    }
});