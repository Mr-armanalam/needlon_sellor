"use client";
import React, { useState } from "react";
import {
  Camera,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { SaveStatus } from "../section/seller-foundation-page";

export default function StoreManagementSection({
  setSaveStatus,
}: {
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}) {
  const [openPolicy, setOpenPolicy] = useState<null | string>(null);
  const [storeMeta, setStoreMeta] = useState({
    name: "Needlon Hub Boutique",
    slug: "needlon-hub-apparel",
    description:
      "Premium handcrafted custom garments and localized women's clothing alternatives.",
    category: "Ethnic Fashion & Custom Tailoring",
  });

  const [bannerImg, setBannerImg] = useState<null | string>(null);
  const [logoImg, setLogoImg] = useState<null | string>(null);

  const togglePolicy = (policyKey: string) => {
    setOpenPolicy(openPolicy === policyKey ? null : policyKey);
  };

  const handleInputChange = (field:string, val:string) => {
    setStoreMeta((prev) => ({ ...prev, [field]: val }));
    setSaveStatus("Changes pending");
  };

  const handleMediaUpload = (type:string, e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      if (type === "banner") setBannerImg(url);
      if (type === "logo") setLogoImg(url);
      setSaveStatus("Changes pending");
    }
  };

  const policyItems = [
    {
      id: "shipping",
      title: "Shipping & Delivery Policy",
      content:
        "Orders are shipped out via integrated national shipping partners within 48 hours of custom tailoring completion confirmation logs.",
    },
    {
      id: "return",
      title: "Return & Refund Policy",
      content:
        "Custom configurations support alterations within 7 days of pickup delivery. Raw cuts are non-refundable.",
    },
    {
      id: "cancellation",
      title: "Cancellation Rules",
      content:
        "Cancellations are accepted within 4 hours of payment settlement before structural fabric trimming operations begin.",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl animate-in fade-in duration-200">
      {/* SECTION TITLE ROW */}
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-sm font-bold text-gray-900">
          Storefront Design Studio
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Brand your marketplace assets and review live buyer view
          visualizations synchronously.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* LEFT COLUMN: EDITABLE FORMS & ACCORDIONS (3/5 Grid spans) */}
        <div className="lg:col-span-3 space-y-6">
          {/* MEDIA ASSET DESIGN CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Store Graphics
            </h3>

            {/* HERO BANNER DROPZONE FRAME */}
            <div className="relative w-full h-32 bg-slate-100 border rounded-xl overflow-hidden flex items-center justify-center group border-gray-200">
              {bannerImg ? (
                <img
                  src={bannerImg}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400 text-[11px] space-y-1">
                  <Camera className="w-5 h-5 mx-auto opacity-70" />
                  <p className="font-semibold">
                    Upload Store Cover Landscape Banner
                  </p>
                </div>
              )}
              <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white font-bold text-xs gap-1">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleMediaUpload("banner", e)}
                />
                <Camera className="w-4 h-4" /> Replace Cover
              </label>
            </div>

            {/* INTEGRATED LOGO ROUND THUMBNAIL */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-gray-200 flex-shrink-0 relative overflow-hidden flex items-center justify-center group">
                {logoImg ? (
                  <img
                    src={logoImg}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-4 h-4 text-gray-400" />
                )}
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleMediaUpload("logo", e)}
                  />
                  Edit
                </label>
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-gray-800 block">
                  Marketplace Logo Icon
                </span>
                <p className="text-gray-400 font-medium">
                  1:1 Square aspect ratios recommended for checkout branding
                  tags.
                </p>
              </div>
            </div>
          </div>

          {/* CATALOG DATA FORMS */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Identity Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Public Display Name
                </label>
                <input
                  type="text"
                  value={storeMeta.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">
                  Custom Shop URL Slug
                </label>
                <input
                  type="text"
                  value={storeMeta.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-blue-600 font-mono"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Boutique Description
              </label>
              <textarea
                rows={3}
                value={storeMeta.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* CLEAN COLLAPSIBLE POLICY ACCORDIONS */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">
              Fulfillment Policies
            </h3>

            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
              {policyItems.map((item) => (
                <div key={item.id} className="bg-white text-xs">
                  <button
                    type="button"
                    onClick={() => togglePolicy(item.id)}
                    className="w-full flex items-center justify-between p-3.5 font-bold text-gray-700 hover:bg-slate-50/50 transition-colors text-left"
                  >
                    <span>{item.title}</span>
                    {openPolicy === item.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {openPolicy === item.id && (
                    <div className="p-4 bg-slate-50/50 border-t border-gray-50 text-gray-500 leading-relaxed font-medium animate-in slide-in-from-top-1 duration-200">
                      {item.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DESKTOP REAL-TIME VISUAL PREVIEW SCREEN (2/5 Spans) */}
        <div className="lg:col-span-2 sticky top-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* PREVIEW TOOLBAR */}
            <div className="p-3 bg-slate-50 border-b border-gray-100 flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex-shrink-0">
              <Eye className="w-3.5 h-3.5 text-blue-500" /> Active Customer View
              Preview
            </div>

            {/* LIVE SYNCED CANVAS FRAME */}
            <div className="p-4 bg-slate-100/50 flex-1 min-h-0 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs relative">
                {/* Simulated Landscape Banner Background */}
                <div className="w-full h-20 bg-slate-200">
                  {bannerImg && (
                    <img
                      src={bannerImg}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Floating Absolute Logo Container */}
                <div className="absolute top-10 left-4 w-12 h-12 bg-white rounded-full border shadow-xs p-0.5 overflow-hidden flex items-center justify-center">
                  {logoImg ? (
                    <img
                      src={logoImg}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 rounded-full" />
                  )}
                </div>

                {/* Text Metadata Block */}
                <div className="pt-7 p-4 space-y-1 text-xs">
                  <h4 className="font-black text-gray-900 flex items-center gap-1">
                    {storeMeta.name || "Unnamed Store"}
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </h4>
                  <p className="text-[11px] text-gray-400 font-bold tracking-wide uppercase">
                    {storeMeta.category || "Unassigned Category"}
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed pt-1 line-clamp-2">
                    {storeMeta.description ||
                      "No descriptions customized yet..."}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold pt-2 border-t border-gray-50 mt-2">
                    <Star className="w-3.5 h-3.5 fill-current" /> 5.0{" "}
                    <span className="text-gray-400 font-medium ml-1">
                      (New Boutique Partner)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MASTER TRIGGER BUTTON */}
            <div className="p-4 border-t border-gray-50 bg-white">
              <button
                type="button"
                onClick={() => setSaveStatus("Saved ✓")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs text-center shadow-blue-600/10"
              >
                Publish Live Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
