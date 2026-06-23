/* Clean Canada - Interactive Script */

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initTypingTagline();
  initContactForm();
  initBookingModal();
  initServiceChecklists();
  initMobileMenu();
  initScrollReveal();
  initHeroVideoPlaylist();
});

/* -------------------------------------------------------------
 * 1. Interactive Before/After Slider
 * ------------------------------------------------------------- */
function initSlider() {
  const sliderContainer = document.getElementById('sliderContainer');
  const sliderHandle = document.getElementById('sliderHandle');
  const afterImage = document.getElementById('afterImage');

  if (sliderContainer && sliderHandle && afterImage) {
    let isDragging = false;

    const updateSlider = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      let position = ((clientX - rect.left) / rect.width) * 100;
      position = Math.max(0, Math.min(100, position));
      
      afterImage.style.width = `${position}%`;
      sliderHandle.style.left = `${position}%`;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    };

    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault();
    };

    const stopDrag = () => {
      isDragging = false;
    };

    sliderHandle.addEventListener('mousedown', startDrag);
    sliderHandle.addEventListener('touchstart', startDrag, { passive: true });
    
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
  }
}

/* -------------------------------------------------------------
 * 2. Typing Tagline Slogan Effect
 * ------------------------------------------------------------- */
function initTypingTagline() {
  const element = document.getElementById('typingTagline');
  if (!element) return;

  const words = ["Clean", "Safe", "Pristine"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 150;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 75;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* -------------------------------------------------------------
 * 2b. Need Cleaning Contact Form Handler
 * ------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  const captchaInput = document.getElementById('contactCaptcha');
  const captchaLabel = document.getElementById('captchaLabel');
  const statusEl = document.getElementById('contactFormStatus');
  const errorEl = document.getElementById('contactFormError');
  const submitBtn = document.getElementById('contactSubmitBtn');

  if (!form || !captchaLabel) return;

  // Generate dynamic captcha numbers
  let num1 = Math.floor(Math.random() * 10) + 2;
  let num2 = Math.floor(Math.random() * 10) + 2;
  let correctAnswer = num1 + num2;
  captchaLabel.textContent = `${num1} + ${num2} =`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    statusEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const userAnswer = parseInt(captchaInput.value.trim());

    if (!name || !email || !message) {
      errorEl.textContent = "Please fill in all fields.";
      errorEl.classList.remove('hidden');
      return;
    }

    if (userAnswer !== correctAnswer) {
      errorEl.textContent = "Incorrect math answer. Please try again.";
      errorEl.classList.remove('hidden');
      captchaInput.classList.add('border-red-500');
      return;
    } else {
      captchaInput.classList.remove('border-red-500');
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send";
      statusEl.textContent = "Message sent successfully! We will get in touch with you shortly.";
      statusEl.classList.remove('hidden');
      
      form.reset();
      
      // Regenerate captcha
      num1 = Math.floor(Math.random() * 10) + 2;
      num2 = Math.floor(Math.random() * 10) + 2;
      correctAnswer = num1 + num2;
      captchaLabel.textContent = `${num1} + ${num2} =`;
    }, 1200);
  });
}

/* -------------------------------------------------------------
 * 3. Simplified Quote Modal Controller
 * ------------------------------------------------------------- */
let currentBookingPrice = 0;

function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeBookingModal');
  const triggerBtns = document.querySelectorAll('.trigger-booking-modal');
  const formContainer = document.getElementById('quoteFormContainer');
  const successContainer = document.getElementById('quoteSuccessContainer');
  const submitBtn = document.getElementById('submitQuoteBtn');
  
  // Form fields
  const bedroomsSelect = document.getElementById('bookingBedrooms');
  const bathroomsSelect = document.getElementById('bookingBathrooms');
  const serviceSelect = document.getElementById('bookingService');
  const freqSelect = document.getElementById('bookingFrequency');
  const postalInput = document.getElementById('bookingPostal');
  const phoneInput = document.getElementById('bookingPhone');
  const emailInput = document.getElementById('bookingEmail');
  const nameInput = document.getElementById('bookingName');
  const notesInput = document.getElementById('bookingNotes');
  
  // Summary outputs
  const modalFinalPrice = document.getElementById('modalFinalPrice');
  const successDetailsSummary = document.getElementById('successDetailsSummary');

  if (!modal) return;

  // Open Modal
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Show form, hide success
      formContainer.classList.remove('hidden');
      successContainer.classList.add('hidden');
      
      // Clear errors
      postalInput.classList.remove('border-red-500');
      nameInput.classList.remove('border-red-500');
      emailInput.classList.remove('border-red-500');
      phoneInput.classList.remove('border-red-500');
      const postalErr = document.getElementById('postalErr');
      if (postalErr) postalErr.classList.add('hidden');

      // Populate default postal code if user entered it in hero section
      const heroPostal = document.getElementById('heroPostalCode');
      if (heroPostal && heroPostal.value.trim()) {
        postalInput.value = heroPostal.value.trim();
      }

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
      updateModalPricing();
    });
  });

  // Close Modal
  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
    // Clear overlay confetti if any
    const overlay = document.getElementById('confettiOverlay');
    if (overlay) overlay.innerHTML = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Dynamic pricing updates inside modal
  const recalcFields = [bedroomsSelect, bathroomsSelect, serviceSelect, freqSelect];
  recalcFields.forEach(field => {
    if (field) field.addEventListener('change', updateModalPricing);
  });

  function updateModalPricing() {
    const basePrice = 100;
    const bedrooms = parseInt(bedroomsSelect.value) || 1;
    const bathrooms = parseFloat(bathroomsSelect.value) || 1;
    
    const bedCost = bedrooms * 30;
    const bathCost = bathrooms * 45;
    
    let serviceMultiplier = 1.0;
    const serviceType = serviceSelect.value;
    if (serviceType === 'deep') serviceMultiplier = 1.5;
    if (serviceType === 'move') serviceMultiplier = 1.8;

    let frequencyDiscount = 0.0;
    const freq = freqSelect.value;
    if (freq === 'weekly') frequencyDiscount = 0.15;
    if (freq === 'biweekly') frequencyDiscount = 0.10;

    const subtotal = (basePrice + bedCost + bathCost) * serviceMultiplier;
    const discountAmount = subtotal * frequencyDiscount;
    const finalPrice = Math.round(subtotal - discountAmount);

    currentBookingPrice = finalPrice;
    if (modalFinalPrice) {
      modalFinalPrice.textContent = `$${finalPrice}`;
    }
  }

  // Form validation & submit click handler
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (validateForm()) {
        submitQuoteRequest();
      }
    });
  }

  function validateForm() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const postal = postalInput.value.trim();
    const postalErr = document.getElementById('postalErr');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; 
    const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    let isValid = true;

    // Validate Name
    if (!name) {
      nameInput.classList.add('border-red-500');
      isValid = false;
    } else {
      nameInput.classList.remove('border-red-500');
    }

    // Validate Email
    if (!emailRegex.test(email)) {
      emailInput.classList.add('border-red-500');
      isValid = false;
    } else {
      nameInput.classList.remove('border-red-500');
      emailInput.classList.remove('border-red-500');
    }

    // Validate Phone
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      phoneInput.classList.add('border-red-500');
      isValid = false;
    } else {
      phoneInput.classList.remove('border-red-500');
    }

    // Validate Postal Code
    if (!postalRegex.test(postal)) {
      if (postalErr) {
        postalErr.textContent = 'Please enter a valid Canadian Postal Code (e.g. M5V 2T6)';
        postalErr.classList.remove('hidden');
      }
      postalInput.classList.add('border-red-500');
      isValid = false;
    } else {
      if (postalErr) postalErr.classList.add('hidden');
      postalInput.classList.remove('border-red-500');
    }

    return isValid;
  }

  function submitQuoteRequest() {
    // Generate human readable summary for Success Screen
    const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
    const frequencyName = freqSelect.options[freqSelect.selectedIndex].text;
    
    successDetailsSummary.innerHTML = `
      <p class="text-slate-500 text-xs uppercase tracking-wider mb-2">Quote Package Summary</p>
      <div class="space-y-1.5 text-slate-charcoal">
        <p>📋 <span class="font-normal text-slate-500">Service:</span> ${serviceName}</p>
        <p>🏠 <span class="font-normal text-slate-500">Home Size:</span> ${bedroomsSelect.value} Bed, ${bathroomsSelect.value} Bath</p>
        <p>🔄 <span class="font-normal text-slate-500">Frequency:</span> ${frequencyName}</p>
        <p>📍 <span class="font-normal text-slate-500">Location:</span> Postal Code ${postalInput.value.toUpperCase()}</p>
        <p class="pt-2 border-t border-slate-100 font-bold text-primary text-base">💰 Estimated Price: $${currentBookingPrice}</p>
      </div>
    `;

    // Swap views
    formContainer.classList.add('hidden');
    successContainer.classList.remove('hidden');

    // Trigger confetti overlay
    startConfetti();
  }

  // Pre-population method from calculator
  window.openBookingModalWithPrePop = function(beds, baths, service, freq, price) {
    bedroomsSelect.value = beds;
    bathroomsSelect.value = baths;
    serviceSelect.value = service;
    freqSelect.value = freq;
    currentBookingPrice = price;

    formContainer.classList.remove('hidden');
    successContainer.classList.add('hidden');
    
    // Clear errors
    postalInput.classList.remove('border-red-500');
    nameInput.classList.remove('border-red-500');
    emailInput.classList.remove('border-red-500');
    phoneInput.classList.remove('border-red-500');
    const postalErr = document.getElementById('postalErr');
    if (postalErr) postalErr.classList.add('hidden');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    
    updateModalPricing();
  };
}

// Confetti Particle System
function startConfetti() {
  const container = document.getElementById('confettiOverlay');
  if (!container) return;
  container.innerHTML = '';
  
  const colors = ['#10B981', '#006c49', '#ffffff', '#FFD700', '#FF6347', '#87CEEB'];
  
  for (let i = 0; i < 120; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    const colorIndex = Math.floor(Math.random() * colors.length);
    confetti.style.backgroundColor = colors[colorIndex];
    
    // Random positioning and delay
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 1.5}s`;
    confetti.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    
    // Scale and angle
    const size = 5 + Math.random() * 8;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    container.appendChild(confetti);
  }
}

/* -------------------------------------------------------------
 * 4. Service Checklist Modals
 * ------------------------------------------------------------- */
function initServiceChecklists() {
  // Checklists Content
  const checklists = {
    house: {
      title: "House Cleaning Checklist",
      items: [
        "Dust ceiling fans, fixtures, and vents",
        "Wash baseboards, doors, and frames",
        "Vacuum all carpets, rugs, and stairs",
        "Mop and polish all hardwood & tile floors",
        "Sanitize counter surfaces & backsplashes",
        "Clean cooktop, microwave (inside & out)",
        "Polish kitchen cabinet exteriors",
        "Wash and disinfect tub, shower tiles, & grout",
        "Clean toilet interior, bowl rim, & outer tank",
        "Polish mirrors and glass faucet finishes"
      ]
    },
    apartment: {
      title: "Apartment & Condo Checklist",
      items: [
        "Dust light fixtures, window ledges, & blinds",
        "Vacuum upholstery and carpet floors",
        "Sanitize and wash bathroom vanity counters",
        "Disinfect toilet bowl and sanitization scrub",
        "Clean sinks, stainless steel details, & chrome",
        "Wash dishes or load dishwasher (if empty)",
        "Clean microwave oven chamber",
        "Wipe tables, chair rails, & desk surfaces",
        "Take out trash and place fresh liners",
        "Clean balcony sliding doors (interior pane)"
      ]
    },
    move: {
      title: "Move In / Move Out Checklist",
      items: [
        "Clean inside all kitchen cabinets & drawers",
        "Clean inside and outside of refrigerator & freezer",
        "Detail inside oven cavity & burner drip pans",
        "Wash all baseboards and crown moldings",
        "Wipe interior doors and cleaning hinges",
        "Deep scrub bath tiles, grout, & tubs",
        "Clean bathroom drawers, under-sink compartments",
        "Vacuum and dust closet shelves & rods",
        "Wash window sills, tracks, & interior frames",
        "Sweep garage or balcony deck area"
      ]
    },
    deep: {
      title: "Premium Deep Clean Checklist",
      items: [
        "Hand wash all baseboards, doors & frames",
        "Double scrub kitchen range hood filters",
        "Scrub and descale shower tracks",
        "Clean refrigerator coils and vent dust",
        "Dust behind/under major furniture (where accessible)",
        "Extract dust from vents & heating baseboards",
        "Detailed grout scrub in shower & kitchen floors",
        "Vacuum under couch cushions & chair seats",
        "Wipe all doors knobs, plates & electrical switches",
        "Aromatic organic linen spray refresh"
      ]
    }
  };

  const modal = document.getElementById('checklistModal');
  const modalTitle = document.getElementById('checklistTitle');
  const checklistGrid = document.getElementById('checklistGrid');
  const closeBtn = document.getElementById('closeChecklistModal');
  const triggerLinks = document.querySelectorAll('.trigger-checklist-modal');

  if (!modal || !checklistGrid) return;

  triggerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = link.dataset.service;
      const data = checklists[serviceKey];
      
      if (data) {
        modalTitle.textContent = data.title;
        checklistGrid.innerHTML = '';
        
        data.items.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = 'flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm';
          itemEl.innerHTML = `
            <span class="material-symbols-outlined text-primary text-xl flex-shrink-0" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <span class="font-body-md text-slate-charcoal text-base leading-snug">${item}</span>
          `;
          checklistGrid.appendChild(itemEl);
        });

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeChecklist = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  };

  closeBtn.addEventListener('click', closeChecklist);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeChecklist();
  });
}

/* -------------------------------------------------------------
 * 5. Mobile Navigation Menu
 * ------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('closeMobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  });

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = 'auto';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* -------------------------------------------------------------
 * 6. Scroll-Driven Reveal Animations & Sticky Navbar
 * ------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const header = document.querySelector('header');

  // Reveal observer
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(el => revealObserver.observe(el));

  // Sticky header animation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('shadow-md', 'py-3');
      header.classList.remove('py-5');
    } else {
      header.classList.remove('shadow-md', 'py-3');
      header.classList.add('py-5');
    }
  });
}

/* -------------------------------------------------------------
 * 7. Background Video Playlist Loop
 * ------------------------------------------------------------- */
function initHeroVideoPlaylist() {
  const video = document.getElementById('heroVideo');
  if (!video) return;

  const playlist = ["glassclean.mp4", "moppingclean.mp4", "sprayclean.mp4"];
  let currentIndex = 0;

  video.addEventListener('ended', () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    video.src = playlist[currentIndex];
    video.load();
    video.play().catch(err => {
      console.warn("Video play interrupted or block by browser policy:", err);
      // Try next video if there's an error loading this one
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % playlist.length;
        video.src = playlist[currentIndex];
        video.load();
        video.play().catch(() => {});
      }, 1000);
    });
  });
}
