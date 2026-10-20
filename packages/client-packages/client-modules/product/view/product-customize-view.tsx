"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ruler,
  Scissors,
  CheckCircle2,
  ChevronRight,
  Info,
  Sparkles,
  ArrowLeft,
  SlidersHorizontal,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailedProductResponse } from "@/types/product";
import { addToCart } from "@/features/cart-slice";
import { useAppDispatch } from "@/store/store";
import { useSession } from "next-auth/react";
import { submitOnlineCustomerMeasurementAction } from "../../account/server/measurements-controller";
import {
  BESPOKE_CONFIG,
  formatFieldLabel,
  FIELD_HINTS,
  getGarmentDiagram,
} from "../constants/bespoke-taxonomy";
import MeasurementVisualGuide from "../components/measurement-visual-guide";

export { BESPOKE_CONFIG, formatFieldLabel, FIELD_HINTS, getGarmentDiagram };

export default function ProductCustomizeView({
  productData,
}: {
  productData: DetailedProductResponse;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Auto-detect gender category from product metadata or default to menswear
  const defaultGender = useMemo(() => {
    const cat = (productData?.category?.CatType || "").toLowerCase();
    if (cat.includes("women") || cat.includes("female") || cat.includes("ladies")) {
      return "womenswear";
    }
    return "menswear";
  }, [productData]);

  // Auto-detect garment type from product subcategory
  const defaultGarment = useMemo(() => {
    const sub = (productData?.category?.SubCatType || productData?.name || "").toLowerCase();
    const targetMap = BESPOKE_CONFIG[defaultGender];
    const match = Object.keys(targetMap).find((k) => sub.includes(k));
    return match || Object.keys(targetMap)[0];
  }, [defaultGender, productData]);

  const [gender, setGender] = useState<string>(defaultGender);
  const [garmentKey, setGarmentKey] = useState<string>(defaultGarment);
  const [unit, setUnit] = useState<"INCHES" | "CM">("INCHES");
  const [fitPreference, setFitPreference] = useState<"SLIM" | "REGULAR" | "COMFORT">("REGULAR");
  const [activeTab, setActiveTab] = useState<"essential" | "posture">("essential");

  // Dynamic Form Values
  const [essentialValues, setEssentialValues] = useState<Record<string, string>>({});
  const [postureValues, setPostureValues] = useState<Record<string, string>>({});
  const [tailorNotes, setTailorNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Active configuration for selected garment
  const activeGarmentConfig = useMemo(() => {
    const genderObj = BESPOKE_CONFIG[gender] || BESPOKE_CONFIG.menswear;
    return genderObj[garmentKey] || Object.values(genderObj)[0];
  }, [gender, garmentKey]);

  // Handle Input Changes
  const handleEssentialChange = (field: string, val: string) => {
    setEssentialValues((prev) => ({ ...prev, [field]: val }));
  };

  const handlePostureChange = (field: string, val: string) => {
    setPostureValues((prev) => ({ ...prev, [field]: val }));
  };

  // Completion calculation
  const filledCount = useMemo(() => {
    const required = activeGarmentConfig.essential_measurements;
    return required.filter((k) => !!essentialValues[k]?.trim()).length;
  }, [activeGarmentConfig, essentialValues]);

  const totalRequired = activeGarmentConfig.essential_measurements.length;
  const progressPercent = Math.round((filledCount / totalRequired) * 100);

  // Submit Handler: Saves to Local Storage & Adds Bespoke Product to Cart
  const handleApplyBespokeOrder = () => {
    const bespokePayload = {
      productId: productData.id,
      productName: productData.name,
      gender,
      garmentType: garmentKey,
      measurementUnit: unit,
      fitPreference,
      essentialMeasurements: essentialValues,
      postureSpecifics: postureValues,
      tailorNotes,
      savedAt: new Date().toISOString(),
    };

    // 1. Save in local browser storage for checkout and order attachment
    if (typeof window !== "undefined") {
      localStorage.setItem(`bespoke_${productData.id}`, JSON.stringify(bespokePayload));
    }

    // 2. Dispatch to Cart with custom measurement tag
    dispatch(
      addToCart({
        userId,
        product: {
          ...productData,
          size: "Bespoke Custom",
          quantity: 1,
          updatedAt: new Date(productData.updatedAt || Date.now()),
        },
        size: `Custom Fit (${activeGarmentConfig.label})`,
      })
    );

    // 3. Persist to customer_measurements table in database
    submitOnlineCustomerMeasurementAction({
      userId,
      customerEmail: session?.user?.email || undefined,
      customerName: session?.user?.name || undefined,
      productId: productData.id,
      sellerId: (productData as DetailedProductResponse & { sellerId?: string; storeId?: string }).sellerId || (productData as DetailedProductResponse & { sellerId?: string; storeId?: string }).storeId || undefined,
      gender,
      garmentType: garmentKey,
      measurementUnit: unit,
      essentialMeasurements: essentialValues,
      postureSpecifics: postureValues,
      fitPreference,
      tailorNotes,
    }).catch((err) => console.warn("Online measurement sync notice:", err));

    setSubmitted(true);
    setTimeout(() => {
      router.push("/cart");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
          <Link
            href={`/product/${productData.id}`}
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Product Showcase
          </Link>
          <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-full border border-amber-200/60 dark:border-amber-800/40">
            <Scissors className="w-3.5 h-3.5" /> Needlon Bespoke Tailoring Studio
          </div>
        </div>

        {/* Hero Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-garamond text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-white">
              Bespoke Fit Studio
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl font-roboto-sans">
              Enter precision measurements for your bespoke piece. Each garment is hand-drafted, pattern-cut, and tailored by verified master tailors.
            </p>
          </div>

          {/* Unit Toggle & Silhouette Preference */}
          <div className="flex items-center gap-3">
            <div className="bg-stone-200/70 dark:bg-stone-900 p-1 rounded-xl flex items-center text-xs font-semibold border border-stone-300/50 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setUnit("INCHES")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  unit === "INCHES"
                    ? "bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-950"
                }`}
              >
                Inches (in)
              </button>
              <button
                type="button"
                onClick={() => setUnit("CM")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  unit === "CM"
                    ? "bg-white dark:bg-stone-800 text-stone-950 dark:text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-950"
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Left Configurator (8 Cols) & Right Summary (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Dynamic Tailoring Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Gender & Category Selector Tabs */}
            <div className="bg-white dark:bg-stone-900/70 rounded-2xl p-5 border border-stone-200 dark:border-stone-800/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                  Step 1: Choose Garment Category
                </span>
                {/* Gender Tabs */}
                <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => {
                      setGender("menswear");
                      setGarmentKey(Object.keys(BESPOKE_CONFIG.menswear)[0]);
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                      gender === "menswear"
                        ? "bg-black text-white dark:bg-[#D4AF37] dark:text-black shadow-sm"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    Menswear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGender("womenswear");
                      setGarmentKey(Object.keys(BESPOKE_CONFIG.womenswear)[0]);
                    }}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                      gender === "womenswear"
                        ? "bg-black text-white dark:bg-[#D4AF37] dark:text-black shadow-sm"
                        : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    Womenswear
                  </button>
                </div>
              </div>

              {/* Garment Selection Pills (Dynamically loads only options for active gender) */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.entries(BESPOKE_CONFIG[gender] || {}).map(([key, item]) => {
                  const isSelected = garmentKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setGarmentKey(key)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-stone-900 dark:border-white shadow-sm"
                          : "bg-stone-50 dark:bg-stone-900/40 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Measurements Intake Container */}
            <div className="bg-white dark:bg-stone-900/70 rounded-2xl p-6 border border-stone-200 dark:border-stone-800/80 shadow-sm space-y-6">
              {/* Progress bar and section tabs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-garamond text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      {activeGarmentConfig.label} Customization Fields
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Units set to <span className="font-semibold">{unit}</span>. All measurements are precision-checked by master cutters.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                      {filledCount} of {totalRequired} filled ({progressPercent}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 dark:bg-[#D4AF37] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Visual Anatomical Measurement Guide */}
                <MeasurementVisualGuide
                  label={activeGarmentConfig.label}
                  cdnUrl={activeGarmentConfig.cdnUrl}
                  fallbackUrl={activeGarmentConfig.fallbackUrl}
                  activeGender={gender}
                />

                {/* Section switch tabs: Essential vs Bespoke & Posture */}
                <div className="flex gap-2 pt-2 border-b border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab("essential")}
                    className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                      activeTab === "essential"
                        ? "border-black dark:border-[#D4AF37] text-stone-900 dark:text-white"
                        : "border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                    }`}
                  >
                    1. Essential Measurements ({activeGarmentConfig.essential_measurements.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("posture")}
                    className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 ${
                      activeTab === "posture"
                        ? "border-black dark:border-[#D4AF37] text-stone-900 dark:text-white"
                        : "border-transparent text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    2. Bespoke & Posture Specifics ({activeGarmentConfig.bespoke_and_posture_specifics.length})
                  </button>
                </div>
              </div>

              {/* DYNAMIC FIELD RENDERING: Essential Measurements */}
              {activeTab === "essential" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 animate-in fade-in">
                  {activeGarmentConfig.essential_measurements.map((fieldName) => {
                    const val = essentialValues[fieldName] || "";
                    const hint = FIELD_HINTS[fieldName];
                    return (
                      <div
                        key={fieldName}
                        className="p-3.5 bg-stone-50/70 dark:bg-stone-950/60 rounded-xl border border-stone-200/80 dark:border-stone-800 space-y-1.5 hover:border-stone-300 dark:hover:border-stone-700 transition"
                      >
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                            {formatFieldLabel(fieldName)}
                          </label>
                          {hint && (
                            <span title={hint} className="cursor-help text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                              <HelpCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.25"
                            placeholder={unit === "INCHES" ? "e.g. 38.5" : "e.g. 98.0"}
                            value={val}
                            onChange={(e) => handleEssentialChange(fieldName, e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono font-medium rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-[#D4AF37]"
                          />
                          <span className="absolute right-2.5 top-2 text-[10px] font-semibold text-stone-400 uppercase">
                            {unit === "INCHES" ? "in" : "cm"}
                          </span>
                        </div>
                        {hint && <p className="text-[10px] text-stone-400 line-clamp-1">{hint}</p>}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* DYNAMIC FIELD RENDERING: Bespoke & Posture Specifics */}
              {activeTab === "posture" && (
                <div className="space-y-4 pt-2 animate-in fade-in">
                  <div className="bg-amber-50/60 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      Posture specifics allow our cutting masters to drape patterns accurately around your bone structure, shoulder slope, and natural stance.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {activeGarmentConfig.bespoke_and_posture_specifics.map((fieldName) => {
                      const val = postureValues[fieldName] || "";
                      const hint = FIELD_HINTS[fieldName];
                      const isPostureChoice =
                        fieldName.includes("slope") ||
                        fieldName.includes("prominence") ||
                        fieldName.includes("stance");

                      return (
                        <div
                          key={fieldName}
                          className="p-3.5 bg-stone-50/70 dark:bg-stone-950/60 rounded-xl border border-stone-200/80 dark:border-stone-800 space-y-1.5 hover:border-stone-300 dark:hover:border-stone-700 transition"
                        >
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-tight">
                              {formatFieldLabel(fieldName)}
                            </label>
                            {hint && (
                              <span title={hint} className="cursor-help text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
                                <HelpCircle className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>

                          {isPostureChoice ? (
                            <select
                              value={val}
                              onChange={(e) => handlePostureChange(fieldName, e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-[#D4AF37] cursor-pointer"
                            >
                              <option value="">Select Stance...</option>
                              <option value="REGULAR">Regular / Balanced Stance</option>
                              <option value="SQUARE_HIGH">Square / Erect Posture</option>
                              <option value="SLOPING_FORWARD">Sloping / Athletic Stance</option>
                              <option value="PROMINENT">Prominent Profile</option>
                            </select>
                          ) : (
                            <div className="relative">
                              <input
                                type="number"
                                step="0.25"
                                placeholder={unit === "INCHES" ? "e.g. 9.5" : "e.g. 24.0"}
                                value={val}
                                onChange={(e) => handlePostureChange(fieldName, e.target.value)}
                                className="w-full px-3 py-2 text-xs font-mono font-medium rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-[#D4AF37]"
                              />
                              <span className="absolute right-2.5 top-2 text-[10px] font-semibold text-stone-400 uppercase">
                                {unit === "INCHES" ? "in" : "cm"}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Silhouette & Master Tailor Instructions */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                    Fit Silhouette Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: "SLIM", label: "Slim Fit", desc: "Tapered torso, fitted waist" },
                      { key: "REGULAR", label: "Classic Regular", desc: "Traditional balance, ease of movement" },
                      { key: "COMFORT", label: "Relaxed Comfort", desc: "Generous drape, extra breathing room" },
                    ].map((fit) => (
                      <button
                        key={fit.key}
                        type="button"
                        onClick={() => setFitPreference(fit.key as "SLIM" | "REGULAR" | "COMFORT")}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          fitPreference === fit.key
                            ? "border-black bg-stone-50 dark:border-[#D4AF37] dark:bg-stone-900/90"
                            : "border-stone-200 dark:border-stone-800"
                        }`}
                      >
                        <p className="text-xs font-bold text-stone-900 dark:text-white">{fit.label}</p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{fit.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                    Tailor Master Notes / Special Requests
                  </label>
                  <textarea
                    rows={3}
                    value={tailorNotes}
                    onChange={(e) => setTailorNotes(e.target.value)}
                    placeholder="e.g. Leave extra room on left wrist for luxury watch, lower front collar stance by 0.5 inches..."
                    className="w-full p-3 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-900 dark:focus:ring-[#D4AF37]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Garment Summary Card & Order CTA (4 Cols) */}
          <div className="lg:col-span-4 space-y-5 sticky top-6">
            <div className="bg-white dark:bg-stone-900/70 rounded-2xl p-5 border border-stone-200 dark:border-stone-800/80 shadow-sm space-y-4">
              <h3 className="font-garamond text-lg font-bold text-stone-900 dark:text-white pb-2 border-b border-stone-100 dark:border-stone-800">
                Selected Piece Summary
              </h3>

              {/* Product Preview */}
              <div className="flex gap-3 items-center">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                  <Image
                    src={productData.image || "/images/image1.png"}
                    alt={productData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Bespoke Tailoring
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white line-clamp-2">
                    {productData.name}
                  </h4>
                  <p className="text-sm font-mono font-bold text-stone-800 dark:text-stone-200">
                    ₹{productData.price}
                  </p>
                </div>
              </div>

              {/* Selected Options List */}
              <div className="space-y-2 py-2 border-y border-stone-100 dark:border-stone-800 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Category:</span>
                  <span className="font-semibold text-stone-900 dark:text-white capitalize">{gender}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Garment Pattern:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{activeGarmentConfig.label}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Silhouette Fit:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{fitPreference}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Unit System:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{unit}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Required Metrics:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {filledCount}/{totalRequired} provided
                  </span>
                </div>
              </div>

              {/* Trust Assurances */}
              <div className="space-y-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  Free 1-time alteration guarantee within 30 days
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  Personal cutting master review before stitching
                </p>
              </div>

              {/* Call to Action Button */}
              {submitted ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl text-center border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Bespoke measurements saved! Adding to bag...
                </div>
              ) : (
                <Button
                  onClick={handleApplyBespokeOrder}
                  type="button"
                  className="w-full h-12 bg-black hover:bg-stone-800 text-white dark:bg-[#D4AF37] dark:hover:bg-[#c49f27] dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition"
                >
                  Save & Apply Custom Fit to Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
