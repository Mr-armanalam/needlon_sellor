import type {
    ReportReviewInput,
} from "../validation/report-review";

export async function reportReview(
    input: ReportReviewInput,
) {
    const response =
        await fetch(
            "/api/seller/reviews/report",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body:
                    JSON.stringify(input),
            },
        );

    if (!response.ok) {
        const payload =
            await response
                .json()
                .catch(
                    () => null,
                );

        throw new Error(
            payload?.message ??
            "Unable to report the review.",
        );
    }

    return response.json();
}