import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Info, Shield, Phone, LogOut } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { label: "How it works", icon: Info },
  { label: "Security", icon: Shield },
  { label: "Contact", icon: Phone },
];

const LABEL_WIDTH = 96;

export function Navbar({ onLogout, isLoggingOut = false }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="absolute top-0 z-50 w-full border-b border-white/5 bg-transparent backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-2.5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary premium-border">
            <Scale className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-white leading-none">LexAI</span>
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Intelligence</span>
          </div>
        </div>

        {/* Animated pill nav — same style as BottomNavBar */}
        <motion.nav
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.1 }}
          role="navigation"
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-2 py-1.5 shadow-lg"
        >
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeIndex === idx;

            return (
              <motion.button
                key={item.label}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveIndex(isActive ? null : idx)}
                className={cn(
                  "flex items-center px-3 py-1.5 rounded-full transition-colors duration-200 h-9 min-w-[36px] gap-0",
                  isActive
                    ? "bg-primary/15 text-primary gap-2"
                    : "bg-transparent text-slate-400 hover:text-white hover:bg-white/5",
                  "focus:outline-none"
                )}
                type="button"
                aria-label={item.label}
              >
                <Icon size={16} strokeWidth={2} aria-hidden className="shrink-0" />

                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? `${LABEL_WIDTH}px` : "0px",
                    opacity: isActive ? 1 : 0,
                    marginLeft: isActive ? "6px" : "0px",
                  }}
                  transition={{
                    width: { type: "spring", stiffness: 350, damping: 32 },
                    opacity: { duration: 0.15 },
                    marginLeft: { duration: 0.15 },
                  }}
                  className="overflow-hidden flex items-center"
                >
                  <span className="text-xs font-semibold whitespace-nowrap select-none text-primary">
                    {item.label}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}
        </motion.nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <p className="hidden text-sm font-medium text-slate-500 sm:block tracking-wide italic">
            Legal Clarity for Everyone
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </motion.button>
        </div>

      </div>
    </motion.header>
  );
}
