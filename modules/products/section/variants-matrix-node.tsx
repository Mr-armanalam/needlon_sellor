import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {
    AGE_GROUP_OPTIONS,
    FIT_OPTIONS,
    GENDER_OPTIONS,
    OCCASION_OPTIONS, SLEEVES_OPTIONS, STANDARD_COLORS, STANDARD_FABRICS,
    STANDARD_SIZES
} from "@/modules/products/constants";

const VariantsMatrixNode = () => {
    const {formData, handleInputChange, handleToggleSize} = useAddProductWizard()
    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Boutique Sizing & Variants</h3>
                <p className="text-[13px] text-neutral-400">Map out the complete spectrum of available sizes, colors, and specific fit metrics.</p>
            </div>

            {/* Sizes Matrix Interactive Pills */}
            <div className="flex flex-col gap-2 bg-neutral-50/60 p-4 rounded-xl border border-neutral-200/60">
                <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Sizes Matrix (Select All Applicable)</label>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                    {STANDARD_SIZES.map(s => {
                        const activeList = formData.sizesMatrix.split(',').map(item => item.trim());
                        const isSelected = activeList.includes(s);
                        return (
                            <button
                                type="button"
                                key={s}
                                onClick={() => handleToggleSize(s)}
                                className={`px-3.5 py-1.5 text-[12px] font-bold rounded-lg border transition-all ${
                                    isSelected
                                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                                        : 'bg-white text-neutral-600 border-neutral-200/80 hover:border-neutral-400'
                                }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
                <input
                    type="text"
                    placeholder="Or custom sizes (e.g. S, M, L, XL)"
                    value={formData.sizesMatrix}
                    onChange={(e) => handleInputChange('sizesMatrix', e.target.value)}
                    className="w-full mt-2 p-2.5 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none focus:border-neutral-900"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Colors Track Hybrid */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Colors Track</label>
                    <select
                        value={STANDARD_COLORS.includes(formData.colorsTrack) ? formData.colorsTrack : 'Custom'}
                        onChange={(e) => {
                            if (e.target.value !== 'Custom') handleInputChange('colorsTrack', e.target.value);
                        }}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {STANDARD_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="Custom">Custom Color Code...</option>
                    </select>
                    {!STANDARD_COLORS.includes(formData.colorsTrack) && (
                        <input
                            type="text"
                            placeholder="Type custom color track..."
                            value={formData.colorsTrack}
                            onChange={(e) => handleInputChange('colorsTrack', e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none mt-1"
                        />
                    )}
                </div>

                {/* Fabric Material Hybrid */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fabric Material</label>
                    <select
                        value={STANDARD_FABRICS.includes(formData.fabricMaterial) ? formData.fabricMaterial : 'Custom'}
                        onChange={(e) => {
                            if (e.target.value !== 'Custom') handleInputChange('fabricMaterial', e.target.value);
                        }}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {STANDARD_FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                        <option value="Custom">Custom Fabric Material...</option>
                    </select>
                    {!STANDARD_FABRICS.includes(formData.fabricMaterial) && (
                        <input
                            type="text"
                            placeholder="Type custom fabric material..."
                            value={formData.fabricMaterial}
                            onChange={(e) => handleInputChange('fabricMaterial', e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none mt-1"
                        />
                    )}
                </div>

                {/* Sleeves Style Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Sleeves Style</label>
                    <select
                        value={formData.sleevesStyle}
                        onChange={(e) => handleInputChange('sleevesStyle', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {SLEEVES_OPTIONS.map(sl => <option key={sl} value={sl}>{sl}</option>)}
                    </select>
                </div>

                {/* Fit Type Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fit Type</label>
                    <select
                        value={formData.fitType}
                        onChange={(e) => handleInputChange('fitType', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {FIT_OPTIONS.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                    </select>
                </div>

                {/* Occasion Focus Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Occasion Focus</label>
                    <select
                        value={formData.occasionFocus}
                        onChange={(e) => handleInputChange('occasionFocus', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {OCCASION_OPTIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                    </select>
                </div>

                {/* Gender Profile Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Gender Profile</label>
                    <select
                        value={formData.genderProfile}
                        onChange={(e) => handleInputChange('genderProfile', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* Target Age Group Dropdown */}
                <div className="flex flex-col sm:col-span-2 gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Target Age Group</label>
                    <select
                        value={formData.targetAgeGroup}
                        onChange={(e) => handleInputChange('targetAgeGroup', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {AGE_GROUP_OPTIONS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default VariantsMatrixNode;