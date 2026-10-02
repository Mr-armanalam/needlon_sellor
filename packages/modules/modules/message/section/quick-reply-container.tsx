import React from 'react';

const QuickReplyContainer = (
    {
        mockQuickReplies,
        onQuickReplyClick,
    }:{
        mockQuickReplies: string[];
        onQuickReplyClick: (reply: string) => void;
    }
) => {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-right">
            {mockQuickReplies.map((reply, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => onQuickReplyClick(reply)}
                    className="whitespace-nowrap text-xs bg-gray-50 border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 px-3 py-1.5 rounded-full transition-all flex-shrink-0 font-medium"
                >
                    {reply}
                </button>
            ))}
        </div>
    );
};

export default QuickReplyContainer;