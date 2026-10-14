"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Star, Lock } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductReview,
  submitReview,
  setRating,
  setHover,
  setComment,
  clearRatingState,
} from "@/features/rating-slice";

import { RootState, AppDispatch } from "@/store/store";

type Props = {
  orderItemId: string;
  productId: string;
  isMobile: boolean;
  isDelivered?: boolean;
};

const OrderRating = ({
  isMobile,
  orderItemId,
  productId,
  isDelivered = true,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const { allRating, rating, hover, comment } = useSelector(
    (state: RootState) => state.rating
  );

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductReview(productId));
    } else {
      dispatch(fetchProductReview());
    }
  }, [dispatch, productId]);

  const handleSubmit = async () => {
    if (!rating) return alert("Please select a rating");

    try {
      await dispatch(
        submitReview({
          productId,
          orderItemId,
          rating,
          comment,
        })
      ).unwrap();

      if (productId) {
        await dispatch(fetchProductReview(productId));
      } else {
        await dispatch(fetchProductReview());
      }
      alert("Review submitted!");
      dispatch(clearRatingState());
    } catch (err: any) {
      alert(err?.message || "Failed to submit review");
    }
  };

  const existingReview = allRating?.find(
    (r) =>
      r.orderItemId === orderItemId ||
      (orderItemId && (r as any)?.metadata?.orderItemId === orderItemId) ||
      (r.productId === productId && (r.orderItemId === orderItemId || (r as any)?.metadata?.orderItemId === orderItemId))
  );


  const shouldShowForm = !existingReview;

  return (
    <section className="m-4 p-4 flex flex-col gap-y-3 dark:bg-black bg-stone-200 rounded-md">
      {!isDelivered ? (
        <div className="flex items-center gap-2.5 py-1 text-xs text-neutral-600 dark:text-neutral-400">
          <Lock className="w-4 h-4 text-neutral-500 shrink-0" />
          <span>Product review & rating will become available once your item has been delivered.</span>
        </div>
      ) : shouldShowForm ? (
        <>
          <div className="flex max-md:items-center justify-between">
            <h1 className="font-semibold">{isMobile ? "🫠" : "Rate your experience"}</h1>
            <div className="flex text-sm font-semibold dark:border-none border">
              <Button
                size="sm"
                type="button"
                className="h-3 hover:bg-transparent cursor-pointer"
                variant="ghost"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Separator orientation="vertical" className="bg-white max-h-4" />
              <Button
                size="sm"
                type="button"
                className="h-3 hover:bg-transparent cursor-pointer"
                variant="ghost"
                onClick={() => dispatch(clearRatingState())}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Stars */}
          <div className="flex rounded-full md:mt-3 py-2.5 px-3 text-stone-200 bg-gray-900 w-fit gap-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onMouseEnter={() => dispatch(setHover(star))}
                onMouseLeave={() => dispatch(setHover(0))}
                onClick={() => dispatch(setRating(star))}
                size={14}
                className={`cursor-pointer transition ${
                  (hover || rating) >= star
                    ? "text-[#FFA534]"
                    : "text-[#e7e5e4]"
                }`}
                fill={(hover || rating) >= star ? "#FFA534" : "#e7e5e4"}
              />
            ))}
          </div>

          <Textarea
            onChange={(e) => dispatch(setComment(e.target.value))}
            value={comment}
            placeholder="Write description"
            className="bg-white"
          />
        </>
      ) : (
        <>
          <h1 className="font-semibold">Your experience</h1>

          <div className="flex rounded-full mt-3 py-2.5 px-3 text-stone-200 bg-gray-900 w-fit gap-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={`transition ${
                  existingReview?.rating >= star
                    ? "text-[#FFA534]"
                    : "text-[#e7e5e4]"
                }`}
                fill={
                  existingReview?.rating >= star
                    ? "#FFA534"
                    : "#e7e5e4"
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default OrderRating;
