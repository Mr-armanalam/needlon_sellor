'use client';

import React from 'react';
import {useAddProductWizard, AddProductWizardProvider} from "@/modules/products/hooks/use-add-product-wizard";
import HeaderReturnNavigator from "@/modules/products/components/header-return-navigator";
import StepperNodeProgressTracker from "@/modules/products/components/stepper-node-progress-tracker";
import UploadPhotosNVideosNode from "@/modules/products/section/upload-photos-n-videos-node";
import BasicInformationNode from "@/modules/products/section/basic-information-node";
import PricingSystemNode from "@/modules/products/section/pricing-system-node";
import VariantsMatrixNode from "@/modules/products/section/variants-matrix-node";
import InventryLevelNode from "@/modules/products/section/inventry-level-node";
import DeliveryLogisticsNode from "@/modules/products/section/delivery-logistics-node";
import SeoNTagsNode from "@/modules/products/section/seo-n-tags-node";
import PreviewNPublicNode from "@/modules/products/section/preview-n-public-node";
import StepperWizardFooterNode from "@/modules/products/section/stepper-wizard-footer-node";


function AddProductWizardContent({ onClose }: { onClose: () => void; }) {
  const { currentStep } = useAddProductWizard();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 animate-fade-in">
      
      {/* Header Return Navigator */}
      <HeaderReturnNavigator onClose={onClose} currentStep={currentStep} />

      {/* Stepper Node Progress Tracker */}
      <StepperNodeProgressTracker currentStep={currentStep} />

      {/* Active Container Panel Stage Area */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.015)] min-h-[380px] flex flex-col justify-between gap-8">
        
        <div className="w-full">
          {/* STEP 1: UPLOAD PHOTOS & VIDEOS */}
          {currentStep === 1 && (<UploadPhotosNVideosNode />)}
          {/* STEP 2: BASIC INFORMATION */}
          {currentStep === 2 && (<BasicInformationNode />)}
          {/* STEP 3: PRICING SYSTEM */}
          {currentStep === 3 && (<PricingSystemNode />)}
          {/* STEP 4: VARIANTS MATRIX */}
          {currentStep === 4 && (<VariantsMatrixNode />)}
          {/* STEP 5: INVENTORY LEVEL */}
          {currentStep === 5 && (<InventryLevelNode />)}
          {/* STEP 6: DELIVERY LOGISTICS */}
          {currentStep === 6 && (<DeliveryLogisticsNode />)}
          {/* STEP 7: SEO & TAGS (OPTIONAL) */}
          {currentStep === 7 && (<SeoNTagsNode />)}
          {/* STEP 8: PREVIEW & PUBLISH */}
          {currentStep === 8 && (<PreviewNPublicNode />)}
        </div>

        {/* Stepper Wizard Interactive Action Base Footer */}
        <StepperWizardFooterNode />
      </div>

    </div>
  );
}

export function AddProductWizard({ onClose }: { onClose: () => void; }) {
  return (
    <AddProductWizardProvider>
      <AddProductWizardContent onClose={onClose} />
    </AddProductWizardProvider>
  );
}
