"use client";

import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { SellerVerificationDto } from "../dto";

interface Props {
    verification: SellerVerificationDto;

    canSubmit: boolean;

    loading?: boolean;

    onSubmit: () => void;
}

export function SubmitVerificationCard({
                                           verification,
                                           canSubmit,
                                           loading = false,
                                           onSubmit,
                                       }: Props) {

    const disabled =
        !canSubmit ||
        loading ||
        verification.verification.status ===
        "UNDER_REVIEW" ||
        verification.verification.status ===
        "VERIFIED";

    return (
        <Card>

            <CardHeader>

                <CardTitle>
                    Submit Verification
                </CardTitle>

                <CardDescription>
                    After submitting, our team will
                    review your documents. During the
                    review period you won&apos;t be able to
                    modify uploaded documents.
                </CardDescription>

            </CardHeader>

            <CardContent>

                {verification.verification.status ===
                    "NOT_SUBMITTED" && (
                        <p className="text-sm text-muted-foreground">
                            Upload all required documents
                            before submitting.
                        </p>
                    )}

                {verification.verification.status ===
                    "REJECTED" && (
                        <p className="text-sm text-destructive">
                            Please resolve rejected
                            documents before submitting
                            again.
                        </p>
                    )}

                {verification.verification.status ===
                    "UNDER_REVIEW" && (
                        <p className="text-sm text-muted-foreground">
                            Your documents are currently
                            under review.
                        </p>
                    )}

                {verification.verification.status ===
                    "VERIFIED" && (
                        <p className="text-sm text-green-600">
                            Congratulations! Your seller
                            account has already been
                            verified.
                        </p>
                    )}

            </CardContent>

            <CardFooter>

                <Button
                    className="w-full"
                    disabled={disabled}
                    onClick={onSubmit}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />

                            Submit For Review
                        </>
                    )}
                </Button>

            </CardFooter>

        </Card>
    );
}