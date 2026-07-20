'use client';

import React, { useState } from 'react';
import { Folder, FolderOpen, ChevronRight, Plus, Trash2, Layers } from 'lucide-react';
import { useCategories } from '../hooks';
import { CategoryTreeNode } from '../types';
import { AddCategoryModal } from './add-category-modal';

export function CategoryTreeView() {
  const { categories, isLoading, removeCategory, refetch } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: CategoryTreeNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = Boolean(expandedNodes[node.id]);

    return (
      <div key={node.id} className="flex flex-col gap-1 pl-4 border-l border-neutral-200/60 my-1">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-100 hover:border-neutral-200 transition-all shadow-2xs group">
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => hasChildren && toggleNode(node.id)}>
            {hasChildren ? (
              <ChevronRight size={14} className={`text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            ) : (
              <span className="w-3.5" />
            )}
            {isExpanded ? <FolderOpen size={16} className="text-amber-500" /> : <Folder size={16} className="text-neutral-400" />}
            <span className="text-[13px] font-semibold text-neutral-800 tracking-tight">{node.name}</span>
            <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">{node.slug}</span>
          </div>

          <button onClick={() => removeCategory(node.id)} className="p-1.5 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 size={13} />
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col gap-1">
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-6 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[20px] font-bold text-neutral-900 tracking-tight">Category Hierarchy</h2>
          <p className="text-[13px] text-neutral-400">Manage apparel categories, subcategories, and taxonomy trees.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-neutral-900 text-white text-[13px] font-bold rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-neutral-800 transition-all"
        >
          <Plus size={15} />
          <span>Add Category</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-[13px] text-neutral-400">Loading catalog tree...</div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-200 rounded-2xl bg-white">
          <Layers size={24} className="text-neutral-400" />
          <span className="text-[13px] font-semibold text-neutral-700">No categories found</span>
          <button onClick={() => setIsModalOpen(true)} className="px-3.5 py-1.5 bg-neutral-900 text-white text-[12px] font-bold rounded-xl">Create Category</button>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {categories.map(renderNode)}
        </div>
      )}

      <AddCategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

export default CategoryTreeView;
