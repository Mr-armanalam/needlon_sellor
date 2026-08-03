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

          {products.length === 0 ? (
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
