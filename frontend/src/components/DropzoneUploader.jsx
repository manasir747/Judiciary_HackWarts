import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, Loader2 } from "lucide-react";
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
    <div className="mx-auto mt-10 w-full max-w-3xl animate-fadeIn">
      <h1 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
        Understand any legal document in plain English
      </h1>
      <p className="mb-8 text-center text-slate-500">Upload a PDF to generate clear legal insights in seconds.</p>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-card border-2 border-dashed p-10 text-center transition ${
          isDragActive ? "border-primary bg-indigo-50" : "border-border bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-primary">
          <FileUp className="h-7 w-7" />
        </div>
        <p className="text-base font-semibold text-text">Drag & drop your PDF here</p>
        <p className="mt-1 text-sm text-slate-500">PDF only, up to 10MB</p>
        {file ? <p className="mt-3 text-sm font-medium text-primary">Selected: {file.name}</p> : null}
      </div>

      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          onClick={handleAnalyse}
          disabled={loading}
          className="w-full bg-primary text-white hover:bg-indigo-500 sm:w-auto"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Analyse Document
        </Button>
        <a
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Try sample document
        </a>
      </div>
    </div>
  );
}
