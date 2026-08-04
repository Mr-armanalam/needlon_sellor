import React from 'react';
import {Image as ImageIcon} from "lucide-react";

const PreviewNPublicNode = () => {
    return (
        <div className="flex flex-col gap-5 items-center justify-center text-center py-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-md animate-bounce"><ImageIcon size={22} /></div>
            <div className="flex flex-col gap-1 max-w-sm">
                <h3 className="text-[16px] font-bold text-neutral-900">Your Shelf Item Looks Perfect!</h3>
                <p className="text-[13px] text-neutral-400">Everything is complete. Choose to lock it as a silent Draft or Publish it directly to your live public catalog.</p>
            </div>
        </div>

    );
};

export default PreviewNPublicNode;