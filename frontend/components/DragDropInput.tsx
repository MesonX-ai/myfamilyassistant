/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { parseFile, validateFile } from "@/lib/fileUploadParser";

interface DragDropInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onFileProcessing?: (isProcessing: boolean) => void;
  onError?: (error: string) => void;
}

export function DragDropInput({
  value,
  onChange,
  placeholder = "Drag and drop .txt, .pdf, or .docx files here, or type your text...",
  disabled = false,
  className = "",
  onFileProcessing,
  onError,
}: DragDropInputProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled || isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (disabled || isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const processFile = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      onError?.(validation.error || "Invalid file");
      return;
    }

    setIsProcessing(true);
    onFileProcessing?.(true);

    const result = await parseFile(file);

    if (result.success && result.text) {
      onChange(result.text);
      setUploadedFileName(result.fileName || null);
    } else {
      onError?.(result.error || "Failed to parse file");
    }

    setIsProcessing(false);
    onFileProcessing?.(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (disabled || isProcessing) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          position: "relative",
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".txt,.pdf,.docx"
          style={{ display: "none" }}
          disabled={disabled || isProcessing}
        />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isProcessing ? "Processing file..." : placeholder}
          disabled={disabled || isProcessing}
          style={{
            flex: 1,
            padding: "6px 10px",
            paddingLeft: uploadedFileName ? "28px" : "10px",
            borderRadius: 8,
            border: isDragOver ? "2px solid #38bdf8" : "1px solid #334155",
            background: isDragOver ? "#0f2140" : "#1e293b",
            color: "white",
            transition: "all 0.2s ease",
            opacity: disabled ? 0.6 : 1,
            cursor: isProcessing ? "wait" : disabled ? "not-allowed" : "text",
            backgroundColor: isDragOver ? "#1e3a5f" : "#1e293b",
          }}
          title={uploadedFileName ? `File uploaded: ${uploadedFileName}` : ""}
        />

        {uploadedFileName && (
          <div
            style={{
              position: "absolute",
              left: "8px",
              display: "flex",
              alignItems: "center",
              color: "#38bdf8",
              fontSize: "14px",
            }}
            title={uploadedFileName}
          >
            <Icon icon="lucide:file-check" width={16} height={16} />
          </div>
        )}

        {isProcessing && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginRight: 8,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                border: "2px solid #38bdf8",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Processing...</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          disabled={disabled || isProcessing}
          title="Click to select file or drag and drop"
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #475569",
            background: "#334155",
            color: "#e2e8f0",
            fontSize: "11px",
            fontWeight: 500,
            cursor: disabled || isProcessing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            opacity: disabled ? 0.5 : 1,
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            if (!disabled && !isProcessing) {
              (e.currentTarget as HTMLElement).style.background = "#475569";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#334155";
          }}
        >
          <Icon icon="lucide:upload" width={14} height={14} />
          Upload
        </button>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
