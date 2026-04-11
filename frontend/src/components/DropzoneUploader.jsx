import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, Loader2, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";

import { analyseDocument } from "../lib/api";
import { useLexStore } from "../store/useLexStore";
import { Button } from "./ui/button";

const MAX_SIZE = 10 * 1024 * 1024;

export function DropzoneUploader() {
  const { file, setFile, setLoading, setAnalysis, resetForNewFile, loading } = useLexStore();

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (fileRejections.length) {
        toast.error("Upload a PDF under 10MB.");
        return;
      }
      const selected = acceptedFiles[0];
      if (selected) {
        resetForNewFile();
        setFile(selected);
      }
    },
    [setFile, resetForNewFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: MAX_SIZE,
  });

  async function handleAnalyse() {
    if (!file) {
      toast.error("Please upload a PDF first.");
      return;
    }

    try {
      setLoading(true);
      const response = await analyseDocument(file);
      setAnalysis(response);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        (error?.code === "ERR_NETWORK" ? "Cannot reach backend API on port 8000." : "Unable to analyse document.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full animate-fadeIn">
      <div
        {...getRootProps()}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragActive 
            ? "border-primary bg-primary/5 shadow-[0_0_30px_rgba(148,163,184,0.1)]" 
            : "border-slate-800 bg-black/40 hover:border-slate-700 hover:bg-black/60"
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-primary transition-transform duration-300 group-hover:scale-110 premium-border ${isDragActive ? 'animate-bounce' : ''}`}>
            <FileUp className="h-8 w-8" />
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-medium text-white">
              {isDragActive ? "Drop your document" : "Secure Document Intake"}
            </p>
            <p className="text-sm text-slate-500">
              PDF only, maximum 10MB
            </p>
          </div>

          {file && (
            <div className="mt-2 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 animate-fadeIn">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary truncate max-w-[200px]">
                {file.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <Button
          onClick={handleAnalyse}
          disabled={loading || !file}
          className={`h-14 w-full rounded-xl bg-white px-8 font-bold text-black transition-all duration-300 hover:bg-slate-200 disabled:opacity-50 sm:w-auto ${loading ? 'px-12' : ''}`}
        >
          {loading ? (
            <div className="flex items-center gap-3 font-semibold">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing Agentic Logic...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Examine Document</span>
            </div>
          )}
        </Button>
        
        {!loading && (
          <p className="text-center text-[10px] uppercase tracking-widest text-slate-600 font-bold">
            Encrypted & Secure Processing
          </p>
        )}
      </div>
    </div>
  );
}
