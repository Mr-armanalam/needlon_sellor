import React from 'react';
import {CATEGORY_SUBCATEGORY_MAP} from "@/modules/products/constants";
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {Scissors, Lock, Info} from "lucide-react";

interface VerifiedBrand {
    id: string;
    name: string;
}

interface CategoryItem {
    id: string;
    name: string;
    parentId?: string | null;
}

interface SubcategoryItem {
    id: string;
    name: string;
    parentId?: string | null;
}

const BasicInformationNode = () => {
    const {
        formData,
        handleInputChange,
        availableCategories,
        categoriesData,
        filteredSubcategories,
        verifiedBrands,
        handleSelectCategory,
        handleSelectSubcategory,
        handleSelectBrand,
        subcategoryOptions
    } = useAddProductWizard();

    const [isCustomBrand, setIsCustomBrand] = React.useState(!formData.brandId);

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
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Brand Label</label>
                        {verifiedBrands && verifiedBrands.length > 0 && (
                            <button
                                type="button"
                                onClick={() => {
                                    const nextCustom = !isCustomBrand;
                                    setIsCustomBrand(nextCustom);
                                    if (nextCustom) {
                                        handleInputChange('brandId', '');
                                    } else if (verifiedBrands[0]) {
                                        handleSelectBrand(verifiedBrands[0].id, verifiedBrands[0].name);
                                    }
                                }}
                                className="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors"
                            >
                                {isCustomBrand ? "Select Verified Brand" : "Write Custom Brand"}
                            </button>
                        )}
                    </div>
                    {!isCustomBrand && verifiedBrands && verifiedBrands.length > 0 ? (
                        <select
                            value={formData.brandId || ''}
                            onChange={(e) => {
                                const selected = verifiedBrands.find((b: VerifiedBrand) => b.id === e.target.value);
                                if (selected) {
                                    handleSelectBrand(selected.id, selected.name);
                                }
                            }}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                        >
                            <option value="">Select a verified brand...</option>
                            {verifiedBrands.map((b: VerifiedBrand) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            placeholder="e.g. House of Needlon"
                            value={formData.brandName || formData.brandLabel}
                            onChange={(e) => {
                                handleInputChange('brandLabel', e.target.value);
                                handleInputChange('brandName', e.target.value);
                            }}
                            className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                        />
                    )}
                </div>

                {/* Category Dropdown (ID & Name aware) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                    <select
                        value={formData.categoryId || formData.category}
                        onChange={(e) => {
                            const val = e.target.value;
                            const matched = categoriesData.find((c: CategoryItem) => c.id === val || c.name === val);
                            if (matched) {
                                handleSelectCategory(matched.id, matched.name);
                            } else {
                                handleInputChange('category', val);
                            }
                        }}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {categoriesData && categoriesData.length > 0 ? (
                            categoriesData.map((cat: CategoryItem) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))
                        ) : (
                            availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))
                        )}
                    </select>
                </div>

                {/* Subcategory Dropdown (FK Relational Subcategory) */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Subcategory</label>
                    <select
                        value={formData.subcategoryId || formData.subcategory}
                        onChange={(e) => {
                            const val = e.target.value;
                            const matched = filteredSubcategories.find((s: SubcategoryItem) => s.id === val || s.name === val);
                            if (matched) {
                                handleSelectSubcategory(matched.id, matched.name);
                            } else {
                                handleInputChange('subcategory', val);
                            }
                        }}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {filteredSubcategories && filteredSubcategories.length > 0 ? (
                            filteredSubcategories.map((sub: SubcategoryItem) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))
                        ) : subcategoryOptions && subcategoryOptions.length > 0 ? (
                            subcategoryOptions.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))
                        ) : (
                            <option value="">No subcategories available</option>
                        )}
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