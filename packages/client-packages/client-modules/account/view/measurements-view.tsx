"use client";

import React from "react";
import { Scissors, Ruler, Store, Sparkles, CheckCircle2 } from "lucide-react";
import AtelierChatPermissions from "../components/atelier-chat-permissions";

export interface CustomerMeasurementItem {
  id: string;
  orderId?: string | null;
  gender: string;
  garmentType: string;
  measurementUnit: string;
  essentialMeasurements: Record<string, any>;
  postureSpecifics?: Record<string, any>;
  fitPreference?: string | null;
  tailorNotes?: string | null;
  source: string;
  status: string;
  createdAt: string;
  storeName?: string | null;
}

interface MeasurementsViewProps {
  measurements: CustomerMeasurementItem[];
}

export default function MeasurementsView({ measurements }: MeasurementsViewProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">
              Bespoke Measurement Profiles
            </h1>
            <p className="text-xs text-stone-500 dark:text-neutral-400 mt-0.5">
              Physical in-store measurements recorded by your tailor atelier and customized online orders.
            </p>
          </div>
        </div>
      </div>

      {/* Atelier Privacy & Chat Controls */}
      <AtelierChatPermissions />

      {/* List of profiles */}
      {measurements.length === 0 ? (
        <div className="text-center py-12 px-4 bg-stone-50 dark:bg-neutral-900/40 rounded-2xl border border-stone-200/80 dark:border-neutral-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-stone-400">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-semibold text-stone-800 dark:text-white">
            No Measurements Recorded Yet
          </h2>
          <p className="text-xs text-stone-500 dark:text-neutral-400 max-w-md mx-auto">
            When you visit any partner tailor shop, the master tailor can record your measurements directly. They will automatically sync with this account using your email.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {measurements.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-stone-200/90 dark:border-neutral-800 p-5 shadow-sm space-y-4 hover:border-stone-300 dark:hover:border-neutral-700 transition-colors"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 dark:border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-tight">
                      {m.garmentType.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-300 capitalize">
                      {m.gender}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-black">
                      {m.measurementUnit}
                    </span>
                    {m.fitPreference && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                        {m.fitPreference} FIT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-stone-500 dark:text-neutral-400 flex-wrap">
                    {m.source === "IN_STORE_TAILOR_MASTER" ? (
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                        <Store className="w-3.5 h-3.5" />
                        In-Store Atelier Master {m.storeName ? `(${m.storeName})` : ""}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        Online Customer Intake
                      </span>
                    )}
                    <span>•</span>
                    <span>Recorded: {new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    <CheckCircle2 className="w-3 h-3" />
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Essential Measurements Grid */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500 mb-2 flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> Essential Measurements
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Object.entries(m.essentialMeasurements || {}).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-2.5 bg-stone-50 dark:bg-neutral-800/50 rounded-lg border border-stone-100 dark:border-neutral-800 flex flex-col"
                    >
                      <span className="text-[10px] text-stone-500 dark:text-neutral-400 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-bold text-stone-900 dark:text-white mt-0.5">
                        {String(val)} {m.measurementUnit === "CM" ? "cm" : "in"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Posture Nuances */}
              {m.postureSpecifics && Object.keys(m.postureSpecifics).length > 0 && (
                <div className="pt-2 border-t border-stone-100 dark:border-neutral-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-neutral-500 mb-2">
                    Bespoke & Posture Nuances
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(m.postureSpecifics).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-2 bg-stone-50 dark:bg-neutral-800/50 rounded-lg border border-stone-100 dark:border-neutral-800 flex flex-col"
                      >
                        <span className="text-[10px] text-stone-500 dark:text-neutral-400 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs font-semibold text-stone-800 dark:text-neutral-200 mt-0.5">
                          {String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailor Master Notes */}
              {m.tailorNotes && (
                <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 rounded-lg text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Tailor Master Instructions: </span>
                  {m.tailorNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
