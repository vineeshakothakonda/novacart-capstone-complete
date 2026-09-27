import { read, write } from "./storage.js";

export const state = {
  products: [],
  query: "",
  category: "all",
  sort: "featured",
  cart: read("cart", []),
  customProducts: read("customProducts", []),
  deletedIds: read("deletedIds", []),
  user: null,
  loading: true,
  error: ""
};

export function persistCart() { write("cart", state.cart); }
export function persistCustomProducts() { write("customProducts", state.customProducts); }
export function persistDeletedIds() { write("deletedIds", state.deletedIds); }

export function allProducts() {
  return [
    ...state.products.filter(p => !state.deletedIds.includes(Number(p.id))),
    ...state.customProducts
  ];
}

export function addToCart(product) {
  const item = state.cart.find(x => Number(x.id) === Number(product.id));
  if (item) item.quantity += 1;
  else state.cart.push({
    id: product.id, title: product.title, price: Number(product.price),
    image: product.image, quantity: 1
  });
  persistCart();
}

export function changeQuantity(id, delta) {
  const item = state.cart.find(x => Number(x.id) === Number(id));
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) state.cart = state.cart.filter(x => Number(x.id) !== Number(id));
  persistCart();
}

export function cartCount() {
  return state.cart.reduce((sum, x) => sum + x.quantity, 0);
}

export function cartTotal() {
  return state.cart.reduce((sum, x) => sum + x.price * x.quantity, 0);
}
