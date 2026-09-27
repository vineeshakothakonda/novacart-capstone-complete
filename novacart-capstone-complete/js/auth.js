import { read, write, remove } from "./storage.js";

export function getUser() {
  return read("user", null);
}

export function signIn({name, email}) {
  const user = {name: name || email.split("@")[0], email, signedInAt: Date.now()};
  write("user", user);
  return user;
}

export function signOut() {
  remove("user");
}
