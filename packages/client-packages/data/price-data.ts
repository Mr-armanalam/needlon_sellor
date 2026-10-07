'use strict'
const suitPriceDataCol = [
  {
    category: "Jacket",
    orientation: "vertical",
    categoryPriceData: [
      {
        type: "Center seam in/out",
        price: 35,
      },
      {
        type: "Sides in/out",
        price: 55,
      },
      {
        type: "Sides blades in/out",
        price: 42,
      },
      {
        type: "Taper sleeves in/out",
        price: 66,
      },
      {
        type: "Shorten shoulders",
        price: 80,
      },
      {
        type: "Shorten/ lengthen jacket",
        price: 120,
      },
      {
        type: "Shorten/ lengthen sleeves from bottom",
        price: 110,
      },
      {
        type: "Shorten sleeves from top",
        price: 120,
      },
    ],
  },
  {
    category: "Vest",
    orientation: "vertical",
    categoryPriceData: [
      {
        type: "Sides in/out",
        price: 35,
      },
      {
        type: "Raise shoulders",
        price: 55,
      },
      {
        type: "Reshape neckline/ armhole",
        price: 42,
      },
      {
        type: "Shorten vest",
        price: 66,
      },
    ],
  },
  {
    category: "Trousers",
    orientation: "horizontal",
    categoryPriceData: [
      {
        type: "Shorten trousers",
        price: 35,
      },
      {
        type: "Waist in/out through the sides",
        price: 55,
      },
      {
        type: "Shorten extra-wide trousers",
        price: 42,
      },
      {
        type: "Waist in and taper full legs",
        price: 66,
      },
      {
        type: "Shorten wide trousers",
        price: 66,
      },
      {
        type: "Taper full legs",
        price: 66,
      },
      {
        type: "Taper legs knee up/ down",
        price: 66,
      },
    ],
  },
];

const casualGarments = [
  {
    category: "Jeans Pants / Casual Pants",
    orientation: "vertical",
    categoryPriceData: [
      {
        type: "Shorten jeans",
        price: 35,
      },
      {
        type: "Shorten wide jeans",
        price: 55,
      },
      {
        type: "Shorten jeans with original hem",
        price: 42,
      },
      {
        type: "Shorten wide jeans with original hem",
        price: 66,
      },
      {
        type: "Waist in/out",
        price: 80,
      },
      {
        type: "Waist in and taper full legs",
        price: 120,
      },
      {
        type: "Taper full legs",
        price: 110,
      },
      {
        type: "Taper legs knee up/ down",
        price: 120,
      },
    ],
  },
  {
    category: "Blouse / Shirt",
    orientation: "vertical",
    categoryPriceData: [
      {
        type: "Sides in/ out",
        price: 42,
      },
      {
        type: "Taper sleeves",
        price: 66,
      },
      {
        type: "Raise shoulders",
        price: 80,
      },
      {
        type: "Shorten sleeves from bottom",
        price: 120,
      },
      {
        type: "Shorten sleeves from top",
        price: 110,
      },
      {
        type: "Shorten blouse/ shirt",
        price: 120,
      },
    ],
  },
  {
    category: "Skirt",
    orientation: "vertical",
    categoryPriceData: [
      {
        type: "Waist in/ out",
        price: 80,
      },
      {
        type: "Sides in/out",
        price: 120,
      },
      {
        type: "Shorten skirt",
        price: 110,
      },
      {
        type: "Shorten wide skirt 1-3 layers",
        price: 120,
      },
    ],
  },
];

const outerWearData = [
  {
    category: null,
    orientation: "horizontal",
    categoryPriceData: [
      {
        type: "Shorten / raise shoulders",
        price: 35,
      },
      {
        type: "Shorten waistband",
        price: 35,
      },
      {
        type: "Center seam in/out",
        price: 35,
      },
      {
        type: "Shorten / raise shoulders",
        price: 35,
      },
      {
        type: "Sides in/out",
        price: 55,
      },
      {
        type: "Add/ remove shoulders pads",
        price: 42,
      },
      {
        type: "Sides blades in/out",
        price: 66,
      },
      {
        type: "Shorten/ lengthen",
        price: 80,
      },
      {
        type: "Taper sleeves in/out",
        price: 120,
      },
      {
        type: "horten sleeves from top",
        price: 110,
      },
      {
        type: "Shorten / lengthen sleeves from bottom",
        price: 120,
      },
    ],
  },
];

const dressesData = [
  {
    category: null,
    orientation: "horizontal",
    categoryPriceData: [
      {
        type: "Sides in/ out",
        price: 35,
      },
      {
        type: "Reshape neckline/ armholeShorten jeans",
        price: 35,
      },
      {
        type: "Front/ back darts in/ out",
        price: 35,
      },
      {
        type: "Taper sleeves",
        price: 35,
      },
      {
        type: "Princess darts in/ out (recut front)",
        price: 35,
      },
      {
        type: "Shorten sleeves",
        price: 55,
      },
      {
        type: "Shorten waistband",
        price: 55,
      },
      {
        type: "Shorten sleeves from top",
        price: 42,
      },
      {
        type: "Raise shoulders",
        price: 66,
      },
      {
        type: "Shorten/ lengthen plain hem",
        price: 80,
      },
      {
        type: "Shorten straps",
        price: 120,
      },
      {
        type: "Shorten wide layers hem",
        price: 110,
      },
      {
        type: "Shorten extra wide layers",
        price: 120,
      },
    ],
  },
];

const othersData = [
  {
    category: null,
    orientation: "horizontal",
    categoryPriceData: [
      {
        type: "Repair zipper",
        price: 35,
      },
      {
        type: "Add/ remove shoulders pads",
        price: 35,
      },
      {
        type: "Replace zipper",
        price: 35,
      },
      {
        type: "Repair stitch",
        price: 55,
      },
      {
        type: "New button",
        price: 55,
      },
      {
        type: "Repair stitch by hand",
        price: 42,
      },
      {
        type: "Move button",
        price: 66,
      },
      {
        type: "Add hook and eye",
        price: 80,
      },
      {
        type: "Add snap",
        price: 120,
      },
      {
        type: "Add cups",
        price: 110,
      },
      {
        type: "Patching",
        price: 120,
      },
    ],
  },
];

export const priceCategoryData = [
  {
    itemCategory: "Suits",
    categoryPrice: suitPriceDataCol,
  },
  {
    itemCategory: "Casual Garments",
    categoryPrice: casualGarments,
  },
  {
    itemCategory: "Dresses",
    categoryPrice: dressesData,
  },
  {
    itemCategory: "Outerwear",
    categoryPrice: outerWearData,
  },
  {
    itemCategory: "Other Services",
    categoryPrice: othersData,
  },
];
