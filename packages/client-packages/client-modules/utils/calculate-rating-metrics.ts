import { RatingData } from "@/types/ratingTypes";

export const calculateRatingMetrics = (
  ratings?: RatingData[],
  maxRating: number = 5,
  avgRating: string | number = 0,
) => {
  if (ratings?.length === 0) {
    return {
      averageRating: 0,
      fullStars: 0,
      halfStar: 0,
      emptyStars: maxRating,
    };
  }
  let averageRating;

  if (ratings) {

    const totalRating = ratings && ratings.reduce((sum, item) => sum + item.rating, 0);
     averageRating = totalRating / ratings.length;
  }else {
    averageRating = Number(avgRating)
  }

  const fullStars = Math.floor(averageRating);

  const decimalPart = averageRating - fullStars;
  const halfStar = decimalPart >= 0.25 && decimalPart < 0.75 ? 1 : 0;
  
  const emptyStars = maxRating - fullStars - halfStar;

  return {
    averageRating: parseFloat(averageRating.toFixed(2)),
    fullStars,
    halfStar,
    emptyStars,
  };
};