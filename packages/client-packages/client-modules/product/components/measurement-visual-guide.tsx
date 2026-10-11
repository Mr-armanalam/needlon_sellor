"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Maximize2,
  Minimize2,
  X,
  Info,
  Ruler,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeasurementVisualGuideProps {
  label: string;
  cdnUrl: string;
  fallbackUrl: string;
  activeGender: string;
}

export default function MeasurementVisualGuide({
  label,
  cdnUrl,
  fallbackUrl,
  activeGender,
}: MeasurementVisualGuideProps) {
  const [imageSrc, setImageSrc] = useState<string>(cdnUrl);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Sync image source when props change
  React.useEffect(() => {
    setImageSrc(cdnUrl);
    setHasError(false);
  }, [cdnUrl]);

  const handleImageError = () => {
    if (imageSrc !== fallbackUrl) {
      console.warn(`CDN image failed, falling back to local asset: ${fallbackUrl}`);
      setImageSrc(fallbackUrl);
    } else {
      setHasError(true);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-stone-900/80 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden transition-all duration-300">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-stone-50/80 dark:bg-stone-950/60 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#D4AF37]/15 text-[#B89628] dark:text-[#D4AF37] rounded-lg">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Visual Measurement Guide
                <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300/40">
                  {label}
                </span>
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Follow anatomical markers for exact pattern cutting accuracy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsZoomed(true)}
              className="h-8 px-2.5 text-xs text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" /> Fullscreen Zoom
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 px-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              title={isCollapsed ? "Expand Guide" : "Collapse Guide"}
            >
              {isCollapsed ? (
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Show
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" /> Hide
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Collapsible Content Body */}
        {!isCollapsed && (
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Diagram Image Canvas (7 cols on desktop) */}
              <div className="md:col-span-7 flex justify-center">
                <div
                  onClick={() => setIsZoomed(true)}
                  className="group relative w-full max-w-md h-64 sm:h-72 md:h-80 bg-stone-100/70 dark:bg-stone-950/80 rounded-xl overflow-hidden border border-stone-200/80 dark:border-stone-800 cursor-zoom-in transition-all hover:border-[#D4AF37]/50 hover:shadow-md flex items-center justify-center p-2"
                >
                  {!hasError ? (
                    <Image
                      src={imageSrc}
                      alt={`${label} measurement anatomical guide`}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      priority
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-102"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="text-center p-4 text-xs text-stone-400">
                      Diagram preview unavailable
                    </div>
                  )}

                  {/* Hover Hint Overlay */}
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-black/80 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xs">
                      <Maximize2 className="w-3 h-3 text-[#D4AF37]" /> Click to Inspect in High Definition
                    </span>
                  </div>
                </div>
              </div>

              {/* Master Tailor Guidelines & Legend (5 cols on desktop) */}
              <div className="md:col-span-5 space-y-3.5 text-xs text-stone-600 dark:text-stone-300">
                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Master Cutting Rules
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-950/80 dark:text-amber-300/80">
                    Use a flexible tailoring tape measure. Keep the tape comfortably snug against the body without pulling tight.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center font-mono font-bold text-[10px] text-stone-800 dark:text-stone-200 shrink-0">
                      1
                    </span>
                    <span className="leading-snug">
                      <strong>Stand in Natural Posture:</strong> Keep your arms relaxed at your sides and breathe normally.
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center font-mono font-bold text-[10px] text-stone-800 dark:text-stone-200 shrink-0">
                      2
                    </span>
                    <span className="leading-snug">
                      <strong>Circumferences:</strong> Keep tape measure completely level across back and chest/waist.
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center font-mono font-bold text-[10px] text-stone-800 dark:text-stone-200 shrink-0">
                      3
                    </span>
                    <span className="leading-snug">
                      <strong>Lengths:</strong> Measure straight along garment lines from the specified anchor point.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-white rounded-lg font-semibold text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> View Fullscreen Reference Diagram
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{label}</span>
                  <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    {activeGender}
                  </span>
                </h4>
                <p className="text-xs text-stone-400">
                  Precision anatomical lines & numbered measurement points
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative flex-1 min-h-[500px] p-6 bg-stone-950/70 flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={`${label} measurement diagram enlarged`}
                fill
                sizes="(max-width: 1200px) 100vw, 1000px"
                className="object-contain p-4"
                priority
              />
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Refer to numbered guide positions when filling essential metrics below.</span>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsZoomed(false)}
                className="bg-stone-800 hover:bg-stone-700 text-white text-xs cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
