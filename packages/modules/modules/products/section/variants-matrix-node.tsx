import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {
    AGE_GROUP_OPTIONS,
    FIT_OPTIONS,
    GENDER_OPTIONS,
    OCCASION_OPTIONS,
    SLEEVES_OPTIONS,
    STANDARD_COLORS,
    STANDARD_FABRICS,
    STANDARD_SIZES,
    isBottomWearSubcategory
} from "@/modules/products/constants";
import { Plus, Trash2 } from "lucide-react";

const VariantsMatrixNode = () => {
    const {formData, handleInputChange, handleToggleSize} = useAddProductWizard();

    const [isCustomColor, setIsCustomColor] = React.useState<boolean>(() => {
        return Boolean(formData.colorsTrack && !STANDARD_COLORS.includes(formData.colorsTrack));
    });
    const [isCustomFabric, setIsCustomFabric] = React.useState<boolean>(() => {
        return Boolean(formData.fabricMaterial && !STANDARD_FABRICS.includes(formData.fabricMaterial));
    });

    React.useEffect(() => {
        if (formData.colorsTrack && !STANDARD_COLORS.includes(formData.colorsTrack)) {
            setIsCustomColor(true);
        }
    }, [formData.colorsTrack]);

    React.useEffect(() => {
        if (formData.fabricMaterial && !STANDARD_FABRICS.includes(formData.fabricMaterial)) {
            setIsCustomFabric(true);
        }
    }, [formData.fabricMaterial]);

    const isColorCustomActive = isCustomColor || (Boolean(formData.colorsTrack) && !STANDARD_COLORS.includes(formData.colorsTrack));
    const selectColorValue = isColorCustomActive ? 'Custom' : (formData.colorsTrack || STANDARD_COLORS[0]);

    const handleColorSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'Custom') {
            setIsCustomColor(true);
            if (STANDARD_COLORS.includes(formData.colorsTrack)) {
                handleInputChange('colorsTrack', '');
            }
        } else {
            setIsCustomColor(false);
            handleInputChange('colorsTrack', val);
        }
    };

    const isFabricCustomActive = isCustomFabric || (Boolean(formData.fabricMaterial) && !STANDARD_FABRICS.includes(formData.fabricMaterial));
    const selectFabricValue = isFabricCustomActive ? 'Custom' : (formData.fabricMaterial || STANDARD_FABRICS[0]);

    const handleFabricSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'Custom') {
            setIsCustomFabric(true);
            if (STANDARD_FABRICS.includes(formData.fabricMaterial)) {
                handleInputChange('fabricMaterial', '');
            }
        } else {
            setIsCustomFabric(false);
            handleInputChange('fabricMaterial', val);
        }
    };

    // Bottom wear detection for Sleeves Style
    const isBottomWear = React.useMemo(() => {
        return isBottomWearSubcategory(formData.subcategory);
    }, [formData.subcategory]);

    const [isCustomSleeves, setIsCustomSleeves] = React.useState<boolean>(() => {
        return Boolean(formData.sleevesStyle && !SLEEVES_OPTIONS.includes(formData.sleevesStyle));
    });

    React.useEffect(() => {
        if (formData.sleevesStyle && !SLEEVES_OPTIONS.includes(formData.sleevesStyle)) {
            setIsCustomSleeves(true);
        }
    }, [formData.sleevesStyle]);

    const isSleevesCustomActive = isCustomSleeves || (Boolean(formData.sleevesStyle) && !SLEEVES_OPTIONS.includes(formData.sleevesStyle));
    const selectSleevesValue = isSleevesCustomActive 
        ? 'Custom' 
        : (formData.sleevesStyle || 'None / Not Applicable');

    const handleSleevesSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'Custom') {
            setIsCustomSleeves(true);
            if (SLEEVES_OPTIONS.includes(formData.sleevesStyle)) {
                handleInputChange('sleevesStyle', '');
            }
        } else {
            setIsCustomSleeves(false);
            handleInputChange('sleevesStyle', val);
        }
    };

    // Fit Type Hybrid Handling (Formal Fits: Tailored, Classic, Modern + Custom)
    const [isCustomFit, setIsCustomFit] = React.useState<boolean>(() => {
        return Boolean(formData.fitType && !FIT_OPTIONS.includes(formData.fitType));
    });

    React.useEffect(() => {
        if (formData.fitType && !FIT_OPTIONS.includes(formData.fitType)) {
            setIsCustomFit(true);
        }
    }, [formData.fitType]);

    const isFitCustomActive = isCustomFit || (Boolean(formData.fitType) && !FIT_OPTIONS.includes(formData.fitType));
    const selectFitValue = isFitCustomActive ? 'Custom' : (formData.fitType || FIT_OPTIONS[0]);

    const handleFitSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'Custom') {
            setIsCustomFit(true);
            if (FIT_OPTIONS.includes(formData.fitType)) {
                handleInputChange('fitType', '');
            }
        } else {
            setIsCustomFit(false);
            handleInputChange('fitType', val);
        }
    };

    // Custom Garment Properties
    const customAttributes: Array<{ name: string; value: string }> = Array.isArray(formData.customAttributes)
        ? formData.customAttributes
        : [];

    const handleAddCustomProperty = () => {
        handleInputChange('customAttributes', [...customAttributes, { name: '', value: '' }]);
    };

    const handleUpdateCustomProperty = (index: number, field: 'name' | 'value', value: string) => {
        const updated = customAttributes.map((attr, idx) => {
            if (idx === index) {
                return { ...attr, [field]: value };
            }
            return attr;
        });
        handleInputChange('customAttributes', updated);
    };

    const handleRemoveCustomProperty = (index: number) => {
        const updated = customAttributes.filter((_, idx) => idx !== index);
        handleInputChange('customAttributes', updated);
    };

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
                        value={selectColorValue}
                        onChange={handleColorSelectChange}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {STANDARD_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="Custom">Custom Color Code...</option>
                    </select>
                    {isColorCustomActive && (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="text"
                                placeholder="Type custom color or color code (e.g. #FF5733, Navy Blue)..."
                                value={formData.colorsTrack}
                                onChange={(e) => handleInputChange('colorsTrack', e.target.value)}
                                className="flex-1 p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none focus:border-neutral-900 transition-all"
                            />
                            <input
                                type="color"
                                value={/^#[0-9A-Fa-f]{6}$/.test(formData.colorsTrack) ? formData.colorsTrack : '#000000'}
                                onChange={(e) => handleInputChange('colorsTrack', e.target.value)}
                                title="Pick color code"
                                className="w-8 h-8 p-0.5 rounded-lg border border-neutral-200/80 cursor-pointer bg-white"
                            />
                        </div>
                    )}
                </div>

                {/* Fabric Material Hybrid */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fabric Material</label>
                    <select
                        value={selectFabricValue}
                        onChange={handleFabricSelectChange}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {STANDARD_FABRICS.map(f => <option key={f} value={f}>{f}</option>)}
                        <option value="Custom">Custom Fabric Material...</option>
                    </select>
                    {isFabricCustomActive && (
                        <input
                            type="text"
                            placeholder="Type custom fabric material (e.g. 100% Organic Bamboo Silk)..."
                            value={formData.fabricMaterial}
                            onChange={(e) => handleInputChange('fabricMaterial', e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none mt-1 focus:border-neutral-900 transition-all"
                        />
                    )}
                </div>

                {/* Sleeves Style Hybrid */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            Sleeves Style
                        </label>
                        {isBottomWear && (
                            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                                Not applicable for bottom wear
                            </span>
                        )}
                    </div>
                    <select
                        value={selectSleevesValue}
                        onChange={handleSleevesSelectChange}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {SLEEVES_OPTIONS.map(sl => <option key={sl} value={sl}>{sl}</option>)}
                        <option value="Custom">Custom Sleeve Style...</option>
                    </select>
                    {isSleevesCustomActive && (
                        <input
                            type="text"
                            placeholder="Type custom sleeve style (e.g. Bell Sleeve, Raglan Sleeve, French Cuff)..."
                            value={formData.sleevesStyle}
                            onChange={(e) => handleInputChange('sleevesStyle', e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none mt-1 focus:border-neutral-900 transition-all"
                        />
                    )}
                </div>

                {/* Fit Type Hybrid (Includes Formal Wear Fits: Tailored, Classic, Modern Fit & Custom) */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            Fit Type
                        </label>
                        <span className="text-[10px] text-neutral-400">Formal & Regular Fits</span>
                    </div>
                    <select
                        value={selectFitValue}
                        onChange={handleFitSelectChange}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {FIT_OPTIONS.map(ft => <option key={ft} value={ft}>{ft}</option>)}
                        <option value="Custom">Custom Fit Type...</option>
                    </select>
                    {isFitCustomActive && (
                        <input
                            type="text"
                            placeholder="Type custom fit type (e.g. Tailored Slim Fit, Classic Tuxedo Fit)..."
                            value={formData.fitType}
                            onChange={(e) => handleInputChange('fitType', e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-200/80 rounded-lg text-[12px] outline-none mt-1 focus:border-neutral-900 transition-all"
                        />
                    )}
                </div>

                {/* Occasion Focus Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Occasion Focus</label>
                    <select
                        value={formData.occasionFocus || OCCASION_OPTIONS[0]}
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
                        value={formData.genderProfile || GENDER_OPTIONS[0]}
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
                        value={formData.targetAgeGroup || AGE_GROUP_OPTIONS[0]}
                        onChange={(e) => handleInputChange('targetAgeGroup', e.target.value)}
                        className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all cursor-pointer"
                    >
                        {AGE_GROUP_OPTIONS.map(ag => <option key={ag} value={ag}>{ag}</option>)}
                    </select>
                </div>
            </div>

            {/* Custom Properties Section */}
            <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200/60 mt-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-[13px] font-semibold text-neutral-900">Custom Garment Properties</h4>
                        <p className="text-[11px] text-neutral-400">Add bespoke specifications (e.g. Waist Rise, Pattern, Lapel Style, Closure, Length).</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleAddCustomProperty}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-medium rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Custom Property</span>
                    </button>
                </div>

                {customAttributes.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                        {customAttributes.map((attr, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Property Name (e.g. Waist Rise, Pattern, Lapel)"
                                    value={attr.name}
                                    onChange={(e) => handleUpdateCustomProperty(idx, 'name', e.target.value)}
                                    className="flex-1 p-2.5 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[12px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Property Value (e.g. Mid Rise, Solid, Peak Lapel)"
                                    value={attr.value}
                                    onChange={(e) => handleUpdateCustomProperty(idx, 'value', e.target.value)}
                                    className="flex-1 p-2.5 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[12px] outline-none focus:bg-white focus:border-neutral-900 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCustomProperty(idx)}
                                    className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                                    title="Remove property"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VariantsMatrixNode;