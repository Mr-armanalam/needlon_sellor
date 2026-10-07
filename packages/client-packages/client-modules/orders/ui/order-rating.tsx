"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
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
};

const OrderRating = ({
  isMobile,
  orderItemId,
  productId,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const { allRating, rating, hover, comment } = useSelector(
    (state: RootState) => state.rating
  );

  useEffect(() => {
    dispatch(fetchProductReview());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!rating) return alert("Please select a rating");

    await dispatch(
      submitReview({
        productId,
        orderItemId,
        rating,
        comment,
      })
    );

    await dispatch(fetchProductReview());
    alert("Review submitted!");
    dispatch(clearRatingState());
  };

  // const existingReview = allRating?.find((r) => r.id === ratingId);
  const existingReview = allRating?.find(
  (r) => r.orderItemId === orderItemId
);


  const shouldShowForm = !existingReview;

  return (
    <section className="m-4 p-4 flex flex-col gap-y-3 dark:bg-black bg-stone-200 rounded-md">
      {shouldShowForm ? (
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
