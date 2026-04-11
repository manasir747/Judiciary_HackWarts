import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "./ui/button";
import { signIn, signUp } from "../lib/auth";

export function AuthPage({ onContinue }) {
  const [mode, setMode] = useState("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const isSignUp = mode === "signUp";
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.email || !form.password || (isSignUp && !form.name)) {
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const data = await signUp(form.email, form.password);
        if (data.session) {
          toast.success("Account created successfully.");
          onContinue();
        } else {
          toast.success("Account created. Please check your email to verify your account.");
        }
      } else {
        await signIn(form.email, form.password);
        toast.success("Signed in successfully.");
        onContinue();
      }
    } catch (error) {
      toast.error(error?.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-secondary px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.9),transparent_36%)]" />
      <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] h-80 w-80 rounded-full bg-slate-800/60 blur-3xl" />

      <div className="premium-glass relative z-10 w-full max-w-md rounded-[2rem] p-8 shadow-2xl shadow-black/30">
        <div className="premium-border mb-6 inline-flex rounded-full bg-slate-950/50 p-1">
          <button
            type="button"
            onClick={() => setMode("signIn")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !isSignUp ? "bg-white text-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signUp")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isSignUp ? "bg-white text-black" : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="mb-6 flex items-center gap-2 text-primary">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/90">
            Secure Workspace Access
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-white">
            {isSignUp ? "Create your account" : "Sign in to LexAI"}
          </h1>
          <p className="text-sm leading-6 text-slate-400">
            {isSignUp
              ? "Create access to enter the legal intelligence workspace."
              : "Continue to your legal intelligence workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {isSignUp ? (
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Full Name
              </span>
              <div className="premium-border flex items-center gap-3 rounded-2xl bg-slate-950/70 px-4">
                <UserRound className="h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-600"
                />
              </div>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Work Email
            </span>
            <div className="premium-border flex items-center gap-3 rounded-2xl bg-slate-950/70 px-4">
              <Mail className="h-4 w-4 text-slate-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="counsel@firm.com"
                className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Password
            </span>
            <div className="premium-border flex items-center gap-3 rounded-2xl bg-slate-950/70 px-4">
              <LockKeyhole className="h-4 w-4 text-slate-500" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={isSignUp ? "Create a password" : "Enter your password"}
                className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </label>

          <Button
            type="submit"
            disabled={isLoading || !form.email || !form.password || (isSignUp && !form.name)}
            className="mt-2 h-14 w-full rounded-2xl bg-white text-sm font-bold text-black hover:bg-slate-200"
          >
            <span>
              {isLoading
                ? isSignUp
                  ? "Creating account..."
                  : "Signing in..."
                : isSignUp
                  ? "Create Account"
                  : "Enter Workspace"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}