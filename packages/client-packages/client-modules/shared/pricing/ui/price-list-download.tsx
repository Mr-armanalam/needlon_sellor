import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

const PriceListDownload = ({
  handleDownload,
  isGenerating,
}: {
  handleDownload: () => void;
  isGenerating: boolean;
}) => {
  return (
    <Button
      disabled={isGenerating}
      variant={"outline"}
      onClick={handleDownload}
      className={cn("absolute ml-6  mt-6 cursor-pointer text-black dark:bg-white/3 dark:text-white hover:text-black hover:scale-105 p-4 w-fit rounded-full")}
    >
      Download
    </Button>
  );
};

export default PriceListDownload;
