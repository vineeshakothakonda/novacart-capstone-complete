export const $ = selector => document.querySelector(selector);

const escapeHTML = value => String(value).replace(/[&<>"']/g, c =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[c]);

export function showToast(message, type="success") {
  const toast = $("#toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.className = "toast", 2800);
}

export function renderSkeleton() {
  return Array.from({length:8}, () => '<article class="skeleton-card"><div></div><i></i><i></i><b></b></article>').join("");
}

export function renderStore(products, state) {
  const app = $("#app");
  const categories = ["all", ...new Set(products.map(p => p.category))];
  const categoryButtons = categories.map(c =>
    `<button class="chip ${state.category === c ? "active" : ""}" data-category="${escapeHTML(c)}">${c === "all" ? "All" : escapeHTML(c)}</button>`
  ).join("");

  const cards = products.map(p => `
    <article class="product-card">
      <div class="product-image"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" loading="lazy"></div>
      <div class="product-body">
        <span class="tag">${escapeHTML(p.category)}</span>
        <h3>${escapeHTML(p.title)}</h3>
        <p class="rating">★ ${Number(p.rating?.rate ?? 0).toFixed(1)} <span>(${Number(p.rating?.count ?? 0)})</span></p>
        <div class="card-bottom"><strong>$${Number(p.price).toFixed(2)}</strong><button class="primary small" data-add="${p.id}">Add</button></div>
      </div>
    </article>`).join("");

  app.innerHTML = `
    <section class="hero">
      <div><p class="eyebrow">CAPSTONE STORE</p><h1>Everything you need,<br><em>in one place.</em></h1><p>Discover a responsive storefront powered by live REST data, client state, CRUD workflows and persistent storage.</p></div>
      <div class="hero-badge"><strong>LIVE</strong><span>API Catalog</span></div>
    </section>
    <section class="toolbar">
      <div class="search"><span>⌕</span><input id="search" value="${escapeHTML(state.query)}" placeholder="Search products..."></div>
      <select id="sort"><option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating">Top Rated</option><option value="name">Name A–Z</option></select>
    </section>
    <div class="chips">${categoryButtons}</div>
    <div class="section-title"><div><p class="eyebrow">COLLECTION</p><h2>Featured products</h2></div><span>${products.length} items</span></div>
    <section class="product-grid">${cards || '<div class="empty">No products match your filters.</div>'}</section>`;
}

export function renderAdmin(products) {
  $("#app").innerHTML = `
    <section class="admin-head"><div><p class="eyebrow">MANAGEMENT</p><h1>Product Admin</h1><p class="muted">Create, edit and delete catalog items. Changes are cached locally.</p></div><button id="new-product" class="primary">+ Add Product</button></section>
    <section class="admin-table">
      <div class="table-row table-head"><span>Product</span><span>Category</span><span>Price</span><span>Actions</span></div>
      ${products.map(p => `<div class="table-row"><span class="product-cell"><img src="${escapeHTML(p.image)}" alt=""><b>${escapeHTML(p.title)}</b></span><span>${escapeHTML(p.category)}</span><span>$${Number(p.price).toFixed(2)}</span><span class="actions"><button data-edit="${p.id}">Edit</button><button class="danger" data-delete="${p.id}">Delete</button></span></div>`).join("")}
    </section>`;
}

export function renderCart(cart, total) {
  const box = $("#cart-items");
  box.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item"><img src="${escapeHTML(item.image)}" alt=""><div><b>${escapeHTML(item.title)}</b><p>$${item.price.toFixed(2)}</p><div class="qty"><button data-qty="${item.id}" data-delta="-1">−</button><span>${item.quantity}</span><button data-qty="${item.id}" data-delta="1">+</button></div></div></div>
  `).join("") : '<p class="muted empty-cart">Your cart is empty.</p>';
  $("#cart-total").textContent = `$${total.toFixed(2)}`;
}
