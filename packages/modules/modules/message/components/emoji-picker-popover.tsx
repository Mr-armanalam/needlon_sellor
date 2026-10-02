interface EmojiPickerPopoverProps {
  showEmojiPicker: boolean;
  handleEmojiClick: (emoji: string) => void;
}

const EmojiPickerPopover: React.FC<EmojiPickerPopoverProps> = ({ showEmojiPicker, handleEmojiClick }) => {

    const emojis = ["😀", "😂", "😍", "👍", "🔥", "👏", "❤️", "🙌", "🎉", "💡", "🤔", "👀", "❌", "✅"];

    return (
        showEmojiPicker && (
            <div className="absolute right-12 bottom-16 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 flex gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                {emojis.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="text-lg hover:scale-125 transition-transform duration-75"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        )
    );
};

export default EmojiPickerPopover;