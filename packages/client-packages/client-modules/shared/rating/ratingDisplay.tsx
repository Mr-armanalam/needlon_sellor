import { cn } from "@/lib/utils";
import { RatingComponentProps } from "@/types/ratingTypes";
import { calculateRatingMetrics } from "@/utils/calculate-rating-metrics";
import { StarHalfIcon, StarIcon } from "lucide-react";
import React from "react";

const Star = ({ type, color, size }: { type: "full" | "half" | "empty" , color?: string, size?: number}) => {
  switch (type) {
    case "full":
      return (
        <span>
          <StarIcon size={size} fill={color} />
        </span>
      ); // Full Star
    case "half":
      return (
        <span>
          <StarHalfIcon size={size} fill={color} />
        </span>
      );
    case "empty":
      return (
        <span className="text-gray-500">
          <StarIcon size={size} />
        </span>
      ); // Empty Star
    default:
      return null;
  }
};

const RatingDisplay = ({ color='#FFDF00', avgRating, className,  ratings, size}: RatingComponentProps) => {
  
  const { fullStars, halfStar, emptyStars } =
    calculateRatingMetrics(ratings, 5, avgRating);

  const fullStarElements = Array(fullStars).fill(undefined).map((_, i) => (<Star key={`full-${i}`} color={color} size={size} type="full" />));
  const halfStarElements = Array(halfStar).fill(undefined).map((_, k) => (<Star key={`half-${k}`} color={color} size={size} type="half" />));
  const emptyStarElements = Array(emptyStars).fill(undefined).map((_, i) => (<Star key={`empty-${i}`} color={color} size={size} type="empty" />));

  return (
    <div className={cn(className, "flex flex-col gap-1.25")}>
      <div style={{color: color}} className=" leading-1 flex">
        {fullStarElements}
        {halfStarElements}
        {emptyStarElements}
      </div>
    </div>
  );
};

export default RatingDisplay;
