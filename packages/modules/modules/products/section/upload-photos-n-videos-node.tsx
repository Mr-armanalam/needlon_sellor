import React from 'react';
import {Loader2, MoveLeft, MoveRight, Star, Trash2, Upload} from "lucide-react";
import {useAddProductWizard} from "@/modules/products/hooks/use-add-product-wizard";

const UploadPhotosNVideosNode = () => {
    const {
        fileInputRef,
        handleFileUpload,
        handleDrop,
        handleDragLeave,
        handleDragOver,
        handleDeleteMedia,
        handleMoveMedia,
        handleSetThumbnail,
        isDraggingOver,
        isUploadingMedia,
        mediaAssets,
    } = useAddProductWizard()
    return (
        <div className="flex flex-col gap-5 animate-fade-in">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">Upload Media Assets</h3>
                <p className="text-[13px] text-neutral-400">Add up to 5 clear showcase photos and high-definition video loops of your fabric item.</p>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4"
                className="hidden"
                onChange={handleFileUpload}
            />

            {/* Dropzone Upload Button */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer group ${
                    isDraggingOver
                        ? "border-neutral-900 bg-neutral-100/80"
                        : "border-neutral-200 hover:border-neutral-400 bg-neutral-50/40"
                }`}
            >
                <div className="p-3 rounded-xl bg-white text-neutral-400 group-hover:text-neutral-900 shadow-sm transition-transform group-hover:scale-105">
                    {isUploadingMedia ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                </div>
                <span className="text-[13px] font-semibold text-neutral-800">
                  {isUploadingMedia ? "Uploading media assets..." : isDraggingOver ? "Drop files here to upload" : "Drag files or click to map folder location"}
                </span>
                <span className="text-[11px] text-neutral-400">Supports JPEG, PNG, MP4 (Max 1080p profile)</span>
            </div>

            {/* Uploaded Media Gallery Deck */}
            {mediaAssets.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                    <h4 className="text-[13px] font-bold text-neutral-800 tracking-tight">Uploaded Gallery ({mediaAssets.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {mediaAssets.map((asset, idx) => (
                            <div key={asset.id} className="relative group bg-neutral-50 rounded-xl border border-neutral-200/80 overflow-hidden flex flex-col">
                                <div className="relative aspect-square w-full bg-neutral-100 flex items-center justify-center overflow-hidden">
                                    <img src={asset.imageUrl} alt={asset.fileName} className="w-full h-full object-cover" />

                                    {asset.isPrimary && (
                                        <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              <span>Thumbnail</span>
                            </span>
                                    )}
                                </div>

                                <div className="p-2 flex items-center justify-between bg-white border-t border-neutral-100">
                                    <div className="flex items-center gap-1">
                                        <button
                                            disabled={idx === 0}
                                            onClick={() => handleMoveMedia(idx, 'left')}
                                            className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30"
                                            title="Move left"
                                        >
                                            <MoveLeft size={12} />
                                        </button>
                                        <button
                                            disabled={idx === mediaAssets.length - 1}
                                            onClick={() => handleMoveMedia(idx, 'right')}
                                            className="p-1 text-neutral-400 hover:text-neutral-900 disabled:opacity-30"
                                            title="Move right"
                                        >
                                            <MoveRight size={12} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {!asset.isPrimary && (
                                            <button
                                                onClick={() => handleSetThumbnail(asset.id)}
                                                className="p-1 text-neutral-400 hover:text-amber-600"
                                                title="Set as thumbnail"
                                            >
                                                <Star size={12} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteMedia(asset.id)}
                                            className="p-1 text-neutral-400 hover:text-red-600"
                                            title="Delete image"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadPhotosNVideosNode;