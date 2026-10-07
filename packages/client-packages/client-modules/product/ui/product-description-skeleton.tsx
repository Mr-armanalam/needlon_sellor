export const ProductDescriptionSkeleton = () => {
  return (
    <div className="w-full p-8 grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse border-t border-gray-100">
      {/* Left Side: Text Block */}
      <div>
        <div className="h-8 w-48 bg-gray-300 rounded mb-6" /> {/* Heading */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Right Side: Specs List */}
      <div className="flex flex-col justify-center space-y-4 md:pl-12">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-2">
            <div className="h-4 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};