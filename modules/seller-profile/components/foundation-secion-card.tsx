"use client";

import {
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
    FoundationSectionDto,
} from "../dto";
import React from "react";

interface Props {
    section: FoundationSectionDto;

    onOpen: (
        route: string,
    ) => void;
}

export function FoundationSectionCard({ section, onOpen, }: Props) {
    return (
        <div
            onClick={() => onOpen(section.route)}
            className={cn(
               "bg-white border relative border-gray-100 rounded-2xl p-5 shadow-xs space-y-3 cursor-pointer transition-all",
                "hover:border-blue-200 hover:shadow-sm",
            )}
        >

            <h3 className="text-xs font-bold text-gray-900"> {section.title} </h3>
            <div className="text-[11px] space-y-1 font-semibold">

                <p className="text-2.75 flex items-center font-semibold text-green-600">
                    <CheckCircle2 className="size-3 " /> &nbsp;
                    {section.progress}% Complete
                </p>

                {section.missingItems
                    .slice(0, 2)
                    .map((item) => (
                        <p
                            key={item}
                            className="flex font-semibold items-center text-amber-600"
                        >
                            {section.completed ? (
                                <CheckCircle2 className="size-3 text-green-600" />
                            ) : (
                                <AlertTriangle className="size-3 text-amber-600" />
                            )} &nbsp; {item} Missing
                        </p>
                    ))
                }

                {section.missingItems.length >
                    2 && (
                        <p className="text-xs text-gray-500">
                            + {section.missingItems.length - 2}{" "} more
                        </p>
                    )
                }

            </div>
        </div>
    );
}