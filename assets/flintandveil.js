/* ============================================
   FLINT & VEIL — Main JavaScript
   File: assets/flintandveil.js
   ============================================ */

/* --- Cart Functionality --- */
async function addToCart(button) {
  const variantId = button.dataset.productId;
  if (!variantId) return;

  button.disabled = true;
  button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

  try {
    const response = await fetch(window.routes.cart_add_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 })
    });

    if (response.ok) {
      await updateCartCount();
      openCartDrawer();
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      }, 1500);
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    button.disabled = false;
  }
}

async function updateCartCount() {
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    const countEl = document.querySelector('.cart-count');
    if (countEl) {
      countEl.textContent = cart.item_count;
      countEl.style.display = cart.item_count > 0 ? 'inline-flex' : 'none';
    }
  } catch (error) {
    console.error('Cart count error:', error);
  }
}

function openCartDrawer() {
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.querySelector('.cart-drawer__overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.querySelector('.cart-drawer__overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* --- Search Modal --- */
function openSearchModal() {
  const modal = document.querySelector('.search-modal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.search-modal__input')?.focus();
}

function closeSearchModal() {
  const modal = document.querySelector('.search-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* --- Product Gallery --- */
function initProductGallery() {
  const thumbs = document.querySelectorAll('.product-page__thumb');
  const mainImg = document.querySelector('.product-page__main-image img');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (mainImg && thumb.querySelector('img')) {
        mainImg.src = thumb.querySelector('img').src.replace('_100x', '_800x');
        mainImg.srcset = '';
      }
    });
  });
}

/* --- Newsletter Form --- */
function initNewsletter() {
  const form = document.querySelector('.newsletter__form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('.newsletter__input')?.value;
    if (!email) return;

    const btn = form.querySelector('.btn');
    if (btn) {
      btn.textContent = 'Thank you!';
      btn.disabled = true;
    }
  });
}

/* --- Scroll animations --- */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.product-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
  initProductGallery();
  initNewsletter();
  initScrollAnimations();

  document.querySelector('.cart-drawer__overlay')?.addEventListener('click', closeCartDrawer);
  document.querySelector('.cart-drawer__close')?.addEventListener('click', closeCartDrawer);

  document.querySelectorAll('[data-search-close]').forEach(el => {
    el.addEventListener('click', closeSearchModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearchModal();
      closeCartDrawer();
    }
  });
});