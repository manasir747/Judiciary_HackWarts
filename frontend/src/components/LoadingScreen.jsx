import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const steps = [
  "Reading document...",
  "Extracting legal points...",
  "Building summary...",
  "Almost ready...",
];

export function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 1300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto mt-12 flex w-full max-w-3xl flex-col items-center gap-5 rounded-card border border-border bg-white p-10 text-center shadow-soft animate-fadeIn">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <h2 className="text-xl font-semibold text-text">Analysing your legal document</h2>
      <p className="text-sm text-slate-500">{steps[stepIndex]}</p>
    </div>
  );
}
