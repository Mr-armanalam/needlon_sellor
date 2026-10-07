export const ProductCouruselSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 animate-pulse">
      {/* Left: Image Placeholder */}
      <div className="w-full md:w-1/3 aspect-square bg-gray-300 rounded-lg shadow-sm" />

      {/* Right: Info Box Placeholder */}
      <div className="flex-1 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="h-4 w-20 bg-gray-200 rounded mb-4" /> {/* Tag */}
        <div className="h-10 w-3/4 bg-gray-300 rounded mb-6" /> {/* Title */}
        
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="flex gap-4">
             <div className="h-4 w-24 bg-gray-200 rounded" />
             <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="h-12 w-32 bg-gray-300 rounded mb-8" /> {/* Price */}

        <div className="flex gap-4">
          <div className="h-12 flex-1 bg-gray-300 rounded-full" /> {/* Button 1 */}
          <div className="h-12 flex-1 bg-gray-300 rounded-full" /> {/* Button 2 */}
        </div>
      </div>
    </div>
  );
};