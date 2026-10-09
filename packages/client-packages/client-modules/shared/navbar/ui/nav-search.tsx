"use client";

/*

 > hit endpoint '/api/search/suggestion' get data as suggestion, cached 5 mins
 > hit endpoint '/api/search?q=debouncequery' get matched search results
 > Add Keyboarc cmd + 'k' shortcut events
 > During every search loading spinner is shown, if searching state, result and query isn't present than showing 'NOT FOUND' to the client
 > By default, we show suggestion initially as a recent or suggested product item if no search query
 > Search result show with category name and product name 

*/

import * as React from "react";
import { Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce"; 

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { useCustomSearchParams } from "../../navigation/set-search-params";
import { suggestionAndRecentSearch } from "@/types/product";
import SearchSuggestion from "../components/search-gesstion";

type PreSuggestion = {
  recent: suggestionAndRecentSearch[];
  suggested: suggestionAndRecentSearch[];
};

export function NavSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { setParam } = useCustomSearchParams();

  const { data: suggestions } = useQuery<PreSuggestion>({
    queryKey: ["search-suggestions"],
    queryFn: () =>
      fetch("/api/search/suggestion", {
        headers: {},
      }).then((res) => res.json()),
    enabled: open,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  const { data: results, isLoading: isSearching } = useQuery({
    queryKey: ["search-results", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const res = await fetch(`/api/search?q=${debouncedQuery}`);
      const json = await res.json();
      return json.searchResult as Record<string, suggestionAndRecentSearch[]>;
    },
    enabled: debouncedQuery.length > 0,
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (item: suggestionAndRecentSearch) => {
    setParam({
      value: item.category,
      navigate: true,
      path: item.subcategory,
    });
    setOpen(false);
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-[#cccccc]/40 dark:bg-black dark:hover:bg-white/4 transition-all hover:bg-muted border py-1 pl-4 pr-2 h-8.5 min-w-52.5 backdrop-blur-md rounded-md flex items-center cursor-pointer text-sm text-muted-foreground"
      >
        <Search className="mr-2 h-4 w-4" />
        Search clothes...
        <Kbd className="ml-auto">
          <span className="text-xs">⌘</span>K
        </Kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search clothes here..."
        />
        <CommandList className="no-scrollbar min-h-75">
          {/* Loading State */}
          {isSearching && (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!isSearching && debouncedQuery && !results && (
            <CommandEmpty>No results found for "{query}".</CommandEmpty>
          )}

          {!query && suggestions && (
            <>
              {suggestions.recent?.length > 0 && (
                <SearchSuggestion
                  heading_name="Recent"
                  recent={suggestions.recent}
                  handleOnSelect={handleSelect}
                />
              )}
              {suggestions.suggested?.length > 0 && (
                <SearchSuggestion
                  heading_name="Suggested"
                  recent={suggestions.suggested}
                  handleOnSelect={handleSelect}
                />
              )}
            </>
          )}

          {/* Search Results */}
          {query &&
            results &&
            !isSearching &&
            Object.entries(results).map(([categoryName, items], i) => (
              <SearchSuggestion
                key={i}
                heading_name={categoryName}
                recent={items}
                handleOnSelect={handleSelect}
              />
            ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
