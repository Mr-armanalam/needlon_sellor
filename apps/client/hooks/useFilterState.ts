import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useCallback } from "react";

export const useFilterState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize selected filters to prevent unnecessary re-renders of the UI
  const selectedFilters = useMemo(() => {
    const params: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      params[key] = value.split(",");
    });
    return params;
  }, [searchParams]);

  const updateFilter = useCallback((groupSlug: string, optionSlug: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentGroup = selectedFilters[groupSlug] || [];
    
    const updatedGroup = checked
      ? [...currentGroup, optionSlug]
      : currentGroup.filter((slug) => slug !== optionSlug);

    if (updatedGroup.length > 0) {
      params.set(groupSlug, updatedGroup.join(","));
    } else {
      params.delete(groupSlug);
    }

    // scroll: false prevents the page from jumping to the top on every click
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, selectedFilters, router]);

  const clearAll = useCallback(() => {
    router.push(window.location.pathname, { scroll: false });
  }, [router]);

  return { selectedFilters, updateFilter, clearAll };
};