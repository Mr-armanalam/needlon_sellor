import React from 'react';
import {CATEGORY_SUBCATEGORY_MAP} from "@/modules/products/constants";
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {Scissors, Lock, Info} from "lucide-react";

const BasicInformationNode = () => {
    const {formData, handleInputChange, setFormData, availableCategories, subcategoryOptions} = useAddProductWizard();

    console.log(availableCategories, subcategoryOptions, 'basic-information-node')
    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Basic Information</h3>
                <p className="text-[13px] text-neutral-400">Define your custom piece title, detailed taxonomy categories, and target fit profiles.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Product Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Handloom Chikankari Kurti"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Brand Label</label>
                    <input
                        type="text"
                        placeholder="House of Needlon"
                        value={formData.brandLabel}
                        onChange={(e) => handleInputChange('brandLabel', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                    />
                </div>

                {/* Controlled Hybrid Category Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) => {
                            const newCat = e.target.value;
                            const defaultSub = CATEGORY_SUBCATEGORY_MAP[newCat]?.[0] || '';
                            setFormData(prev => ({ ...prev, category: newCat, subcategory: defaultSub }));
                        }}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {availableCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Controlled Hybrid Subcategory Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Subcategory</label>
                    <select
                        value={formData.subcategory}
                        onChange={(e) => handleInputChange('subcategory', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {subcategoryOptions.map(sub => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col sm:col-span-2 gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Description Story</label>
                    <textarea
                        rows={2}
                        placeholder="Write about the weave type, artisan background, and tailoring elements..."
                        value={formData.descriptionStory}
                        onChange={(e) => handleInputChange('descriptionStory', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all resize-none"
                    />
                </div>

                {/* Bespoke / Customization Capability Toggle */}
                <div className={`sm:col-span-2 p-4 rounded-xl border transition-all ${
                    formData.isCustomizable ?? true
                        ? 'bg-amber-50/40 border-amber-200/80'
                        : 'bg-neutral-50 border-neutral-200/60'
                }`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                            <div className={`p-2 rounded-lg shrink-0 ${
                                formData.isCustomizable ?? true ? 'bg-amber-100 text-amber-900' : 'bg-neutral-200 text-neutral-600'
                            }`}>
                                <Scissors className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-[13px] font-semibold text-neutral-900">
                                        Enable Bespoke & Made-to-Measure Customization
                                    </h4>
                                    {formData.hasExistingOrders && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                                            <Lock className="w-2.5 h-2.5" /> Locked (Active Customer Orders)
                                        </span>
                                    )}
                                </div>
                                <p className="text-[12px] text-neutral-500 leading-relaxed">
                                    Enabled by default for bespoke and tailored goods. Allows customers to submit online measurements or visit your atelier. 
                                    {formData.hasExistingOrders ? (
                                        <span className="text-amber-900 font-medium ml-1">
                                            Once customers have placed orders, customization cannot be disabled or denied.
                                        </span>
                                    ) : (
                                        <span className="text-neutral-400 ml-1">
                                            (Can only be disabled before any orders are placed for fixed ready-to-wear sizes).
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <label className={`relative inline-flex items-center shrink-0 ${
                            formData.hasExistingOrders ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}>
                            <input
                                type="checkbox"
                                checked={formData.isCustomizable ?? true}
                                disabled={Boolean(formData.hasExistingOrders)}
                                onChange={(e) => {
                                    if (!formData.hasExistingOrders) {
                                        handleInputChange('isCustomizable', e.target.checked);
                                    }
                                }}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicInformationNode;