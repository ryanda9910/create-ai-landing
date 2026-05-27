// Mobile nav toggle
const header = document.getElementById('site-header');
const toggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

toggle?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('hidden');
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.textContent = open ? '☰' : '✕';
  toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
});

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.add('hidden');
    if (toggle) { toggle.textContent = '☰'; toggle.setAttribute('aria-expanded', 'false'); }
  });
});

// Scroll header bg
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 32);
}, { passive: true });

// Respect prefers-reduced-motion for hero video
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.motion-safe-only').forEach((el) => el.remove());
}

// Contact form
const form = document.getElementById('inquiry-form');
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (data.website) return; // honeypot

  const btn = form.querySelector('button[type="submit"]');
  const errorEl = document.getElementById('form-error');
  const successEl = document.getElementById('form-success');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  if (errorEl) errorEl.classList.add('hidden');

  try {
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      form.reset();
      if (successEl) successEl.classList.remove('hidden');
    } else {
      if (errorEl) { errorEl.textContent = json.message; errorEl.classList.remove('hidden'); }
      if (btn) { btn.disabled = false; btn.textContent = 'Send inquiry'; }
    }
  } catch {
    if (errorEl) { errorEl.textContent = 'Network error. Try again.'; errorEl.classList.remove('hidden'); }
    if (btn) { btn.disabled = false; btn.textContent = 'Send inquiry'; }
  }
});
