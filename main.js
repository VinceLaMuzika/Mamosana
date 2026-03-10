/* ═══════════════════════════════════════════════
   MAMOSANA WELLNESS BOUTIQUE — main.js
   ═══════════════════════════════════════════════ */

// ── PRODUCTS DATA ──────────────────────────────
const PRODUCTS = [
  { id:1,  name:'Liquid Chlorophyll Drops',         price:200, img:'images/Liquid Chlorophyyl.png',              cat:'supplements', badge:'Best Seller', desc:'Concentrated chlorophyll drops to boost energy, detox and alkalise your body naturally.' },
  { id:2,  name:'Himalayan Shilajit Resin',         price:200, img:'images/Himalayan shilajit salt.webp',        cat:'supplements', badge:'Premium',     desc:'Pure Himalayan Shilajit resin – nature\'s most powerful mineral supplement for vitality.' },
  { id:3,  name:'Liquid Chlorophyll Juice',         price:150, img:'images/liquid chlorophyll juice.png',        cat:'supplements', badge:'',            desc:'Ready-to-drink liquid chlorophyll juice. A delicious daily green wellness boost.' },
  { id:4,  name:'Shilajit Capsules + Ashwagandha', price:200, img:'images/Shilajit.png',                        cat:'supplements', badge:'New',         desc:'Premium Shilajit capsules blended with Ashwagandha for stress relief and strength.' },
  { id:5,  name:'Sea Moss Gel',                    price:150, img:'images/Seamoss gel.png',                     cat:'seamoss',     badge:'',            desc:'Wildcrafted Irish Sea Moss gel packed with 92 minerals. Supports immunity and thyroid health.' },
  { id:6,  name:'100% Pure Castor Oil Hexane Free',price:150, img:'images/castor.png',                          cat:'oils',        badge:'',            desc:'100% pure cold-pressed, hexane-free castor oil. Perfect for hair growth, skin care and joint relief.' },
  { id:7,  name:'Womb Tea',                        price:150, img:'images/womb tea.png.webp',                   cat:'teas',        badge:"Women's",     desc:'A carefully blended herbal tea to support women\'s reproductive health and menstrual wellness.' },
  { id:8,  name:'Flat Tummy Tea',                  price:150, img:'images/flat tummy tea 30 tea bags.png',      cat:'teas',        badge:'',            desc:'Natural herbal blend to reduce bloating, support digestion and slim your waistline.' },
  { id:9,  name:'Gut Health Tea',                  price:150, img:'images/gut health tea.webp',                 cat:'teas',        badge:'',            desc:'A soothing blend of gut-friendly herbs to restore balance and improve digestion.' },
  { id:10, name:'Soursop Tea',                     price:150, img:'images/Soursop tea.jpg',                     cat:'teas',        badge:'',            desc:'Powerful soursop leaf tea known for its immune-boosting and anti-inflammatory properties.' },
  { id:11, name:'African Wormwood Tea',            price:150, img:'images/Umhlonyane Lengana.png',              cat:'teas',        badge:'Traditional', desc:'Traditional Southern African herbal tea (Umhlonyane / Lengana) used for colds, flu and respiratory support.' },
  { id:12, name:'Raw Seamoss',                     price:150, img:'images/Raw Seamoss.jpg',                     cat:'seamoss',     badge:'',            desc:'Wildcrafted raw sea moss to make your own gel at home. Full of natural minerals.' },
  { id:13, name:'Kids Focus Tea',                  price:200, img:'images/kids.png',                            cat:'teas',        badge:'Kids',        desc:'Gentle herbal tea blend specially formulated for children\'s focus and wellbeing. Safe, soothing and delicious.' },
  { id:14, name:'Weight Gain Powder',              price:180, img:'images/Weight gain powder.png',              cat:'supplements', badge:'',            desc:'Natural herbal weight gain powder to support healthy body mass and appetite in a balanced way.' },
  { id:15, name:'Aura Salt',                       price:100, img:'images/Aura salt.png',                       cat:'supplements', badge:'',            desc:'Premium mineral-rich aura salt. A natural wellness essential for daily health and balance.' },
  { id:16, name:'Turmeric & Black Pepper Capsules',price:150, img:'images/Tumeric Kojic & Gluta Soap.jpg',      cat:'supplements', badge:'',            desc:'Powerful anti-inflammatory formula combining turmeric with black pepper for maximum absorption.' },
  { id:17, name:'Moringa Powder',                  price:120, img:'images/Gemini_Generated_Imag...yy8.png',     cat:'supplements', badge:'',            desc:'Organic Moringa oleifera leaf powder – a complete superfood rich in vitamins and antioxidants.' },
  { id:18, name:'Black Seed Oil',                  price:180, img:'',                                           cat:'oils',        badge:'',            desc:'Cold-pressed Nigella Sativa oil. Known as a powerful natural remedy across many traditions.' },
  { id:19, name:'Seamoss Capsules',                price:150, img:'',                                           cat:'seamoss',     badge:'Convenient',  desc:'Seamoss in easy-to-take capsule form. All the mineral benefits without the prep work.' },
  { id:20, name:"Lion's Mane Mushroom",            price:200, img:'',                                           cat:'supplements', badge:'Brain Health', desc:'Premium lion\'s mane mushroom extract for cognitive support, focus and mental clarity.' },
];

// ── CART STATE ─────────────────────────────────
let cart = JSON.parse(localStorage.getItem('mamosana_cart') || '[]');
let selectedPayment = 'payfast';
let checkoutPayment = 'payfast';

function saveCart(){ localStorage.setItem('mamosana_cart', JSON.stringify(cart)); }

// ── ADD TO CART ────────────────────────────────
function addToCart(id){
  const product = PRODUCTS.find(p => p.id === id);
  if(!product) return;
  const existing = cart.find(i => i.id === id);
  if(existing){ existing.qty++; } else { cart.push({...product, qty:1}); }
  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart`);
  openCart();
}

function changeQty(id, delta){
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function removeItem(id){
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

// ── UPDATE CART UI ─────────────────────────────
function updateCartUI(){
  const count = cart.reduce((s,i) => s + i.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => el.textContent = count);

  const itemsEl = document.getElementById('cartItems');
  if(!itemsEl) return;

  if(cart.length === 0){
    itemsEl.innerHTML = `<div class="cart-empty-msg">
      <i class="fas fa-shopping-bag"></i>
      <p>Your cart is empty.<br>Add some wellness products!</p>
    </div>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="ci-emoji">${item.img
          ? `<img src="${item.img}" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;" onerror="this.outerHTML='<div style=width:48px;height:48px;border-radius:8px;background:var(--green-pale);display:flex;align-items:center;justify-content:center><i class=fas fa-leaf style=color:var(--green);opacity:0.5></i></div>'">`
          : `<div style="width:48px;height:48px;border-radius:8px;background:var(--green-pale);display:flex;align-items:center;justify-content:center"><i class="fas fa-leaf" style="color:var(--green);opacity:0.5"></i></div>`}</div>
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">R${item.price} each</div>
          <div class="ci-controls">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)"><i class="fas fa-minus" style="font-size:0.65rem"></i></button>
            <span class="ci-qty">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)"><i class="fas fa-plus" style="font-size:0.65rem"></i></button>
            <button class="btn-remove" onclick="removeItem(${item.id})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>`).join('');
  }
  updateTotals();
}

function updateTotals(){
  const sub  = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const ship = parseInt(document.getElementById('shippingMethod')?.value || 0);
  const tot  = sub + ship;
  setText('cartSubtotal', `R${sub.toFixed(2)}`);
  setText('cartDelivery',  ship ? `R${ship.toFixed(2)}` : 'R0.00');
  setText('cartTotal',    `R${tot.toFixed(2)}`);
}

function setText(id, val){ const el=document.getElementById(id); if(el) el.textContent=val; }

// ── CART DRAWER ────────────────────────────────
function openCart(){
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCart(){
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow='';
}

function selectPayment(method){
  selectedPayment = method;
  document.getElementById('payOpt1')?.classList.toggle('active', method==='payfast');
  document.getElementById('payOpt2')?.classList.toggle('active', method==='payflex');
}

// ── CHECKOUT MODAL ─────────────────────────────
function openCheckout(){
  if(cart.length===0){ showToast('Your cart is empty!'); return; }
  closeCart();
  syncCheckoutDelivery();
  document.getElementById('checkoutModal')?.classList.add('open');
}
function closeCheckout(){ document.getElementById('checkoutModal')?.classList.remove('open'); }

function syncCheckoutDelivery(){
  const sub  = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const ship = parseInt(document.getElementById('co_delivery')?.value || 0);
  const tot  = sub + ship;
  setText('co_sub',   `R${sub.toFixed(2)}`);
  setText('co_del',    ship ? `R${ship.toFixed(2)}` : 'R0.00');
  setText('co_total', `R${tot.toFixed(2)}`);
}

function selectCheckoutPayment(method){
  checkoutPayment = method;
  document.getElementById('pm1')?.classList.toggle('active', method==='payfast');
  document.getElementById('pm2')?.classList.toggle('active', method==='payflex');
}

function placeOrder(){
  const fname   = document.getElementById('co_fname')?.value.trim();
  const email   = document.getElementById('co_email')?.value.trim();
  const address = document.getElementById('co_address')?.value.trim();
  const delivery= document.getElementById('co_delivery')?.value;
  if(!fname||!email||!address||!delivery||delivery==='0'){
    showToast('Please fill in all required fields'); return;
  }
  closeCheckout();
  document.getElementById('successModal')?.classList.add('open');
  cart=[];
  saveCart();
  updateCartUI();
}
function closeSuccess(){ document.getElementById('successModal')?.classList.remove('open'); }

// ── LIGHTBOX ───────────────────────────────────
function initLightbox(){
  if(document.getElementById('mamosanaLightbox')) return;

  // Inject HTML
  const lb = document.createElement('div');
  lb.id = 'mamosanaLightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Product image');
  lb.innerHTML = `
    <button id="lbClose" aria-label="Close image"><i class="fas fa-times"></i></button>
    <img id="lbImg" src="" alt="">
    <div id="lbCaption"></div>`;
  document.body.appendChild(lb);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #mamosanaLightbox {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(10,14,10,0.92);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 18px;
      cursor: zoom-out;
      padding: 20px;
    }
    #mamosanaLightbox.lb-open {
      display: flex;
      animation: lbFadeIn 0.28s ease both;
    }
    @keyframes lbFadeIn { from { opacity:0; } to { opacity:1; } }

    #lbImg {
      max-width: min(90vw, 700px);
      max-height: 80vh;
      object-fit: contain;
      border-radius: 14px;
      box-shadow: 0 32px 100px rgba(0,0,0,0.7);
      cursor: default;
      animation: lbZoom 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    @keyframes lbZoom {
      from { transform: scale(0.72); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }

    #lbCaption {
      color: rgba(255,255,255,0.7);
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.05rem;
      font-style: italic;
      letter-spacing: 0.04em;
      text-align: center;
      max-width: 500px;
    }

    #lbClose {
      position: absolute;
      top: 18px;
      right: 20px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      font-size: 1.1rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
      backdrop-filter: blur(4px);
      z-index: 1;
    }
    #lbClose:hover {
      background: rgba(255,255,255,0.26);
      transform: scale(1.12) rotate(90deg);
    }

    /* Zoom cursor hint on product images */
    .product-img img {
      cursor: zoom-in !important;
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1) !important;
    }
    .product-img img:hover {
      transform: scale(1.04) !important;
    }
  `;
  document.head.appendChild(style);

  // Close on backdrop click
  lb.addEventListener('click', function(e){
    if(e.target === lb) closeLightbox();
  });

  // Close button
  document.getElementById('lbClose').addEventListener('click', closeLightbox);

  // Escape key
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeLightbox();
  });
}

function openLightbox(src, caption){
  const lb  = document.getElementById('mamosanaLightbox');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCaption');
  if(!lb || !img) return;

  // Re-trigger zoom animation by cloning the img node
  img.style.animation = 'none';
  img.src = src;
  img.alt = caption || '';
  requestAnimationFrame(() => {
    img.style.animation = '';
  });

  if(cap) cap.textContent = caption || '';
  lb.classList.add('lb-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  document.getElementById('mamosanaLightbox')?.classList.remove('lb-open');
  document.body.style.overflow = '';
}

// ── PRODUCT IMAGE HELPER ───────────────────────
function productImageHTML(p){
  if(p.img){
    // Safely escape for inline onclick attribute
    const safeSrc  = p.img.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    const safeName = p.name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    return `<img src="${p.img}" alt="${p.name}"
      style="width:100%;height:100%;object-fit:cover;"
      onclick="openLightbox('${safeSrc}','${safeName}');event.stopPropagation();"
      onerror="this.style.cursor='default';this.onclick=null;this.outerHTML='<div style=width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:var(--green-wash)><i class=fas fa-leaf style=font-size:2.5rem;color:var(--green-mid);opacity:0.5></i><span style=font-size:0.7rem;color:var(--text-light);letter-spacing:0.05em>COMING SOON</span></div>'">`;
  }
  return `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:var(--green-wash)">
    <i class="fas fa-leaf" style="font-size:2.5rem;color:var(--green-mid);opacity:0.5"></i>
    <span style="font-size:0.7rem;color:var(--text-light);letter-spacing:0.05em">COMING SOON</span>
  </div>`;
}

// ── BADGE COLOR ────────────────────────────────
function badgeClass(badge){
  const goldBadges = ['Premium','Best Seller','New'];
  return goldBadges.includes(badge) ? 'product-badge gold' : 'product-badge';
}

// ── PRODUCT RENDERING (shop.html) ─────────────
function renderProducts(filter='all'){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  const list = filter==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===filter);
  grid.innerHTML = list.map(p => `
    <div class="product-card" data-cat="${p.cat}">
      <div class="product-img" style="${p.img ? 'padding:0;overflow:hidden;' : ''}">
        ${productImageHTML(p)}
        ${p.badge ? `<div class="${badgeClass(p.badge)}">${p.badge}</div>` : ''}
      </div>
      <div class="product-body">
        <div class="product-cat">${catLabel(p.cat)}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">R${p.price}</div>
          <button class="btn-cart" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i> Add</button>
        </div>
      </div>
    </div>`).join('');
}

function catLabel(c){ return {supplements:'Supplements',teas:'Teas & Infusions',oils:'Oils',seamoss:'Sea Moss'}[c]||c; }

function filterProducts(cat, btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ── FEATURED PRODUCTS (home.html) ─────────────
function renderFeatured(){
  const grid = document.getElementById('featuredGrid');
  if(!grid) return;
  const featured = PRODUCTS.filter(p=>p.badge).slice(0,6);
  grid.innerHTML = featured.map(p => `
    <div class="product-card">
      <div class="product-img" style="${p.img ? 'padding:0;overflow:hidden;' : ''}">
        ${productImageHTML(p)}
        <div class="${badgeClass(p.badge)}">${p.badge}</div>
      </div>
      <div class="product-body">
        <div class="product-cat">${catLabel(p.cat)}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">R${p.price}</div>
          <button class="btn-cart" onclick="addToCart(${p.id})"><i class="fas fa-plus"></i> Add</button>
        </div>
      </div>
    </div>`).join('');
}

// ── FORMS ──────────────────────────────────────
function submitBooking(e){
  e.preventDefault();
  showToast('Booking request sent! We\'ll confirm via email & WhatsApp shortly.');
  document.getElementById('successModal')?.classList.add('open');
  e.target.reset();
}
function submitContact(e){
  e.preventDefault();
  showToast('Message sent! We\'ll get back to you soon.');
  e.target.reset();
}

// ── TOAST ──────────────────────────────────────
function showToast(msg){
  const wrap = document.getElementById('toastWrap');
  if(!wrap) return;
  const t = document.createElement('div');
  t.className='toast';
  t.innerHTML=`<i class="fas fa-check-circle"></i><span>${msg}</span>`;
  wrap.appendChild(t);
  requestAnimationFrame(()=>{ requestAnimationFrame(()=>t.classList.add('show')); });
  setTimeout(()=>{
    t.classList.remove('show');
    setTimeout(()=>t.remove(), 400);
  }, 3200);
}

// ── MOBILE NAV ─────────────────────────────────
function toggleMobileNav(){
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  const isOpen = nav.classList.contains('open');
  nav.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

// ── HEADER SCROLL ──────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('siteHeader')?.classList.toggle('scrolled', window.scrollY>50);
});

// ── ACTIVE NAV LINK ────────────────────────────
function setActiveNav(){
  const page = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(a=>{
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if(href===page || (page===''&&href==='index.html')){ a.classList.add('active'); }
  });
}

// ── PRELOADER ──────────────────────────────────
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('preloader')?.classList.add('hide'), 700);
  initLightbox();
  updateCartUI();
  setActiveNav();
  renderProducts();
  renderFeatured();
});