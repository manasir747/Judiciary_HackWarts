import { useEffect, useState } from "react";
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
              <div className="mb-12 border-b border-white/5 pb-8 relative z-20">
                <h2 className="font-serif text-5xl font-bold text-white mb-4 drop-shadow-xl">Analysis Results</h2>
                <p className="text-white/60 text-lg">Agentic multi-agent reasoning complete. Review your legal insights below.</p>
              </div>
              
              <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 relative z-20">
                <SummaryPanel
                  analysis={analysis}
                  originalLanguage={originalLanguage}
                  onToggle={toggleOriginalLanguage}
                />
                <TimelinePanel analysis={analysis} />
                <RiskPanel risks={analysis.risks} />
                <StrategyPanel strategy={analysis.strategy} />
                <SimulationPanel simulations={analysis.simulations} />
                <ChatPanel />
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
