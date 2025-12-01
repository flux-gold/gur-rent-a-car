// Gür Rent A Car - Ana JavaScript Dosyası

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBİL MENÜ =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const isActive = mainNav.classList.contains('active');
            this.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isActive ? 'hidden' : 'auto';
        });
        
        // Dışarı tıklanınca menüyü kapat
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileMenuBtn.contains(event.target) && window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // ===== TARİH SEÇİCİ =====
    if (typeof flatpickr !== 'undefined') {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const pickupDate = flatpickr("#pickup-date", {
            locale: "tr",
            dateFormat: "d.m.Y",
            minDate: "today",
            defaultDate: today,
            disableMobile: true,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    const nextDay = new Date(selectedDates[0]);
                    nextDay.setDate(nextDay.getDate() + 1);
                    returnDate.set('minDate', nextDay);
                    
                    if (returnDate.selectedDates[0] && returnDate.selectedDates[0] < nextDay) {
                        returnDate.setDate(nextDay);
                    }
                }
            }
        });
        
        const returnDate = flatpickr("#return-date", {
            locale: "tr",
            dateFormat: "d.m.Y",
            minDate: tomorrow,
            defaultDate: tomorrow,
            disableMobile: true
        });
    }
    
    // ===== ARAÇ VERİTABANI =====
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
            image: "fa-car"
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
            image: "fa-car"
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
            image: "fa-car"
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
            image: "fa-car"
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
            image: "fa-car-side"
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
            image: "fa-car"
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
            image: "fa-car-side"
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
            image: "fa-car"
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
            image: "fa-car-side"
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
            image: "fa-car"
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
            image: "fa-car"
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
            image: "fa-car"
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
            image: "fa-car"
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
            image: "fa-car"
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
            image: "fa-car-side"
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
            image: "fa-car-side"
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
            image: "fa-truck-pickup"
        }
    ];
    
    // ===== LOCALSTORAGE YÖNETİMİ =====
    function initializeStorage() {
        if (!localStorage.getItem('gurRentVehicles')) {
            localStorage.setItem('gurRentVehicles', JSON.stringify(defaultVehicles));
        }
        
        if (!localStorage.getItem('gurRentBookings')) {
            localStorage.setItem('gurRentBookings', JSON.stringify([]));
        }
    }
    
    initializeStorage();
    
    // ===== ARAÇLARI YÜKLE =====
    function loadVehicles(filter = 'all') {
        const vehicleList = document.getElementById('vehicleList');
        const vehicleSelect = document.getElementById('vehicle-select');
        
        if (!vehicleList && !vehicleSelect) return;
        
        const vehicles = JSON.parse(localStorage.getItem('gurRentVehicles') || '[]');
        
        // Araç listesini filtrele
        let filteredVehicles = vehicles;
        
        if (filter !== 'all') {
            if (filter === 'available') {
                filteredVehicles = vehicles.filter(vehicle => vehicle.available);
            } else {
                filteredVehicles = vehicles.filter(vehicle => vehicle.segment === filter);
            }
        }
        
        // Araç grid'ini temizle
        if (vehicleList) {
            vehicleList.innerHTML = '';
            
            // Araçları ekle
            filteredVehicles.forEach(vehicle => {
                const vehicleCard = createVehicleCard(vehicle);
                vehicleList.appendChild(vehicleCard);
            });
            
            // Eğer araç yoksa mesaj göster
            if (filteredVehicles.length === 0) {
                vehicleList.innerHTML = `
                    <div class="no-vehicles" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                        <i class="fas fa-car" style="font-size: 60px; color: var(--gray); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--white); margin-bottom: 10px;">Bu kategoride araç bulunmamaktadır</h3>
                        <p style="color: var(--gray);">Lütfen başka bir kategori seçin veya daha sonra tekrar kontrol edin.</p>
                    </div>
                `;
            }
        }
        
        // Araç seçim kutusunu doldur
        if (vehicleSelect) {
            // Mevcut seçenekleri temizle (ilk seçeneği koru)
            while (vehicleSelect.options.length > 1) {
                vehicleSelect.remove(1);
            }
            
            // Sadece müsait araçları ekle
            const availableVehicles = vehicles.filter(v => v.available);
            availableVehicles.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                option.textContent = `${vehicle.name} (${vehicle.segment})`;
                vehicleSelect.appendChild(option);
            });
        }
    }
    
    // ===== ARAÇ KARTI OLUŞTUR =====
    function createVehicleCard(vehicle) {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card';
        vehicleCard.dataset.segment = vehicle.segment;
        vehicleCard.dataset.available = vehicle.available;
        
        // Müsaitlik durumu
        let availabilityClass = 'available';
        let availabilityText = 'Müsait';
        
        if (!vehicle.available) {
            availabilityClass = 'unavailable';
            availabilityText = 'Kiralık';
        }
        
        // Özellikler HTML'i
        const featuresHTML = vehicle.features.map(feature => 
            `<span class="feature-tag">${feature}</span>`
        ).join('');
        
        vehicleCard.innerHTML = `
            <div class="availability-badge ${availabilityClass}">
                <i class="fas fa-${vehicle.available ? 'check' : 'times'}"></i> ${availabilityText}
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
                </div>
                <div class="vehicle-specs">
                    <span><i class="fas fa-tag"></i> ${vehicle.segment.charAt(0).toUpperCase() + vehicle.segment.slice(1)} Segment</span>
                </div>
                <div class="vehicle-features">
                    ${featuresHTML}
                </div>
                <button class="book-btn" onclick="quickBookVehicle(${vehicle.id})" ${!vehicle.available ? 'disabled' : ''}>
                    <i class="fas fa-calendar-check"></i> ${vehicle.available ? 'Hemen Kirala' : 'Müsait Değil'}
                </button>
            </div>
        `;
        
        return vehicleCard;
    }
    
    // ===== FİLTRELEME =====
    const filterButtons = document.querySelectorAll('.filter-btn');
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
    
    // ===== HIZLI REZERVASYON =====
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form verilerini al
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
                status: 'pending'
            };
            
            // Validasyon
            if (!formData.name || !formData.phone || !formData.pickupDate || !formData.returnDate) {
                showAlert('Lütfen zorunlu alanları doldurunuz!', 'error');
                return;
            }
            
            // Telefon validasyonu
            const phoneRegex = /^(05\d{9})$/;
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                showAlert('Lütfen geçerli bir telefon numarası giriniz (05XXXXXXXXX)!', 'error');
                return;
            }
            
            // Rezervasyonları al
            let bookings = JSON.parse(localStorage.getItem('gurRentBookings') || '[]');
            bookings.push(formData);
            localStorage.setItem('gurRentBookings', JSON.stringify(bookings));
            
            // Başarı mesajı göster
            showAlert('Rezervasyon talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçilecektir.', 'success');
            
            // Formu temizle
            bookingForm.reset();
            
            // Tarihleri sıfırla
            if (typeof flatpickr !== 'undefined') {
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                
                const pickup = document.querySelector('#pickup-date')._flatpickr;
                const returnPick = document.querySelector('#return-date')._flatpickr;
                
                if (pickup) pickup.setDate(today, false);
                if (returnPick) returnPick.setDate(tomorrow, false);
            }
            
            // WhatsApp mesajı oluştur (opsiyonel)
            const whatsappMessage = `Merhaba, Gür Rent A Car'tan rezervasyon yaptırmak istiyorum:%0A%0A` +
                                  `Ad Soyad: ${formData.name}%0A` +
                                  `Telefon: ${formData.phone}%0A` +
                                  `E-posta: ${formData.email || 'Belirtilmemiş'}%0A` +
                                  `Alış Tarihi: ${formData.pickupDate}%0A` +
                                  `İade Tarihi: ${formData.returnDate}%0A` +
                                  `${formData.vehicle ? `Araç: ${formData.vehicle}%0A` : ''}` +
                                  `${formData.message ? `Not: ${formData.message}` : ''}`;
            
            // Kullanıcıya WhatsApp'tan mesaj gönderme seçeneği sun
            setTimeout(() => {
                if (confirm('Rezervasyon talebiniz alındı. WhatsApp üzerinden de bilgi vermek ister misiniz?')) {
                    window.open(`https://wa.me/905449709712?text=${whatsappMessage}`, '_blank');
                }
            }, 1000);
        });
    }
    
    // ===== ALERT GÖSTER =====
    function showAlert(message, type = 'info') {
        // Mevcut alert'leri temizle
        const existingAlerts = document.querySelectorAll('.custom-alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Alert oluştur
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="alert-close"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Stil ekle
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(40, 167, 69, 0.95)' : type === 'error' ? 'rgba(220, 53, 69, 0.95)' : 'rgba(23, 162, 184, 0.95)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
        `;
        
        const alertContent = alert.querySelector('.alert-content');
        alertContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        const alertClose = alert.querySelector('.alert-close');
        alertClose.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 5px;
            border-radius: 4px;
            transition: background 0.3s;
        `;
        
        alertClose.addEventListener('mouseover', function() {
            this.style.background = 'rgba(255,255,255,0.2)';
        });
        
        alertClose.addEventListener('mouseout', function() {
            this.style.background = 'none';
        });
        
        alertClose.addEventListener('click', function() {
            alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => alert.remove(), 300);
        });
        
        // Animasyon CSS'ini ekle
        if (!document.querySelector('#alert-animations')) {
            const style = document.createElement('style');
            style.id = 'alert-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(alert);
        
        // 5 saniye sonra otomatik kapat
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    }
    
    // ===== HIZLI KİRALAMA =====
    window.quickBookVehicle = function(vehicleId) {
        const vehicles = JSON.parse(localStorage.getItem('gurRentVehicles') || '[]');
        const vehicle = vehicles.find(v => v.id === vehicleId);
        
        if (!vehicle) {
            showAlert('Araç bulunamadı!', 'error');
            return;
        }
        
        if (!vehicle.available) {
            showAlert('Bu araç şu anda müsait değil!', 'error');
            return;
        }
        
        // Formu doldur ve rezervasyon bölümüne kaydır
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
        document.getElementById('booking').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // İsim alanına odaklan
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
        }, 500);
    };
    
    // ===== GOOGLE HARİTALAR =====
    const mapPlaceholder = document.getElementById('googleMap');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            const address = encodeURIComponent('Külhan Mahallesi, 2. İstasyon Caddesi, Karaman');
            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        });
    }
    
    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Eğer admin linki ise normal davran
            if (href === 'admin.html') return;
            
            e.preventDefault();
            
            const targetId = href;
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Mobil menüyü kapat
            if (window.innerWidth <= 768 && mainNav) {
                mainNav.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                document.body.style.overflow = 'auto';
            }
            
            // Scroll et
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // URL'yi güncelle (hash)
            history.pushState(null, null, href);
        });
    });
    
    // ===== SCROLL ANIMASYONU =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Gözlemlemek istediğiniz elementleri seçin
    document.querySelectorAll('.vehicle-card, .feature, .testimonial-card, .social-card').forEach(el => {
        observer.observe(el);
    });
    
    // ===== SAYFA YÜKLENDİĞİNDE ARAÇLARI GÖSTER =====
    loadVehicles();
    
    // ===== SAYFA YÜKLEME ANIMASYONU =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Yüklenme süresini ölç ve konsola yaz
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`Sayfa yüklendi: ${loadTime}ms`);
    });
    
    // ===== ADMIN PANEL TUŞ KOMBİNASYONU =====
    let keySequence = [];
    const adminCode = [71, 85, 82]; // G, Ü, R tuş kodu (büyük harf)
    
    document.addEventListener('keydown', function(e) {
        // Sadece harf tuşlarını kontrol et
        if (e.keyCode >= 65 && e.keyCode <= 90) {
            keySequence.push(e.keyCode);
            
            // Son 3 tuşa bak
            if (keySequence.length > 3) {
                keySequence.shift();
            }
            
            // Eğer tuş kombinasyonu doğruysa
            if (JSON.stringify(keySequence) === JSON.stringify(adminCode)) {
                // Admin linkini vurgula
                const adminLink = document.querySelector('.admin-link');
                if (adminLink) {
                    adminLink.style.animation = 'pulse 1s infinite';
                    adminLink.style.color = '#F0C037';
                    
                    // 5 saniye sonra animasyonu durdur
                    setTimeout(() => {
                        adminLink.style.animation = '';
                        adminLink.style.color = '';
                    }, 5000);
                }
                
                // Tuş dizisini temizle
                keySequence = [];
                
                console.log('Admin panel tuş kombinasyonu tetiklendi!');
            }
        }
    });
    
    // ===== PULSE ANIMASYONU =====
    if (!document.querySelector('#pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== RESPONSIVE TASARIM İÇİN EK AYARLAR =====
    function handleResize() {
        // Eğer masaüstü görünümdeyse ve mobil menü açıksa kapat
        if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            document.body.style.overflow = 'auto';
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // ===== OFFLINE DESTEĞİ =====
    window.addEventListener('online', function() {
        showAlert('İnternet bağlantınız yeniden sağlandı!', 'success');
    });
    
    window.addEventListener('offline', function() {
        showAlert('İnternet bağlantınız kesildi. Bazı özellikler kısıtlı olabilir.', 'warning');
    });
    
    // ===== PERFORMANS İYİLEŞTİRMELERİ =====
    // Görseller için lazy loading
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // ===== KONSOL LOGO =====
    console.log(`
    ██████╗ ██╗   ██╗██████╗     ██████╗ ███████╗███╗   ██╗████████╗
    ██╔════╝ ██║   ██║██╔══██╗    ██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
    ██║  ███╗██║   ██║██████╔╝    ██████╔╝█████╗  ██╔██╗ ██║   ██║   
    ██║   ██║██║   ██║██╔══██╗    ██╔══██╗██╔══╝  ██║╚██╗██║   ██║   
    ╚██████╔╝╚██████╔╝██║  ██║    ██║  ██║███████╗██║ ╚████║   ██║   
     ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   
                                                                     
    Gür Rent A Car - Karaman'da Güvenilir Araç Kiralama
    Web sitesi başarıyla yüklendi!
    `);
});
// ===== YUKARI ÇIK BUTONU =====
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    // Scroll ile butonu göster/gizle
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Butona tıklayınca en üste çık
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== ADMIN PANELİ LİNKİNİ GİZLE =====
document.addEventListener('DOMContentLoaded', function() {
    // Ana sayfada admin linkini gizle
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const adminLinks = document.querySelectorAll('a[href="admin.html"], a[href="/admin.html"]');
        adminLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
});

// ===== MUTLU MÜŞTERİ SAYISINI GÜNCELLE =====
document.addEventListener('DOMContentLoaded', function() {
    const happyCustomerStat = document.querySelector('.vehicle-stats .stat-item:nth-child(3) h3');
    if (happyCustomerStat) {
        happyCustomerStat.textContent = '1000+';
    }
});

// ===== WHATSAPP BUTONU GÜNCELLEMESİ =====
document.addEventListener('DOMContentLoaded', function() {
    // Mevcut WhatsApp butonunu bul
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.style.backgroundColor = '#25D366';
        whatsappBtn.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#128C7E';
        });
        whatsappBtn.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#25D366';
        });
    }
});