import { Star } from 'lucide-react'
import React from 'react'

const RatingStar = ({rating, isFeatured, quote}: {rating: number, isFeatured?:boolean,quote:string}) => {
  return (

      <div>
        {/* Star Rating System */}
        <div className="flex gap-1 mb-5">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* The Actual Testimonial Copy */}
        <p
          className={`text-base leading-relaxed italic font-medium
                ${isFeatured ? "text-slate-100" : "text-slate-700"}`}
        >
          {quote}
        </p>
      </div>  )
}

export default RatingStar