import React from "react";
import { MoveRight, ShieldCheck, Scale } from "lucide-react";
import heroImg from "../assets/hero-bg.png";

export function Hero({ children }) {
  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden bg-secondary">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-right bg-no-repeat opacity-60 md:bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
      
      {/* Content */}
      <div className="relative z-20 mx-auto grid min-h-[90vh] max-w-7xl grid-cols-1 items-center px-4 pt-32 pb-12 sm:px-6 lg:px-8 lg:grid-cols-2">
        <div className="animate-fadeIn">
          <div className="mb-6 flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-widest uppercase">Agentic AI Legal Intelligence</span>
          </div>
          
          <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl">
            Clarity in every <span className="italic text-primary">clause.</span>
          </h1>
          
          <p className="mb-10 max-w-lg text-lg text-slate-400 sm:text-xl">
            Upload complex legal documents and receive AI-powered summaries, 
            timeline predictions, and clear-language insights in seconds.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

          <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">99%</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Fast Processing</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">Agentic</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Multi-Model Logic</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">Secure</span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Private Analysis</span>
            </div>
          </div>
        </div>
        
        {/* Empty space for the Lady Justice statue on the right of the background */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}
