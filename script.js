// ============================================
// GÜR RENT A CAR - ANA JAVASCRIPT DOSYASI
// GitHub Pages Uyumlu
// ============================================

// Konfigürasyon
const CONFIG = {
    WHATSAPP_NUMBER: '905449709712',
    INSTAGRAM_USERNAME: 'gurrentacar',
    COMPANY_NAME: 'Gür Rent A Car',
    COMPANY_ADDRESS: 'Külhan Mh. 2. İstasyon Cd. No:29/E Merkez/Karaman',
    ADMIN_PASSWORD: 'gur2023',
    STORAGE_PREFIX: 'gurRent_'
};

// Global değişkenler
let flatpickrLoaded = false;
let vehiclesData = [];

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
    
    // Araçları yükle
    loadVehicles();
    
    // Filtre butonlarını başlat
    initFilters();
    
    // Rezervasyon formunu başlat
    initBookingForm();
    
    // Testimonial slider'ı başlat
    initTestimonialSlider();
    
    // Haritayı başlat
    initMap();
    
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
    
    // Araçları kontrol et ve yükle
    if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, JSON.stringify(defaultVehicles));
        console.log('Varsayılan araçlar yüklendi');
    }
    
    // Rezervasyonları kontrol et
    if (!localStorage.getItem(CONFIG.STORAGE_PREFIX + 'bookings')) {
        localStorage.setItem(CONFIG.STORAGE_PREFIX + 'bookings', JSON.stringify([]));
    }
    
    // İstatistikleri kontrol et
    if (!localStorage.getItem(CONFIG.STORAGE_PREFIX + 'stats')) {
        const stats = {
            totalBookings: 0,
            happyCustomers: 1000,
            averageRating: 4.8,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(CONFIG.STORAGE_PREFIX + 'stats', JSON.stringify(stats));
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
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slider) return;
    
    const cards = slider.querySelectorAll('.testimonial-card');
    const cardCount = cards.length;
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Dots oluştur
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < cardCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Slider'ı kaydır
    function goToSlide(index) {
        currentIndex = index;
        
        // Sınır kontrolü
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex >= cardCount) currentIndex = cardCount - 1;
        
        // Card genişliğini hesapla (responsive için)
        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const gap = 30; // CSS'deki gap değeri
        
        // Kaydırma pozisyonunu hesapla
        const scrollPosition = currentIndex * (cardWidth + gap);
        
        // Yumuşak kaydırma
        slider.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        // Dots'ı güncelle
        updateDots();
        
        // Buton durumlarını güncelle
        updateButtons();
    }
    
    // Dots'ı güncelle
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Buton durumlarını güncelle
    function updateButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= cardCount - 3; // 3 card görünüyor
    }
    
    // Otomatik kaydırma
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < cardCount - 1) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(0); // Başa dön
            }
        }, 5000); // 5 saniyede bir
    }
    
    // Otomatik kaydırmayı durdur
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // İlk dot'ları oluştur
    createDots();
    
    // Buton event'lerini ekle
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            stopAutoSlide();
            setTimeout(startAutoSlide, 10000); // 10 saniye sonra tekrar başlat
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            stopAutoSlide();
            setTimeout(startAutoSlide, 10000); // 10 saniye sonra tekrar başlat
        });
    }
    
    // Scroll event'i ile güncel index'i takip et
    slider.addEventListener('scroll', () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = 30;
        const scrollLeft = slider.scrollLeft;
        const newIndex = Math.round(scrollLeft / (cardWidth + gap));
        
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateDots();
            updateButtons();
        }
    });
    
    // Mouse hover'da otomatik kaydırmayı durdur
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Touch event'leri için
    let isDragging = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        stopAutoSlide();
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
    
    slider.addEventListener('touchend', () => {
        isDragging = false;
        setTimeout(startAutoSlide, 5000);
    });
    
    // Responsive için pencere boyutu değiştiğinde dots'ı yenile
    window.addEventListener('resize', () => {
        setTimeout(() => {
            goToSlide(currentIndex);
            createDots();
        }, 100);
    });
    
    // Otomatik kaydırmayı başlat
    setTimeout(startAutoSlide, 3000); // 3 saniye sonra başlat
    
    // Buton durumlarını güncelle
    updateButtons();
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
            
            // Filtreleme ses efekti (isteğe bağlı)
            playFilterSound();
        });
    });
}

function playFilterSound() {
    // Basit bir ses efekti
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Ses API'si desteklenmiyorsa sessiz kal
    }
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

function submitBooking() {
    // Form verilerini topla
    const formData = {
        id: Date.now(),
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim() || '',
        vehicle: document.getElementById('vehicle-select').value,
        pickupDate: document.getElementById('pickup-date').value,
        returnDate: document.getElementById('return-date').value,
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
    const phoneRegex = /^(05\d{2}\s?\d{3}\s?\d{2}\s?\d{2})$/;
    if (!phoneRegex.test(formData.phone)) {
        showAlert('Lütfen geçerli bir telefon numarası giriniz (05XX XXX XX XX)!', 'error');
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
            
            const message = `Merhaba, ${CONFIG.COMPANY_NAME}'dan rezervasyon yaptırmak istiyorum:%0A%0A` +
                          `Ad Soyad: ${booking.name}%0A` +
                          `Telefon: ${booking.phone}%0A` +
                          `E-posta: ${booking.email || 'Belirtilmemiş'}%0A` +
                          `Alış Tarihi: ${booking.pickupDate}%0A` +
                          `İade Tarihi: ${booking.returnDate}%0A` +
                          `${booking.vehicle ? `Araç: ${vehicleName}%0A` : ''}` +
                          `${booking.message ? `Not: ${booking.message}` : ''}`;
            
            window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`, '_blank');
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

// ===== HARİTA =====
function initMap() {
    const mapPlaceholder = document.getElementById('googleMap');
    if (!mapPlaceholder) return;
    
    mapPlaceholder.addEventListener('click', function() {
        const address = encodeURIComponent(CONFIG.COMPANY_ADDRESS);
        window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    });
    
    // Klavye erişilebilirliği
    mapPlaceholder.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
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
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (!targetElement) return;
            
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
            
            // URL hash'ini güncelle
            history.pushState(null, null, href);
        });
    });
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