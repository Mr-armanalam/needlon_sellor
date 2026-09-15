export function ReviewResponseLoadingState() {
    return (
        <div
            aria-busy="true"
            className="mt-4 rounded-xl border border-gray-100 bg-white p-4"
        >
            <div className="animate-pulse space-y-2">
                <div className="h-3 w-32 rounded bg-gray-100" />

                <div className="h-3 w-full rounded bg-gray-100" />

                <div className="h-3 w-4/5 rounded bg-gray-100" />
            </div>
        </div>
    );
}

export function ReviewResponseErrorState({
                                             message = "Unable to load seller response.",
                                         }: {
    message?: string;
}) {
    return (
        <div
            role="alert"
            className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-4 text-xs text-rose-600"
        >
            {message}
        </div>
    );
}