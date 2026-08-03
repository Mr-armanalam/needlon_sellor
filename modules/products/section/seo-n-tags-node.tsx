import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {VISIBILITY_OPTIONS} from "@/modules/products/constants";
import {Tag} from "lucide-react";

const SeoNTagsNode = () => {
    const {formData, handleInputChange}= useAddProductWizard()
    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">SEO optimization & Search Tags <span className="text-[12px] text-neutral-400 font-normal ml-1">(Optional)</span></h3>
                <p className="text-[13px] text-neutral-400">Add meta text identifier keywords to increase discoverability on Google search indices.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Search Keywords / Tags</label>
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
                                    const current = formData.searchKeywords ? formData.searchKeywords.split(',').map(t => t.trim()) : [];
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

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Custom Visibility Settings</label>
                    <select
                        value={formData.customVisibility}
                        onChange={(e) => handleInputChange('customVisibility', e.target.value as any)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer font-bold text-neutral-800"
                    >
                        {VISIBILITY_OPTIONS.map(v => <option key={v} value={v}>{v} (Visible on public storefront & search indices)</option>)}
                    </select>
                </div>
            </div>
        </div>

    );
};

export default SeoNTagsNode;