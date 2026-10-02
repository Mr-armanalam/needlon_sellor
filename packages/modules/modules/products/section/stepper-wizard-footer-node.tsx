import React from 'react';
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";
import {wizardSteps} from "@/modules/products/constants";
import {ArrowRight, ChevronLeft, Sparkles} from "lucide-react";

const StepperWizardFooterNode = () => {
    const {currentStep, handleNextStep, handleBackStep, isSubmitting, handleSaveProduct } = useAddProductWizard()
    return (
        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
                onClick={handleBackStep}
                disabled={currentStep === 1 || isSubmitting}
                className={`px-4 py-2 text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-colors outline-none ${
                    currentStep === 1 || isSubmitting ? 'text-neutral-300 pointer-events-none' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
            >
                <ChevronLeft size={16} />
                <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
                {currentStep === wizardSteps.length && (
                    <button
                        disabled={isSubmitting}
                        onClick={() => handleSaveProduct('DRAFT')}
                        className="px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 text-[13px] font-semibold rounded-xl transition-all outline-none"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Draft'}
                    </button>
                )}

                <button
                    disabled={isSubmitting}
                    onClick={currentStep === wizardSteps.length ? () => handleSaveProduct('PUBLISHED') : handleNextStep}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-all outline-none shadow-sm group"
                >
                    <span>{currentStep === wizardSteps.length ? (isSubmitting ? 'Publishing...' : 'Publish Product') : 'Continue'}</span>
                    {currentStep === wizardSteps.length ? (
                        <Sparkles size={14} />
                    ) : (
                        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    )}
                </button>
            </div>
        </div>

    );
};

export default StepperWizardFooterNode;