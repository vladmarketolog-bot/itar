document.addEventListener('DOMContentLoaded', () => {
  // Initialize Icons
  lucide.createIcons();

  // Scroll Header Toggle
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileMenuLinks = mobileMenuOverlay.querySelectorAll('a');

  function openMenu() {
    mobileMenuOverlay.classList.add('active');
  }

  function closeMenu() {
    mobileMenuOverlay.classList.remove('active');
  }

  mobileMenuBtn.addEventListener('click', openMenu);
  mobileMenuCloseBtn.addEventListener('click', closeMenu);
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Catalog Tabs Filtering
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Filter products
      productCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // AI Visualizer Simulation
  const simulateBtn = document.getElementById('simulateAiBtn');
  const initialView = document.getElementById('aiInitialView');
  const loadingView = document.getElementById('aiLoadingView');
  const resultView = document.getElementById('aiResultView');
  const closeResultBtn = document.getElementById('closeResultBtn');

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => {
      // Show loading
      initialView.classList.add('hidden');
      loadingView.classList.remove('hidden');

      // Wait 2.5 seconds, then show result
      setTimeout(() => {
        loadingView.classList.add('hidden');
        resultView.classList.remove('hidden');
      }, 2500);
    });
  }

  if (closeResultBtn) {
    closeResultBtn.addEventListener('click', () => {
      // Reset view
      resultView.classList.add('hidden');
      initialView.classList.remove('hidden');
    });
  }

  // Product Modal Logic
  const productCardsList = document.querySelectorAll('.product-card');
  const modal = document.getElementById('productModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  
  // Modal inner elements
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalPrice = document.getElementById('modalPrice');

  function openModal(card) {
    // Extract info from card
    const imgElement = card.querySelector('img');
    const titleElement = card.querySelector('h3');
    const categoryElement = card.querySelector('p');
    const priceElement = card.querySelector('.font-bold:not(h3)'); // Get the price which is not h3

    // Update modal content
    if(imgElement) modalImage.src = imgElement.src;
    if(titleElement) modalTitle.textContent = titleElement.textContent;
    if(categoryElement) modalCategory.textContent = categoryElement.textContent;
    if(priceElement) modalPrice.textContent = priceElement.textContent;

    // Show modal
    modal.classList.remove('hidden');
    // small delay to allow display flex to apply before opacity transition
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden'; // Prevent page scrolling
  }

  function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // match CSS transition duration
    document.body.style.overflow = '';
  }

  // Attach click events to all cards
  productCardsList.forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  // Attach click events for closing
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ===== Reviews Slider =====
  (function() {
    const viewport = document.getElementById('reviewViewport');
    const track    = document.getElementById('reviewTrack');
    const prevBtn  = document.getElementById('reviewPrev');
    const nextBtn  = document.getElementById('reviewNext');
    const dotsWrap = document.getElementById('reviewDots');
    if (!viewport || !track || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.querySelectorAll('.review-slide'));
    const GAP = 24; // 1.5rem = 24px
    let current = 0;

    function perView() {
      const w = viewport.offsetWidth;
      if (w < 640)  return 1;
      if (w < 1024) return 2;
      return 3;
    }

    function calcSlideWidth() {
      const pv = perView();
      return (viewport.offsetWidth - GAP * (pv - 1)) / pv;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView());
    }

    function setWidths() {
      const w = calcSlideWidth() + 'px';
      slides.forEach(function(s) { s.style.width = w; s.style.minWidth = w; });
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      var total = maxIndex() + 1;
      for (var i = 0; i < total; i++) {
        (function(idx) {
          var d = document.createElement('button');
          d.setAttribute('aria-label', 'Отзыв ' + (idx + 1));
          d.style.cssText = 'height:0.5rem;width:0.5rem;border-radius:0.25rem;border:none;cursor:pointer;transition:all 0.3s;padding:0;background:rgba(255,255,255,0.3);';
          d.addEventListener('click', function() { goTo(idx); });
          dotsWrap.appendChild(d);
        })(i);
      }
    }

    function updateDots() {
      Array.from(dotsWrap.children).forEach(function(d, i) {
        d.style.background = i === current ? 'var(--color-orange-600)' : 'rgba(255,255,255,0.3)';
        d.style.width = i === current ? '1.5rem' : '0.5rem';
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      var offset = current * (calcSlideWidth() + GAP);
      track.style.transform = 'translateX(-' + offset + 'px)';
      prevBtn.style.opacity = current === 0 ? '0.4' : '1';
      nextBtn.style.opacity = current === maxIndex() ? '0.4' : '1';
      updateDots();
    }

    prevBtn.addEventListener('click', function() { goTo(current - 1); });
    nextBtn.addEventListener('click', function() { goTo(current + 1); });

    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        current = 0;
        setWidths();
        buildDots();
        goTo(0);
      }, 150);
    });

    // Touch swipe support
    var startX = 0;
    viewport.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', function(e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    }, { passive: true });

    // Init
    setWidths();
    buildDots();
    goTo(0);
  })();
});

