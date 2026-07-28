"use client";

import { useState, useRef } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  allowedFormats: string[];
  maxSizeMB?: number;
}

export default function FileUploader({
  onFileSelect,
  allowedFormats,
  maxSizeMB = 100
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setErrorMsg('');
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedFormats.includes(extension)) {
      setErrorMsg(`Invalid format. Allowed formats: ${allowedFormats.join(', ')}`);
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File size exceeds limit (${maxSizeMB}MB).`);
      return false;
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUploadProgress = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onFileSelect(file), 0);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        simulateUploadProgress(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        simulateUploadProgress(file);
      }
    }
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setErrorMsg('');
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-xl text-red-400 text-sm flex gap-2 items-center">
          <AlertCircle className="h-5 w-5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center gap-4 ${
            dragActive 
              ? 'border-violet-500 bg-violet-950/10' 
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={allowedFormats.join(',')}
            onChange={handleFileInput}
          />
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-full text-slate-400">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div>
            <p className="font-semibold text-white">Drag & drop your file here, or browse</p>
            <p className="text-xs text-slate-500 mt-1">
              Supports: {allowedFormats.join(', ')} (Max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-violet-500">
                <File className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-white truncate max-w-[250px]">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            
            {uploadProgress === 100 ? (
              <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Ready
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-semibold">{uploadProgress}%</span>
            )}
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-violet-600 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          {uploadProgress === 100 && (
            <button
              onClick={resetUploader}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors self-end"
            >
              Upload another file
            </button>
          )}
        </div>
      )}
    </div>
  );
}
