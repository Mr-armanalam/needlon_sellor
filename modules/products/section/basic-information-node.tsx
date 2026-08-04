import React from 'react';
import {CATEGORY_SUBCATEGORY_MAP} from "@/modules/products/constants";
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";

const BasicInformationNode = () => {
    const {formData, handleInputChange, setFormData, availableCategories, subcategoryOptions} = useAddProductWizard()
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
                            const defaultSub = CATEGORY_SUBCATEGORY_MAP[newCat]?.[0] || 'Kurtis';
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
            </div>
        </div>
    );
};

export default BasicInformationNode;