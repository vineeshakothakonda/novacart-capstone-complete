import { fetchProducts, createProduct, updateProduct, deleteProduct } from "./api.js";
import { state, allProducts, addToCart, changeQuantity, cartCount, cartTotal, persistCustomProducts, persistDeletedIds } from "./state.js";
import { getUser, signIn, signOut } from "./auth.js";
import { $, showToast, renderSkeleton, renderStore, renderAdmin, renderCart } from "./ui.js";

const authModal = $("#auth-modal");
const productModal = $("#product-modal");
const cartDrawer = $("#cart-drawer");

function filteredProducts() {
  let products = allProducts();
  if (state.category !== "all") products = products.filter(p => p.category === state.category);
  const q = state.query.trim().toLowerCase();
  if (q) products = products.filter(p => `${p.title} ${p.description} ${p.category}`.toLowerCase().includes(q));
  if (state.sort === "price-asc") products.sort((a,b) => a.price - b.price);
  if (state.sort === "price-desc") products.sort((a,b) => b.price - a.price);
  if (state.sort === "rating") products.sort((a,b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
  if (state.sort === "name") products.sort((a,b) => a.title.localeCompare(b.title));
  return products;
}

function updateHeader() {
  $("#cart-count").textContent = cartCount();
  $("#account-btn").textContent = state.user ? `Hi, ${state.user.name}` : "Account";
}

function render() {
  updateHeader();
  if (location.hash === "#/admin") renderAdmin(allProducts());
  else renderStore(filteredProducts(), state);
}

function openAuth() {
  $("#auth-name").value = state.user?.name || "";
  $("#auth-email").value = state.user?.email || "";
  $("#auth-title").textContent = state.user ? "Account" : "Sign in";
  $("#auth-submit").textContent = state.user ? "Save account" : "Sign in";
  $("#toggle-auth").textContent = state.user ? "Sign out" : "Create an account";
  authModal.showModal();
}

function openProduct(product = null) {
  $("#product-modal-title").textContent = product ? "Edit product" : "Add product";
  $("#product-id").value = product?.id ?? "";
  $("#product-title").value = product?.title ?? "";
  $("#product-price").value = product?.price ?? "";
  $("#product-category").value = product?.category ?? "electronics";
  $("#product-image").value = product?.image ?? "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
  $("#product-description").value = product?.description ?? "";
  productModal.showModal();
}

function saveProductFromForm() {
  return {
    title: $("#product-title").value.trim(),
    price: Number($("#product-price").value),
    category: $("#product-category").value,
    image: $("#product-image").value.trim(),
    description: $("#product-description").value.trim(),
    rating: { rate: 4.5, count: 0 }
  };
}

async function load() {
  $("#app").innerHTML = `<section class="loading">${renderSkeleton()}</section>`;
  try {
    state.products = await fetchProducts();
  } catch (error) {
    state.error = error.message;
    state.products = [];
    showToast("Live API unavailable. Local catalog is still usable.", "error");
  } finally {
    state.loading = false;
    render();
  }
}

document.addEventListener("click", async e => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const product = allProducts().find(p => String(p.id) === String(add.dataset.add));
    if (product) { addToCart(product); updateHeader(); renderCart(state.cart, cartTotal()); showToast("Added to cart"); }
  }

  const category = e.target.closest("[data-category]");
  if (category) { state.category = category.dataset.category; render(); }

  if (e.target.id === "account-btn") openAuth();
  if (e.target.id === "cart-btn") { renderCart(state.cart, cartTotal()); cartDrawer.classList.add("open"); $("#drawer-backdrop").classList.add("show"); }
  if (e.target.id === "close-cart" || e.target.id === "drawer-backdrop") { cartDrawer.classList.remove("open"); $("#drawer-backdrop").classList.remove("show"); }

  const qty = e.target.closest("[data-qty]");
  if (qty) { changeQuantity(qty.dataset.qty, Number(qty.dataset.delta)); updateHeader(); renderCart(state.cart, cartTotal()); }

  if (e.target.id === "checkout-btn") {
    if (!state.cart.length) return showToast("Your cart is empty.", "error");
    state.cart = []; localStorage.setItem("novacart:cart", "[]");
    updateHeader(); renderCart(state.cart, 0); showToast("Demo order placed successfully!");
  }

  if (e.target.id === "new-product") openProduct();

  const edit = e.target.closest("[data-edit]");
  if (edit) openProduct(allProducts().find(p => String(p.id) === String(edit.dataset.edit)));

  const del = e.target.closest("[data-delete]");
  if (del) {
    const id = Number(del.dataset.delete);
    if (!confirm("Delete this product from the local catalog?")) return;
    try { await deleteProduct(id); } catch {}
    state.customProducts = state.customProducts.filter(p => Number(p.id) !== id);
    if (state.products.some(p => Number(p.id) === id)) state.deletedIds.push(id);
    persistCustomProducts(); persistDeletedIds(); render(); showToast("Product deleted");
  }
});

document.addEventListener("input", e => {
  if (e.target.id === "search") { state.query = e.target.value; renderStore(filteredProducts(), state); }
});

document.addEventListener("change", e => {
  if (e.target.id === "sort") { state.sort = e.target.value; renderStore(filteredProducts(), state); }
});

$("#auth-form").addEventListener("submit", e => {
  e.preventDefault();
  state.user = signIn({name: $("#auth-name").value.trim(), email: $("#auth-email").value.trim()});
  authModal.close(); updateHeader(); showToast(`Welcome, ${state.user.name}!`);
});

$("#toggle-auth").addEventListener("click", () => {
  if (state.user) { signOut(); state.user = null; authModal.close(); updateHeader(); showToast("Signed out"); }
  else { $("#auth-title").textContent = "Create account"; $("#auth-submit").textContent = "Create account"; $("#toggle-auth").style.display = "none"; }
});

$("#product-form").addEventListener("submit", async e => {
  e.preventDefault();
  const data = saveProductFromForm();
  const id = $("#product-id").value;

  try {
    if (id) {
      await updateProduct(id, data).catch(() => null);
      const index = state.customProducts.findIndex(p => String(p.id) === String(id));
      if (index >= 0) state.customProducts[index] = {...state.customProducts[index], ...data};
      else {
        state.deletedIds = state.deletedIds.filter(x => Number(x) !== Number(id));
        state.customProducts.push({id: Number(id), ...data});
      }
      showToast("Product updated");
    } else {
      const created = await createProduct(data).catch(() => ({id: `local-${Date.now()}`}));
      state.customProducts.push({id: created.id ?? `local-${Date.now()}`, ...data});
      showToast("Product created");
    }
    persistCustomProducts(); persistDeletedIds(); productModal.close(); render();
  } catch (error) {
    showToast("Could not save product.", "error");
  }
});

window.addEventListener("hashchange", render);

state.user = getUser();
updateHeader();
load();
