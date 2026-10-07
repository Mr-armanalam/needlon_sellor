import { GoHome } from "react-icons/go";
import { PiSquaresFour, PiSquaresFourFill } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { BsCart2 } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { BsCartFill } from "react-icons/bs";

export const items = [
  {
    name: "New In",
    link: "/new-in",
    subNevigator: [
      {
        name: "New Arrivals",
        description: "Latest additions to our collection",
        link: "/new-in/arrivals",
      },
      {
        name: "Trending",
        description: "Popular items right now",
        link: "/new-in/trending",
      },
      {
        name: "Best Sellers",
        description: "Most purchased items",
        link: "/new-in/best-sellers",
      },
    ],
  },
  {
    name: "For Men's",
    link: "/items-for-men",
    subNevigator: [
      {
        name: "Shirts for Men's",
        description: "Stylish shirts for every occasion",
        link: "/items-for-men/shirts",
      },
      {
        name: "Pants",
        description: "Comfortable and fashionable pants",
        link: "/items-for-men/pants",
      },
      {
        name: "Outerwear",
        description: "Jackets, coats and Sapari for all seasons",
        link: "/items-for-men/outerwears",
      },
      {
        name: "Kurtas",
        description:
          "Stylish & Traditional kurtas and Khan-Dress for festive occasions",
        link: "/items-for-men/kurtas",
      },
    ],
  },
  {
    name: "For Women",
    link: "/items-for-women",
    subNevigator: [
      {
        name: "Office Wear",
        description: "Formal Shirts & pants for Women's",
        link: "/items-for-women/formal",
      },
      {
        name: "Suits for Women",
        description: "Elegant suits for every occasion",
        link: "/items-for-women/suits",
      },
      {
        name: "Lahengas & Blouses",
        description: "Stylish Lahenga and blouse to complement your outfits",
        link: "/items-for-women/lahengas",
      },
      {
        name: "Outerwear",
        description: "Ladies-jackets, Ladies-coats for all seasons",
        link: "/items-for-women/outerwears",
      },
    ],
  },
  {
    name: "Services",
    link: "/services",
    subNevigator: [
      {
        name: "Men's Tailoring",
        description: "Tailoring services for men's suits, shirts, and more",
        link: "/services/tailoring/mens",
      },
      {
        name: "Women's Tailoring",
        description: "Custom fits for women's dresses, blouses, and formalwear",
        link: "/services/tailoring/womens",
      },
      {
        name: "Wedding & Occasion Wear",
        description: "Tailored outfits for weddings and special occasions",
        link: "/services/tailoring/wedding-occasion",
      },
      {
        name: "Alterations & Fittings",
        description: "Clothing alterations for a perfect fit and adjustments",
        link: "/services/alterations",
      },
    ],
  },
  { name: "About", link: "/about" },
];


export const mobileNavData = [
  {
    label: 'Home',
    icon: GoHome,
    activeIcon: GoHomeFill,
    link: '/'
  },
  {
    label: 'Categories',
    icon: PiSquaresFour,
    activeIcon: PiSquaresFourFill,
    link: '/m-categories'
  },
  {
    label: 'Account',
    icon: FaRegUser,
    activeIcon: FaUser,
    link: '/m-account'
  },
  {
    label: 'Cart',
    icon: BsCart2,
    activeIcon: BsCartFill,
    link: '/cart'
  },
]