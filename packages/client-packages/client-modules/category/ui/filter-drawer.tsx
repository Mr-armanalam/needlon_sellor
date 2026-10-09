"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useQuery } from "@tanstack/react-query";
import { X, RotateCcw, Filter } from "lucide-react";
import { useFilterState } from "@/hooks/useFilterState";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterDrawerProps {
  category: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FilterOption {
  id: string;
  label: string;
  slug: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  name: string;
  slug: string;
  options: FilterOption[];
}

interface FiltersApiResponse {
  filters: FilterGroup[];
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { selectedFilters, updateFilter, clearAll } = useFilterState();

  // 1. Data Fetching with TanStack Query (Server-state management)
  const { data, isLoading } = useQuery<FiltersApiResponse>({
    queryKey: ["filters", category],
    queryFn: async (): Promise<FiltersApiResponse> => {
      const res = await fetch(`/api/filters?category=${category}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  
  useGSAP(
    () => {
      if (isOpen) {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.to(overlayRef.current, { opacity: 1, duration: 0.4 })
          .to(drawerRef.current, { x: 0, duration: 0.6 }, "-=0.3")
          .from(
            ".stagger-item",
            {
              x: 20,
              opacity: 0,
              stagger: 0.05,
              duration: 0,
            },
            "-=0.1",
          );
      } else {
        gsap.to(drawerRef.current, {
          x: "100%",
          duration: 0.1,
          ease: "expo.in",
        });
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.05 });
      }
    },
    { dependencies: [isOpen], scope: containerRef },
  );

  if (!isOpen && !containerRef.current) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-100 flex justify-end ${!isOpen && "pointer-events-none"}`}
    >
      {/* Background Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 opacity-0 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Main Drawer */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-85 bg-white dark:bg-black dark:border-l h-full shadow-2xl translate-x-full flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Filter size={20} />
              Filter – {category.replace("-", " ")}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-slate-500">
            {isLoading
              ? "Updating results..."
              : `${data?.filters.length || 0} items found for ${category}`}
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full bg-slate-100 animate-pulse rounded"
                />
              ))}
            </div>
          ) : (
            data?.filters.map((group: FilterGroup) => (
              <div key={group.id} className="stagger-item mb-2">
                <Accordion
                  defaultValue={data.filters[0]?.slug}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem
                    value={group.slug}
                    className="border-none px-6"
                  >
                    <AccordionTrigger className="hover:no-underline font-medium py-3">
                      {group.name}
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-4">
                      {group.options.map((option: any) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 group"
                        >
                          <Checkbox
                            id={option.id}
                            checked={
                              selectedFilters[group.slug]?.includes(
                                option.slug,
                              ) || false
                            }
                            onCheckedChange={(checked) =>
                              updateFilter(group.slug, option.slug, !!checked)
                            }
                          />
                          <Label
                            htmlFor={option.id}
                            className="text-sm font-normal cursor-pointer flex-1 group-hover:text-blue-600 transition-colors"
                          >
                            {option.label}
                            {option.count && (
                              <span className="ml-2 text-slate-400">
                                ({option.count})
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Separator className="opacity-60" />
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-slate-50 dark:bg-yellow-700 grid grid-cols-2 gap-4">
          <button
            onClick={clearAll}
            className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-white cursor-pointer hover:text-slate-900"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button
            onClick={onClose}
            className="bg-black cursor-pointer text-white py-3 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;
