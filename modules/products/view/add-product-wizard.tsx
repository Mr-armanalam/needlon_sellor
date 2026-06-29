import React, { useState } from 'react';
import { ChevronLeft, Upload, Sparkles, Check, ArrowRight, DollarSign, Layers, Truck, Eye } from 'lucide-react';

export default function AddProductWizard() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, label: "Photos" },
    { number: 2, label: "Basic Details" },
    { number: 3, label: "Pricing" },
    { number: 4, label: "Inventory" },
    { number: 5, label: "Delivery" },
    { number: 6, label: "Preview" }
  ];

  const handleNext = () => { if (currentStep < steps.length) setCurrentStep(prev => prev + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-neutral-100/80 rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col gap-6 transition-all duration-300">
      
      {/* 1. VISUAL STEP INDICATOR DECK */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-1">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center gap-2 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${
                currentStep >= step.number ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {currentStep > step.number ? <Check size={12} strokeWidth={3} /> : step.number}
              </div>
              <span className={`text-[13px] font-semibold tracking-tight ${
                currentStep === step.number ? 'text-neutral-900' : 'text-neutral-400'
              }`}>
                {step.label}
              </span>
              {idx !== steps.length - 1 && <span className="text-neutral-200 mx-1">/</span>}
            </div>
          ))}
        </div>
        <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* 2. DYNAMIC INPUT STEP RENDER VIEW */}
      <div className="min-h-[320px] py-2">
        
        {/* STEP 1: PHOTOS */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Upload Gallery Showcase</h3>
              <p className="text-[13px] text-neutral-400">Add clean, beautifully lit product photos for your boutique shelf.</p>
            </div>
            <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 bg-neutral-50/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group">
              <div className="p-3 rounded-xl bg-white text-neutral-400 group-hover:text-neutral-900 shadow-sm transition-transform group-hover:scale-105"><Upload size={20} /></div>
              <span className="text-[13px] font-semibold text-neutral-800">Drag or click to upload shop files</span>
            </div>
          </div>
        )}

        {/* STEP 2: BASIC DETAILS */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-0.5"><h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Basic Details</h3><p className="text-[13px] text-neutral-400">Essential details to define the item styling parameters.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Product Name</label><input type="text" placeholder="e.g. Handloom Chikankari Kurti" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Category</label><input type="text" placeholder="e.g. Ethnic Wear" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Fabric</label><input type="text" placeholder="e.g. 100% Cotton" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Sizes Available</label><input type="text" placeholder="e.g. S, M, L, XL" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING (FIXED FROM IMAGE OVERFLOW) */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Set Valuation</h3>
              <p className="text-[13px] text-neutral-400">Establish standard catalog retail pricing points and discounts.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Price (INR)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-bold text-neutral-400">₹</span>
                  <input type="text" placeholder="2,450" className="w-full pl-8 pr-4 p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Discount Offer (%)</label>
                <input type="text" placeholder="10%" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: INVENTORY */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-0.5"><h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Stock & SKU Level</h3><p className="text-[13px] text-neutral-400">Log item availability quantities to avoid overselling metrics.</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Stock Quantity Available</label><input type="number" placeholder="14" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">SKU / Item ID Reference</label><input type="text" placeholder="NDLN-KT-01" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
            </div>
          </div>
        )}

        {/* STEP 5: DELIVERY */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-0.5"><h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Logistics Mapping</h3><p className="text-[13px] text-neutral-400">Configure courier drop locations and shipping range parameters.</p></div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Pickup Warehouse Address</label><input type="text" placeholder="Hub Street Workshop, Block C, Mumbai" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
              <div className="flex flex-col gap-1.5"><label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Delivery Radius Availability</label><input type="text" placeholder="e.g. Nationwide shipping / Local (25 km)" className="w-full p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all" /></div>
            </div>
          </div>
        )}

        {/* STEP 6: PREVIEW */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-4 items-center justify-center text-center py-6 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900 shadow-sm"><Eye size={20} /></div>
            <div className="flex flex-col gap-1"><h3 className="text-[15px] font-bold text-neutral-900">Looks Excellent!</h3><p className="text-[13px] text-neutral-400 max-w-sm">Review your custom product cards. Click publish below to send it to the public storefront gallery.</p></div>
          </div>
        )}
      </div>

      {/* 3. STEPPER CONTROLS ACTION FOOTER */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
        <button onClick={handleBack} disabled={currentStep === 1} className={`px-4 py-2 text-[13px] font-bold rounded-xl flex items-center gap-1.5 outline-none ${currentStep === 1 ? 'text-neutral-300 pointer-events-none' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}>
          <ChevronLeft size={16} /><span>Back</span>
        </button>
        <button onClick={handleNext} className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-all outline-none shadow-sm group">
          <span>{currentStep === steps.length ? 'Publish Item' : 'Continue'}</span>
          {currentStep === steps.length ? <Sparkles size={14} /> : <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
        </button>
      </div>

    </div>
  );
}







// import React, { useState } from 'react';
// import { ChevronRight, ChevronLeft, Upload, Sparkles, Check, ArrowRight } from 'lucide-react';

// export default function AddProductWizard() {
//   const [currentStep, setCurrentStep] = useState(1);

//   const steps = [
//     { number: 1, label: "Photos" },
//     { number: 2, label: "Basic Details" },
//     { number: 3, label: "Pricing" },
//     { number: 4, label: "Inventory" },
//     { number: 5, label: "Delivery" },
//     { number: 6, label: "Preview" }
//   ];

//   const handleNext = () => {
//     if (currentStep < steps.length) setCurrentStep(prev => prev + 1);
//   };

//   const handleBack = () => {
//     if (currentStep > 1) setCurrentStep(prev => prev - 1);
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto bg-white border border-neutral-100 rounded-2xl p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.01)] flex flex-col gap-8 animate-fade-in">
      
//       {/* 1. TRACKER STEP HEADER */}
//       <div className="w-full flex flex-col gap-4">
//         <div className="flex items-center justify-between overflow-x-auto no-scrollbar pb-2">
//           {steps.map((step, idx) => (
//             <div key={step.number} className="flex items-center gap-2 shrink-0">
//               {/* Circular Indicator Badge */}
//               <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 ${
//                 currentStep >= step.number
//                   ? 'bg-neutral-900 text-white'
//                   : 'bg-neutral-100 text-neutral-400'
//               }`}>
//                 {currentStep > step.number ? <Check size={12} strokeWidth={3} /> : step.number}
//               </div>
              
//               {/* Step Text String */}
//               <span className={`text-[13px] font-semibold tracking-tight ${
//                 currentStep === step.number ? 'text-neutral-900' : 'text-neutral-400'
//               }`}>
//                 {step.label}
//               </span>

//               {/* Connecting Chevron Vector */}
//               {idx !== steps.length - 1 && (
//                 <ChevronRight size={14} className="text-neutral-300 mx-2" />
//               )}
//             </div>
//           ))}
//         </div>
        
//         {/* Flat Progress Strip indicator line */}
//         <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
//           <div 
//             className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
//             style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
//           />
//         </div>
//       </div>

//       {/* 2. CORE WIZARD CARD WRAPPER FRAME (Conditional Step Views) */}
//       <div className="min-h-[280px] py-2">
//         {currentStep === 1 && (
//           <div className="flex flex-col gap-4 animate-fade-in">
//             <div className="flex flex-col gap-0.5">
//               <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Upload Product Media</h3>
//               <p className="text-[13px] text-neutral-400">Add up to 5 clean, bright photos or a brief display video of your boutique apparel.</p>
//             </div>
            
//             {/* Drag and Drop Dropzone Frame */}
//             <div className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 bg-neutral-50/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors duration-200 cursor-pointer group">
//               <div className="p-3 rounded-full bg-white text-neutral-400 group-hover:text-neutral-900 shadow-sm transition-all duration-200 group-hover:scale-105">
//                 <Upload size={20} />
//               </div>
//               <div className="flex flex-col items-center text-center">
//                 <span className="text-[13px] font-semibold text-neutral-800">Click to upload media asset folder</span>
//                 <span className="text-[11px] text-neutral-400 mt-0.5">Supports PNG, JPEG, MP4 formats (Max 15MB)</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {currentStep === 2 && (
//           <div className="flex flex-col gap-4 animate-fade-in">
//             <div className="flex flex-col gap-0.5">
//               <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Basic Details</h3>
//               <p className="text-[13px] text-neutral-400">Provide the foundational styling metrics of your catalog item.</p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-[12px] font-bold text-neutral-500 tracking-tight uppercase">Product Name</label>
//                 <input type="text" placeholder="e.g. Handloom Chikankari Kurti" className="w-full p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all duration-200" />
//               </div>
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-[12px] font-bold text-neutral-500 tracking-tight uppercase">Category</label>
//                 <input type="text" placeholder="e.g. Ethnic Wear" className="w-full p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl text-[13px] outline-none focus:bg-white focus:border-neutral-900 transition-all duration-200" />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Placeholder fallback structures for steps 3, 4, 5, 6 for runtime consistency */}
//         {currentStep > 2 && (
//           <div className="flex flex-col items-center justify-center text-center gap-2 py-8 animate-fade-in">
//             <div className="p-3 rounded-xl bg-neutral-50 text-neutral-800 border border-neutral-100">
//               <Sparkles size={18} />
//             </div>
//             <span className="text-[14px] font-semibold text-neutral-800">{steps[currentStep - 1].label} Workspace Setup</span>
//             <span className="text-[12px] text-neutral-400 max-w-xs">Data forms drop into this area organically matching step progression context inputs.</span>
//           </div>
//         )}
//       </div>

//       {/* 3. CONTROL ACTION BUTTON FOOTER */}
//       <div className="flex items-center justify-between border-t border-neutral-100 pt-5 mt-2">
//         <button
//           onClick={handleBack}
//           disabled={currentStep === 1}
//           className={`px-4 py-2 text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-all outline-none ${
//             currentStep === 1
//               ? 'text-neutral-300 pointer-events-none'
//               : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
//           }`}
//         >
//           <ChevronLeft size={16} />
//           <span>Back</span>
//         </button>

//         <button
//           onClick={handleNext}
//           className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 transition-all group shadow-sm outline-none"
//         >
//           <span>{currentStep === steps.length ? 'Publish Product' : 'Continue'}</span>
//           {currentStep === steps.length ? (
//             <Sparkles size={14} />
//           ) : (
//             <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
//           )}
//         </button>
//       </div>

//     </div>
//   );
// }