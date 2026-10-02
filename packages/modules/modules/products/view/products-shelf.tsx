'use client';

import React from 'react';
import { ProductCard } from '../section/product-card';
import { AddProductWizard } from '../ui/add-product-wizard';
import { BulkUploadModal } from '../components/bulk-upload-modal';
import HeaderNBulkUploadOption from "@/modules/products/ui/header-n-bulk-upload-option";
import NavTabSearchNFilterBar from "@/modules/products/ui/nav-tab-search-n-filter-bar";
import ProductEmptyState from "@/modules/products/components/product-empty-state";
import {useProductUiSet, ProductUiProvider} from "@/modules/products/hooks/use-product-ui-set";

function ProductsShelfContent() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    viewMode,
    handleBulkUploadClick,
    handleBulkUploadFile,
    handleStartWizard,
    refetch,
    setViewMode,
    setIsBulkModalOpen,
    isCreatingDraft,
    products,
    isBulkModalOpen,
    isLoading,
  } = useProductUiSet();

  return (
    <div className="w-full h-screen overflow-y-auto bg-[#FAFAFA] font-sans select-none tracking-tight">
      {viewMode === 'shelf' ? (
        <div className="p-6 md:p-8 max-w-400 mx-auto w-full flex flex-col gap-6 animate-fade-in">
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleBulkUploadFile}
            accept=".json,.csv"
            className="hidden"
          />

          <HeaderNBulkUploadOption
              handleStartWizard={handleStartWizard}
              handleBulkUploadClick={handleBulkUploadClick}
              isCreatingDraft={isCreatingDraft}
          />

         <NavTabSearchNFilterBar />

          {isLoading ? (
            /* LOADING SKELETON GRID STAGE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white border border-neutral-100 rounded-2xl p-4 flex flex-col justify-between gap-4 animate-pulse">
                  {/* Aspect Square Placeholder */}
                  <div className="relative w-full aspect-square rounded-xl bg-neutral-100/70 overflow-hidden flex items-center justify-center" />
                  
                  {/* Details Placeholders */}
                  <div className="flex flex-col gap-2 px-0.5 mt-2">
                    <div className="h-3 w-2/3 bg-neutral-100 rounded" />
                    <div className="h-4 w-5/6 bg-neutral-100 rounded mt-1" />
                    <div className="h-4 w-1/3 bg-neutral-100 rounded mt-1" />
                    <div className="h-3 w-1/2 bg-neutral-100 rounded mt-2" />
                  </div>
                  
                  {/* Micro-Analytics Placeholders */}
                  <div className="grid grid-cols-3 gap-1 border-t border-neutral-100 pt-3 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-100" />
                      <div className="h-3 w-6 bg-neutral-100 rounded" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-100" />
                      <div className="h-3 w-6 bg-neutral-100 rounded" />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-100" />
                      <div className="h-3 w-6 bg-neutral-100 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <ProductEmptyState
                handleStartWizard={handleStartWizard}
                isCreatingDraft={isCreatingDraft}
            />
          ) : (
            /* PRODUCT BOUTIQUE GRID STAGE */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <AddProductWizard
          onClose={() => setViewMode('shelf')}
        />
      )}

      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

export function ProductsShelf() {
  return (
    <ProductUiProvider>
      <ProductsShelfContent />
    </ProductUiProvider>
  );
}

export default ProductsShelf;
