import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};
import { Toaster, toast } from "sonner";

import { AuthPage } from "./components/AuthPage";
import { Header, ShaderBackground } from "./components/ui/shaders-hero-section";
import { Hero } from "./components/Hero";
import { DropzoneUploader } from "./components/DropzoneUploader";
import { LoadingScreen } from "./components/LoadingScreen";
import { SummaryPanel } from "./components/SummaryPanel";
import { TimelinePanel } from "./components/TimelinePanel";
import { RiskPanel } from "./components/RiskPanel";
import { StrategyPanel } from "./components/StrategyPanel";
import { SimulationPanel } from "./components/SimulationPanel";
import { ChatPanel } from "./components/ChatPanel";
import { useLexStore } from "./store/useLexStore";
import { getSession, signOut } from "./lib/auth";

const isProd =
  import.meta.env.PROD ||
  (typeof process !== "undefined" && process?.env?.NODE_ENV === "production");

const AgentLoader = ({ waitingOn, target, delay }) => (
  <div className="premium-glass h-full p-6 animate-fadeIn transition-all duration-300 flex flex-col items-center justify-center text-center font-serif text-slate-500" style={{ animationDelay: delay }}>
    <div className="relative mb-4 h-12 w-12 text-primary/50 mx-auto">
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_3s_linear_infinite]" />
      <div className="absolute inset-2 rounded-full border border-primary/40 border-t-transparent animate-[spin_1.5s_linear_infinite_reverse]" />
      <div className="absolute inset-4 rounded-full border border-primary/60 animate-pulseDots" />
    </div>
    <p className="text-[10px] uppercase tracking-widest font-bold text-primary/80 mb-2">{target} Idle</p>
    <p className="text-sm font-light">Awaiting payload string from <span className="text-white font-medium">{waitingOn}</span>...</p>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [agentStep, setAgentStep] = useState(0);
  const { loading, analysis, originalLanguage, toggleOriginalLanguage } = useLexStore();

  useEffect(() => {
    async function bootstrapSession() {
      try {
        const session = await getSession();
        setIsAuthenticated(Boolean(session));
      } catch {
        setIsAuthenticated(false);
      }
    }

    bootstrapSession();
  }, []);

  useEffect(() => {
    const route = window.location.pathname;
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (route === "/dashboard" && !isLoggedIn) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (analysis && !loading) {
       const timers = [
         setTimeout(() => setAgentStep(1), 1200), // Summary to Timeline
         setTimeout(() => setAgentStep(2), 2600), // Timeline to Strategy
         setTimeout(() => setAgentStep(3), 4000), // Strategy to Chat
         setTimeout(() => setAgentStep(4), 4800), // All complete
       ];
       return () => timers.forEach(clearTimeout);
    } else {
       setAgentStep(0);
    }
  }, [analysis, loading]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await signOut();
      setIsAuthenticated(false);
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(error?.message || "Unable to log out.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onContinue={() => setIsAuthenticated(true)} />
        <Toaster theme="dark" richColors position="top-right" />
      </>
    );
  }

  const showHero = !analysis && !loading;

  return (
    <ShaderBackground theme={showHero ? "bronze" : "deepSpace"}>
      <div className="min-h-screen text-white selection:bg-primary/30 selection:text-white relative z-10 w-full overflow-y-auto">
        <Header onLogout={handleLogout} isLoggingOut={isLoggingOut} />
        
        {showHero && (
          <Hero>
            {isProd ? (
              <p className="mb-4 text-center text-xs text-slate-400">Feature available in full version</p>
            ) : null}
            <DropzoneUploader />
          </Hero>
        )}

        <main className={`mx-auto w-full transition-all duration-700 ${analysis && !loading ? 'max-w-7xl opacity-100 py-32' : 'max-w-3xl'}`}>
          {loading ? (
            <div className="pt-40">
              <LoadingScreen />
            </div>
          ) : null}

          {analysis && !loading ? (
            <div className="px-4 sm:px-6 lg:px-8 animate-fadeIn mt-8">
              <div className="mb-12 border-b border-white/5 pb-8 relative z-20 flex justify-between items-end">
                <div>
                  <h2 className="font-serif text-5xl font-bold text-white mb-4 drop-shadow-xl">Analysis Results</h2>
                  <p className="text-white/60 text-lg">Live agentic execution pipeline. Agents are routing logic payload.</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className={agentStep < 4 ? "animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" : "hidden"}></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {agentStep < 4 ? "ROUTING PAYLOADS" : "AGENTS IDLE"}
                  </span>
                </div>
              </div>
              
              <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 relative z-20">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <SummaryPanel
                    analysis={analysis}
                    originalLanguage={originalLanguage}
                    onToggle={toggleOriginalLanguage}
                  />
                </motion.div>

                {agentStep >= 1 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <TimelinePanel analysis={analysis} />
                  </motion.div>
                ) : <AgentLoader waitingOn="Analyst Agent" target="Timeline Agent" />}
                
                {agentStep >= 1 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <RiskPanel risks={analysis.risks} />
                  </motion.div>
                ) : <AgentLoader waitingOn="Analyst Agent" target="Risk Assessment Agent" delay="100ms" />}

                {agentStep >= 2 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <StrategyPanel strategy={analysis.strategy} />
                  </motion.div>
                ) : <AgentLoader waitingOn="Risk Assembly" target="Strategy Agent" delay="200ms" />}

                {agentStep >= 2 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <SimulationPanel simulations={analysis.simulations} />
                  </motion.div>
                ) : <AgentLoader waitingOn="Strategy Router" target="Simulation Engine" delay="300ms" />}

                {agentStep >= 3 ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <ChatPanel />
                  </motion.div>
                ) : <AgentLoader waitingOn="Pipeline Finalization" target="Conversational Agent" delay="400ms" />}
              </section>
            </div>
          ) : null}
        </main>

        <Toaster 
          theme="dark" 
          richColors 
          position="top-right" 
          toastOptions={{
            style: { background: 'rgba(11, 15, 26, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(148, 163, 184, 0.1)', color: '#F8FAFC' }
          }}
        />
      </div>
    </ShaderBackground>
  );
}
