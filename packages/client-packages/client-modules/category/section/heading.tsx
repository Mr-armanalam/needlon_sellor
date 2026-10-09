import React, { useState } from "react";

const data = {
  name: "Ready to Wear",
  description:
    "With all the essential elements to elevate your seasonal wardrobe, discover the Fall/Winter 2025 Ready-to-Wear collection – a continuation of our century-long tradition of elegance, rooted in style.",
};

const Heading = ({
  productTagDes,
}: {
  productTagDes: {
    contentTag: string;
    descriptiveContent: string;
  };
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="my-2">
      <h1 className="md:text-5xl text-4xl font-garamond font-semibold uppercase">
        {productTagDes?.contentTag ?? data.name}
      </h1>
      <p
        className={`text-gray-500 max-md:text-sm transition-all duration-300 font-roboto-sans md:max-w-[70vw] mt-4 ${
          expanded ? "line-clamp-none" : "line-clamp-2"
        }`}
      >
        {productTagDes?.descriptiveContent ?? data.description}
      </p>
      {productTagDes?.descriptiveContent?.length > 240 && (
        <button
          className="mt-3 underline text-lg uppercase font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default Heading;
