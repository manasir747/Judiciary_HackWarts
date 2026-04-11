import { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";

const steps = [
  "Initializing Agentic Reasoners...",
  "Extracting Jurisdictional Facts...",
  "Running Legal Semantic Hub...",
  "Verifying Simplified Output...",
  "Finalizing Judicial Insights...",
];

export function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl premium-glass p-12 text-center animate-fadeIn shadow-premium">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="h-6 w-6 text-primary animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-bold text-white tracking-tight">Legal Intelligence at Work</h2>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-[0.2em]">{steps[stepIndex]}</p>
      </div>
      
      <div className="h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-slate-900 border border-white/5">
        <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
      </div>
    </div>
  );
}
