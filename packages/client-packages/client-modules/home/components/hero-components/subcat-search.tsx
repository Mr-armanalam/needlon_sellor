"use client";
import { heroProps } from "@/app/(root)/(home)/@hero_section/page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCustomSearchParams } from "@/modules/shared/navigation/set-search-params";
import React, { useEffect, useRef, useState } from "react";

export default function SubcatSearch({subCatSearchesItem}:{subCatSearchesItem: Pick<heroProps, 'id' | 'name' | 'slug' | 'image' | 'for_which' >[]}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showAllSubcat, setshowAllSubcat] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const {setParam} = useCustomSearchParams();

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
    };
  }, []);
  

  return (
    <div className="relative top-1">
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-linear-to-r from-white to-transparent pointer-events-none" />
      )}

      <div
        ref={containerRef}
        className="flex gap-x-4 overflow-x-auto no-scrollbar"
      >
        <Button
          className={cn(
            "text-xs cursor-pointer bg-gray-900 text-white dark:border hover:bg-black disabled:bg-black"
          )}
          variant={"secondary"}
          size={"sm"}
        >
          Explore
        </Button>

        {subCatSearchesItem.slice(0, showAllSubcat ? -1 : 5).map((item, i) => (
          <Button
            key={i}
            className={cn("text-xs cursor-pointer dark:border dark:hover:bg-black dark:bg-white/5 hover:bg-zinc-300")}
            variant={"secondary"}
            size={"sm"}
            onClick={() =>setParam({value: item.slug.toString(), navigate: true, path: `${item.for_which}`})
            }
          >
            {item.name.toLowerCase()}
          </Button>
        ))}

        <Button
          className={cn("text-xs cursor-pointer dark:border dark:hover:bg-black dark:bg-white/5 hover:bg-zinc-300")}
          variant={"secondary"}
          size={"sm"}
          onClick={() => setshowAllSubcat((previousState) => !previousState)}
        >
          {showAllSubcat ? "see less" : "see all"}
        </Button>
      </div>

      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-linear-to-l from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
}
