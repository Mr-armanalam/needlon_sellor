"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ShieldAlert, CheckCircle2, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { submitReview, fetchProductReview } from "@/features/rating-slice";
import { AppDispatch } from "@/store/store";

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  orderItemId: string;
  itemName?: string;
  isDelivered: boolean;
}

export default function ProductReviewModal({
  isOpen,
  onClose,
  productId,
  orderItemId,
  itemName,
  isDelivered,
}: ProductReviewModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      alert("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      alert("Please provide a brief review description");
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(
        submitReview({
          productId,
          orderItemId,
          rating,
          comment: comment.trim(),
        })
      ).unwrap();

      if (productId) {
        await dispatch(fetchProductReview(productId));
      } else {
        await dispatch(fetchProductReview());
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1500);
    } catch (err: unknown) {
      alert((err instanceof Error ? err.message : "") || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-white">
            {isDelivered ? "Rate Your Garment & Tailor" : "Review Locked"}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
            {itemName ? `${itemName} • ` : ""}Order Item #{orderItemId.slice(0, 8)}
          </DialogDescription>
        </DialogHeader>

        {!isDelivered ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Review Available After Delivery
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Reviews and ratings can only be submitted once the product order has been safely delivered or completed.
              </p>
            </div>
            <Button
              onClick={onClose}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-xl px-6 cursor-pointer"
            >
              Understood
            </Button>
          </div>
        ) : submitted ? (
          <div className="py-8 space-y-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
              Thank You For Your Review!
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Your feedback helps your atelier and other buyers.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-2">
                Overall Garment & Fitting Rating
              </label>
              <div className="flex items-center gap-1.5 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition cursor-pointer"
                  >
                    <Star
                      size={20}
                      className={`transition ${
                        (hover || rating) >= star
                          ? "text-amber-400 fill-amber-400"
                          : "text-neutral-300 dark:text-neutral-600"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1.5">
                Detailed Feedback & Atelier Experience
              </label>
              <Textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on the fit, fabric quality, stitching, and atelier craftsmanship..."
                className="text-xs rounded-xl bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-xl cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
