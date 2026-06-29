import { Check, X, MessageSquare } from "lucide-react";

const MetaValueQuickAction = () => {
  return (
    <div className="flex items-center gap-1.5">
      {/* Chat Action */}
      <button
        title="Chat with Customer"
        className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200"
      >
        <MessageSquare size={16} />
      </button>

      {/* Reject Action */}
      <button
        title="Decline Order"
        className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50/60 transition-all duration-200"
      >
        <X size={16} />
      </button>

      {/* Accept Primary Action */}
      <button
        title="Accept Order"
        className="p-2 rounded-xl text-neutral-900 hover:text-white hover:bg-neutral-900 border border-neutral-200/80 hover:border-transparent transition-all duration-200"
      >
        <Check size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default MetaValueQuickAction;
