interface ConversationListEmptyStateProps {
    hasSearch:
        boolean;
}

export function ConversationListEmptyState({
                                        hasSearch,
                                    }: ConversationListEmptyStateProps) {
    return (
        <div className="p-6 text-center">
        <p className="text-sm text-gray-500">
        {hasSearch
            ? "No conversations found."
            : "No conversations yet."}
    </p>
    </div>
);
}