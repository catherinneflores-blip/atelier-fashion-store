const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const drawer = $('.cart-drawer');
const cart = [];
const money = value => `$${value.toFixed(2)}`;
function showToast(message) {
  const toast = $('.toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
}
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $$('.cart-count').forEach(el => el.textContent = count);
  $('.cart-subtotal').textContent = money(cart.reduce((sum, item) => sum + item.price * item.qty, 0));
  const container = $('.cart-items');
  if (!cart.length) {
    container.innerHTML = '<p class="empty-cart">Tu bolsa está esperando algo especial.</p>';
    return;
  }
  container.innerHTML = cart.map((item, index) => `<div class="cart-item"><div><strong>${item.name}</strong><p>Cantidad: ${item.qty} · ${money(item.price)} c/u</p></div><div><strong>${money(item.price * item.qty)}</strong><br><button data-remove="${index}">Quitar</button></div></div>`).join('');
}
function openCart() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$('.bag-toggle').addEventListener('click', openCart);
$('.close-cart').addEventListener('click', closeCart);
$('.drawer-backdrop').addEventListener('click', closeCart);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
$('.menu-toggle').addEventListener('click', event => {
  const nav = $('.main-nav');
  const open = nav.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});
$$('.main-nav a').forEach(link => link.addEventListener('click', () => {
  $('.main-nav').classList.remove('open');
  $('.menu-toggle').setAttribute('aria-expanded', 'false');
}));
$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(filter => filter.classList.toggle('active', filter === button));
  const category = button.dataset.filter;
  $$('.product-card').forEach(card => card.classList.toggle('hidden', category !== 'Todos' && card.dataset.category !== category));
}));
$$('.quick-add').forEach(button => button.addEventListener('click', () => {
  const name = button.dataset.product;
  const price = Number(button.dataset.price);
  const existing = cart.find(item => item.name === name);
  existing ? existing.qty++ : cart.push({ name, price, qty: 1 });
  renderCart();
  showToast(`${name} se añadió a tu bolsa`);
}));
$('.cart-items').addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  cart.splice(Number(button.dataset.remove), 1);
  renderCart();
});
$$('.favorite').forEach(button => button.addEventListener('click', () => {
  const favorite = button.classList.toggle('is-favorite');
  button.textContent = favorite ? '♥' : '♡';
  showToast(favorite ? 'Añadido a favoritos' : 'Eliminado de favoritos');
}));
$('.checkout-button').addEventListener('click', () => showToast('Esta demo no procesa pagos reales.'));
$('.search-toggle').addEventListener('click', () => {
  const term = prompt('¿Qué estás buscando?');
  if (!term) return;
  const normalized = term.trim().toLocaleLowerCase('es');
  let matches = 0;
  $$('.product-card').forEach(card => {
    const match = card.textContent.toLocaleLowerCase('es').includes(normalized);
    card.classList.toggle('hidden', !match);
    if (match) matches++;
  });
  $$('.filter').forEach(filter => filter.classList.toggle('active', filter.dataset.filter === 'Todos'));
  $('#coleccion').scrollIntoView({ behavior: 'smooth' });
  showToast(matches ? `${matches} producto(s) encontrado(s)` : 'No encontramos productos con ese término');
});
$('#newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  $('#newsletter-message').textContent = '¡Gracias! Esta demo no guarda suscripciones reales.';
  event.currentTarget.reset();
});
renderCart();
