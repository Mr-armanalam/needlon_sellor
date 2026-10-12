import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {VISIBILITY_OPTIONS} from "@/modules/products/constants";
import {Tag} from "lucide-react";

import {Sparkles, Globe, Share2} from "lucide-react";

const SeoNTagsNode = () => {
    const {
        formData,
        handleInputChange,
        handleRegenerateSeo
    } = useAddProductWizard();

    const displaySlug = formData.slug || (formData.name ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'product-title');
    const displayTitle = formData.metaTitle || (formData.name ? `${formData.name} | ${formData.brandLabel || 'House of Needlon'}` : 'Handcrafted Designer Fashion | Needlon');
    const displayDesc = formData.metaDescription || (formData.descriptionStory ? formData.descriptionStory.slice(0, 160) : 'Shop handcrafted bespoke couture with precision fit and custom tailoring options available exclusively on Needlon.');
    const displayUrl = formData.canonicalUrl || `https://needlon.com/products/${displaySlug}`;

    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">SEO Optimization & Search Discoverability</h3>
                    <p className="text-[13px] text-neutral-400">Configure search engine metadata, social share previews, and store visibility.</p>
                </div>
                <button
                    type="button"
                    onClick={handleRegenerateSeo}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[12px] font-medium flex items-center gap-1.5 transition-all shadow-sm"
                >
                    <Sparkles size={13} />
                    <span>Auto-Generate SEO</span>
                </button>
            </div>

            {/* Google SERP Live Preview Card */}
            <div className="p-4 bg-white rounded-xl border border-neutral-200/80 shadow-sm flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                    <Globe size={12} className="text-emerald-600" />
                    <span>Search Engine Preview (Google SERP)</span>
                </div>
                <div className="text-[12px] text-neutral-500 font-mono truncate">
                    {displayUrl}
                </div>
                <div className="text-[15px] font-semibold text-blue-700 hover:underline cursor-pointer truncate">
                    {displayTitle}
                </div>
                <div className="text-[12px] text-neutral-600 leading-snug line-clamp-2">
                    {displayDesc}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Custom URL Slug */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Product URL Slug</label>
                    <div className="flex items-center">
                        <span className="px-3 py-3 bg-neutral-100 border border-r-0 border-neutral-200/60 rounded-l-xl text-[12px] text-neutral-500 font-mono">
                            /products/
                        </span>
                        <input
                            type="text"
                            placeholder="handloom-chikankari-kurti"
                            value={formData.slug}
                            onChange={(e) => handleInputChange('slug', e.target.value)}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-r-xl text-[13px] font-mono outline-none focus:bg-white focus:border-neutral-900 transition-all"
                        />
                    </div>
                </div>

                {/* Custom Visibility Settings */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Storefront Visibility</label>
                    <select
                        value={formData.customVisibility || 'PUBLIC'}
                        onChange={(e) => handleInputChange('customVisibility', e.target.value as any)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer font-bold text-neutral-800"
                    >
                        <option value="PUBLIC">PUBLIC — Visible on storefront & search engines</option>
                        <option value="PRIVATE">PRIVATE — Hidden from storefront (Private Catalog)</option>
                        <option value="UNLISTED">UNLISTED — Accessible only via direct share link</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Meta Title */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Meta Title (SEO)</label>
                        <span className="text-[10px] text-neutral-400">{(formData.metaTitle || '').length}/60 chars</span>
                    </div>
                    <input
                        type="text"
                        placeholder="e.g. Handloom Chikankari Kurti | House of Needlon"
                        value={formData.metaTitle}
                        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>

                {/* Meta Description */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Meta Description (SEO)</label>
                        <span className="text-[10px] text-neutral-400">{(formData.metaDescription || '').length}/160 chars</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Short compelling summary for search results..."
                        value={formData.metaDescription}
                        onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Search Keywords */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Search Keywords / Meta Tags</label>
                    <input
                        type="text"
                        placeholder="e.g. handloom, chikankari, festive kurti, cotton apparel"
                        value={formData.searchKeywords}
                        onChange={(e) => handleInputChange('searchKeywords', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[11px] text-neutral-400 font-medium">Popular tags:</span>
                        {['handloom', 'chikankari', 'festive wear', 'designer kurti', 'cotton apparel'].map(tag => (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => {
                                    const current = formData.searchKeywords ? formData.searchKeywords.split(',').map(t => t.trim()).filter(Boolean) : [];
                                    if (!current.includes(tag)) {
                                        handleInputChange('searchKeywords', [...current, tag].join(', '));
                                    }
                                }}
                                className="px-2 py-0.5 text-[11px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md transition-colors flex items-center gap-1"
                            >
                                <Tag size={10} />
                                <span>{tag}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SeoNTagsNode;