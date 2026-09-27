const PREFIX = "novacart:";

export function read(key, fallback) {
  try {
    const value = localStorage.getItem(PREFIX + key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function remove(key) {
  localStorage.removeItem(PREFIX + key);
}
