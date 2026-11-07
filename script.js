const preloader = document.querySelector('#preloader');
const startedAt = performance.now();
let loaderDismissed = false;

function dismissLoader() {
  if (loaderDismissed) return;
  loaderDismissed = true;
  const wait = Math.max(0, 950 - (performance.now() - startedAt));
  window.setTimeout(() => {
    preloader?.classList.add('is-gone');
    document.body.classList.remove('loading');
  }, wait);
}

document.addEventListener('DOMContentLoaded', dismissLoader, { once: true });
window.setTimeout(dismissLoader, 1750);

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

function closeMenu() {
  navigation?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const checkin = document.querySelector('input[name="checkin"]');
const checkout = document.querySelector('input[name="checkout"]');
const today = new Date();
const toLocalDate = date => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
if (checkin && checkout) {
  checkin.min = toLocalDate(today);
  checkout.min = toLocalDate(tomorrow);
  checkin.addEventListener('change', () => {
    if (!checkin.value) {
      checkout.min = toLocalDate(tomorrow);
      return;
    }
    const nextDay = new Date(`${checkin.value}T00:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    checkout.min = toLocalDate(nextDay);
    if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
  });
}

document.querySelector('#enquiry-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = `Hello Western Hotel, I would like to check availability. Check-in: ${data.get('checkin')}; check-out: ${data.get('checkout')}; guests: ${data.get('guests')}. Please share the room options and current rates.`;
  window.open(`https://wa.me/917666267449?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

let scrollTicking = false;
const updateScrollProgress = () => {
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
  document.documentElement.style.setProperty('--scroll-progress', String(progress));
  scrollTicking = false;
};
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollProgress);
  }
}, { passive: true });
updateScrollProgress();
