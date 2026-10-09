export interface RatingData {
  id: number;
  rating: number; // Individual rating from 1 to 5
  comment: string;
}

export interface RatingComponentProps {
  avgRating: string;
  ratings?: RatingData[];
  maxRating?: number; // Default to 5
  size?: number;
  color?: string;
  className?: string;
}
