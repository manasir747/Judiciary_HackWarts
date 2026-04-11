import { useState } from "react";
import { Toaster } from "sonner";

import { AuthPage } from "./components/AuthPage";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { DropzoneUploader } from "./components/DropzoneUploader";
import { LoadingScreen } from "./components/LoadingScreen";
import { SummaryPanel } from "./components/SummaryPanel";
import { TimelinePanel } from "./components/TimelinePanel";
import { ChatPanel } from "./components/ChatPanel";
import { useLexStore } from "./store/useLexStore";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { loading, analysis, originalLanguage, toggleOriginalLanguage } = useLexStore();

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
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-white">
      <Navbar />
      
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
          <div className="px-4 sm:px-6 lg:px-8 animate-fadeIn">
            <div className="mb-12 border-b border-white/5 pb-8">
              <h2 className="font-serif text-4xl font-bold text-white mb-2">Analysis Results</h2>
              <p className="text-slate-400">Agentic multi-agent reasoning complete. Review your legal insights below.</p>
            </div>
            
            <section className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              <SummaryPanel
                analysis={analysis}
                originalLanguage={originalLanguage}
                onToggle={toggleOriginalLanguage}
              />
              <TimelinePanel analysis={analysis} />
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
          style: { background: '#0B0F1A', border: '1px solid #1E293B', color: '#F8FAFC' }
        }}
      />
    </div>
  );
}
