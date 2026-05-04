"use client";

import { scanReceipt } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { Camera, Loader2, Sparkles } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

const ReceiptScanner = ({ onScanComplete }) => {
  const fileInputRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if(file.size>5*1024*1024){
      toast.error("File size should be less than 5MB");
      return;
    }
    await scanReceiptFn(file);
  };

  useEffect(() => {
  if (scannedData && !scanReceiptLoading) {
    onScanComplete(scannedData);
    toast.success("Receipt scanned successfully");
  }
}, [scannedData, scanReceiptLoading]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-sm p-5">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-slate-700/50">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-emerald-500">
          AI
        </span>

        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-wide uppercase">
          Smart Receipt Scanner
        </span>
      </div>

      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />

      {/* CTA Button */}
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
        className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-200"
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning Receipt...
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Scan Receipt with AI
          </>
        )}
      </Button>

      {/* Info */}
      <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 mt-3">
        <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0 text-emerald-500" />
        <span>
          Automatically extracts amount, category, merchant name, and date.
        </span>
      </div>
    </div>
  );
};

export default ReceiptScanner;