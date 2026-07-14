
"use client";
import React, {useState, useRef, useEffect} from "react";
import { Upload, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SaveStatus } from "../view/seller-foundation-page";
import {useBusinessIdentityForm} from "@/modules/seller-profile/hooks/use-buisiness-identity-form";
import {BusinessType} from "@/modules/seller-profile/types/seller-profile-form";
import {BUSINESS_TYPES} from "@/modules/seller-profile/constants";
import {Spinner} from "@/components/ui/spinner";
import {SellerVerificationSection} from "@/modules/seller-profile/components";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";

export default function BusinessIdentitySection({
                                                  setSaveStatus,
                                                }: {
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const {
    form,
    setField,

    save,
    reset,

    uploadImage,

    isDirty,
    isSaving,
    isUploading,
    isLoading,
  } = useBusinessIdentityForm();


  // Trigger click on the hidden input element
  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  console.log(form, 'jkj')


  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file =
        e.target.files?.[0];

    if (!file) {
      return;
    }

    await uploadImage(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file =
          e.dataTransfer.files[0];

      if (!file) {
        return;
      }
      await uploadImage(file);
    }
  };

  useEffect(() => {
    if (isSaving || isUploading) {
      setSaveStatus("Saving...");
      return;
    }

    if (isDirty) {
      setSaveStatus("Changes pending");
      return;
    }

    setSaveStatus("Saved ✓");
  }, [
    isSaving,
    isUploading,
    isDirty,
  ]);

  // if (
  //     isLoading ||
  //     !form
  // ) {
  //   return (
  //       <BusinessIdentitySkeleton />
  //   );
  // }

  return (
      <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
        {/* SECTION HEADER BLOCK */}
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-sm font-bold text-gray-900">Business Identity</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Your legal business information used for marketplace identity management.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT COLUMN: IDENTITY CORDS */}
          <div className="lg:col-span-2 space-y-6">
            {/* CARD 1: PHOTO WORKSPACE */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Profile Photo
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                  {form?.profileImageUrl ? (
                      <img
                          src={
                              form?.profileImageUrl ??
                              'DEFAULT_AVATAR'
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                      />
                  ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        {isUploading && (
                            <Spinner />
                        )}
                      </>
                  )}
                </div>

                {/* HIDDEN NATIVE IMAGE INPUT ELEMENT */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    accept="image/*"
                    className="hidden"
                />

                {/* DRAG AND DROP TARGET ENGINE */}
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleDivClick}
                    className={`flex-1 w-full border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all text-xs ${
                        dragActive
                            ? "border-blue-600 bg-blue-50/20"
                            : "border-gray-200 hover:bg-slate-50/50"
                    }`}
                >
                  <p className="font-semibold text-gray-700">
                    Drag & drop profile picture or click to select
                  </p>
                  <span className="text-[10px] text-gray-400 block mt-0.5">
                  Supports high-res JPG or PNG file configurations
                </span>
                </div>
              </div>
            </div>

            {/* CARD 2: BUSINESS DETAILS LAYER */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-5">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Business Details
              </h3>

              {/* SUBSECTION 1: PERSONAL BASE */}
              <div className="space-y-3">
              <span className="text-[11px] font-bold text-blue-600 block">
                Personal Information
              </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Legal Full Name
                    </label>
                    <input
                        type="text"
                        placeholder={'Your Name'}
                        value={form?.displayName}
                        onChange={(e) =>
                            setField(
                                "displayName",
                                e.target.value,
                            )
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Primary Phone Number
                    </label>
                    <input
                        type="tel"
                        value={form?.phoneNumber ?? ''}
                        onChange={(e) =>
                            setField(
                                "phoneNumber",
                                e.target.value,
                            )
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* SUBSECTION 2: CORPORATE METRICS */}
              <div className="space-y-3 pt-2 border-t border-gray-50">
              <span className="text-[11px] font-bold text-blue-600 block">
                Business Details
              </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Business Operational Type
                    </label>
                    <select
                        value={form?.businessType ?? 'SOLE_PROPRIETORSHIP'}
                        onChange={(e)=>
                            setField(
                                "businessType",
                                e.target.value as BusinessType,
                            )
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      {BUSINESS_TYPES.map((type:string) => (
                          <option key={type} value={type}>
                            {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Official Corporate Email
                    </label>
                    <input
                        type="email"
                        placeholder="business@example.com"
                        value={form?.supportEmail ?? ""}
                        onChange={(e)=>
                            setField(
                                "supportEmail",
                                e.target.value,
                            )
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl text-xs px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* DEPLOY BUTTON ACTUATOR */}
              <div className="pt-2 border-t border-gray-50 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={reset}
                    className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-800 font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-xs shadow-gray-600/10"
                >
                  Reset
                </button>

                <button
                    type="button"
                    onClick={save}
                    disabled={
                        !isDirty ||
                        isSaving
                    }

                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-xs shadow-blue-600/10"
                >
                  {
                    isSaving
                        ? "Saving..."
                        : "Save Identity Details"
                  }
                </button>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PROGRESSIVE DOCUMENT CARDS */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Government Documents
                </h3>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Optional now. Provide these identifiers to scale business operations later.
                </p>
              </div>

              {/*<SellerVerificationSection />*/}

               {/*GST BLOCK*/}
              <Link href={'/profile/verification'} className="border cursor-pointer border-gray-100 hover:border-blue-800 hover:bg-gray-50 bg-gray-50/40 rounded-xl p-3 flex flex-col  gap-2">
                <div className={'flex items-center justify-between'}>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      GSTIN Registration
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Optional Verification
                    </span>
                  </div>
                <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors">
                  Add
                </button>
                </div>

                <Separator />

                <div className={'flex items-center justify-between'}>

                  <div>
                     <span className="text-xs font-bold text-gray-800 block">
                        Business PAN Card
                     </span>
                     <span className="text-[10px] text-gray-400 font-medium">
                        Optional Verification
                     </span>
                  </div>
                  <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors">
                    Add
                  </button>
                </div>

              </Link>

               {/*PAN BLOCK*/}
              {/*<div className="border border-gray-100 bg-gray-50/40 rounded-xl p-3 flex items-center justify-between gap-2">*/}
              {/*  <div>*/}
              {/*  <span className="text-xs font-bold text-gray-800 block">*/}
              {/*    Business PAN Card*/}
              {/*  </span>*/}
              {/*    <span className="text-[10px] text-gray-400 font-medium">*/}
              {/*    Optional Verification*/}
              {/*  </span>*/}
              {/*  </div>*/}
              {/*  <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors">*/}
              {/*    Add*/}
              {/*  </button>*/}
              {/*</div>*/}

              {/* VERIFICATION VALUE PROPOSITIONS */}
              <div className="bg-blue-50/30 border border-blue-100/60 rounded-xl p-3.5 space-y-2.5">
              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Account Perks Upon Submission
              </span>
                <ul className="space-y-2 text-[10px] text-blue-800 font-medium">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> Verified Seller storefront badge link
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> Automated compliance invoice prints
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> Priority domestic tax reporting systems
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

