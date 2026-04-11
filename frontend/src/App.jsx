import { Toaster } from "sonner";

import { Navbar } from "./components/Navbar";
import { DropzoneUploader } from "./components/DropzoneUploader";
import { LoadingScreen } from "./components/LoadingScreen";
import { SummaryPanel } from "./components/SummaryPanel";
import { TimelinePanel } from "./components/TimelinePanel";
import { ChatPanel } from "./components/ChatPanel";
import { useLexStore } from "./store/useLexStore";

export default function App() {
  const { loading, analysis, originalLanguage, toggleOriginalLanguage } = useLexStore();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!analysis && !loading ? <DropzoneUploader /> : null}
        {loading ? <LoadingScreen /> : null}

        {analysis && !loading ? (
          <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <SummaryPanel
              analysis={analysis}
              originalLanguage={originalLanguage}
              onToggle={toggleOriginalLanguage}
            />
            <TimelinePanel analysis={analysis} />
            <ChatPanel />
          </section>
        ) : null}
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
