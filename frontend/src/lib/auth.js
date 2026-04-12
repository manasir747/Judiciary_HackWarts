import { supabase } from "./supabase";

const isProd =
  import.meta.env.PROD ||
  (typeof process !== "undefined" && process?.env?.NODE_ENV === "production");

function setLocalAuth(email) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("user", email || "demo@local");
}

function clearLocalAuth() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
}

function getLocalSession() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    return null;
  }

  const email = localStorage.getItem("user") || "demo@local";
  return {
    user: {
      id: email,
      email,
    },
  };
}

export async function signUp(email, password) {
  if (isProd || !supabase) {
    setLocalAuth(email);
    return { session: getLocalSession() };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data?.session) {
    setLocalAuth(email);
  }

  return data;
}

export async function signIn(email, password) {
  if (isProd || !supabase) {
    setLocalAuth(email);
    return { session: getLocalSession() };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  setLocalAuth(email);

  return data;
}

export async function signOut() {
  clearLocalAuth();

  if (isProd || !supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  const local = getLocalSession();
  if (local) {
    return local.user;
  }

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export async function getSession() {
  const local = getLocalSession();
  if (local) {
    return local;
  }

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}
