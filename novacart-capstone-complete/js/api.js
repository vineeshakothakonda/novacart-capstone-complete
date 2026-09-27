const API_URL = "https://fakestoreapi.com/products";

export async function fetchProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`Products request failed (${response.status})`);
  return response.json();
}

// Fake Store API supports mutations for demonstration.
// The API may not persist changes permanently, so app state also stores mutations locally.
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

export const createProduct = product => request(API_URL, {
  method: "POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify(product)
});

export const updateProduct = (id, product) => request(`${API_URL}/${id}`, {
  method: "PUT",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify(product)
});

export const deleteProduct = id => request(`${API_URL}/${id}`, { method: "DELETE" });
