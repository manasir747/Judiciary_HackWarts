import React from "react";
import { MoveRight, ShieldCheck, Scale } from "lucide-react";
import { ShaderBackground } from "./ui/shaders-hero-section";

export function Hero({ children }) {
  return (
      <div className="relative min-h-screen w-full overflow-hidden">
        
        {/* Content */}
        <div className="relative z-20 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 pt-32 pb-12 sm:px-6 lg:px-8 text-center">
          <div className="animate-fadeIn w-full flex flex-col items-center">
            <div className="mb-6 flex items-center justify-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-widest uppercase">Agentic AI Legal Intelligence</span>
            </div>
            
            <h1 className="mb-6 instrument text-5xl font-light leading-tight text-white sm:text-6xl md:text-7xl">
              <span className="italic font-normal">Clarity</span> in every<br/>
              <span className="font-light tracking-tight text-white">clause.</span>
            </h1>
            
            <p className="mb-10 max-w-lg mx-auto text-lg text-slate-300 sm:text-xl font-light">
              Upload complex legal documents and receive AI-powered summaries, 
              timeline predictions, and clear-language insights in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row sm:justify-center w-full max-w-md mx-auto">
              <div className="w-full">
                {children}
              </div>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 border-t border-white/10 pt-8">
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
        </div>
      </div>
  );
}
