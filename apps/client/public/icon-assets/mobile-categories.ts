import newArrival from "./shopping.png";
import trending from "./trending.png";
import bestSeller from "./best-seller.png";
import menShirt from "./cloth.png";
import mensPants from "./jeans.png";
import mensOuterwear from "./jacket.png";
import mensKurta from "./kurta.png";
import womenShirtPants from "./fashion.png";
import womenSuit from "./women.png";
import lahengaBlouse from "./woman-clothes.png";
import womenOuterwear from "./outwear.png";
import mensTailoring from "./male-clothes.png";
import womensTailoring from "./fashion.png";
import weddingOccation from "./wedding.png";
import alteration from "./trousers.png";

export const mobileCategoriesData = [
  {
    name: "New-In",
    navigator: [
      {
        label: "New Arrival",
        icon: newArrival,
        navigate: "/new-in/arrivals",
      },
      {
        label: "Trending",
        icon: trending,
        navigate: "/new-in/trending",
      },
      {
        label: "Best Seller",
        icon: bestSeller,
        navigate: "/new-in/best-sellers",
      },
    ],
  },
  {
    name: "For Men's",
    navigator: [
      {
        label: "Shirts",
        icon: menShirt,
        navigate: "/items-for-men/shirts",
      },
      {
        label: "Pants",
        icon: mensPants,
        navigate: "/items-for-men/pants",
      },
      {
        label: "Outerwear",
        icon: mensOuterwear,
        navigate: "/items-for-men/outerwears",
      },
      {
        label: "Kurta",
        icon: mensKurta,
        navigate: "/items-for-men/kurtas",
      },
    ],
  },
  {
    name: "For Women's",
    navigator: [
      {
        label: "Shirt & Pants",
        icon: womenShirtPants,
        navigate: "/items-for-women/formal",
      },
      {
        label: "Suits",
        icon: womenSuit,
        navigate: "/items-for-women/suits",
      },
      {
        label: "Lahenga",
        icon: lahengaBlouse,
        navigate: "/items-for-women/lahengas",
      },
      {
        label: "Outerwear",
        icon: womenOuterwear,
        navigate: "/items-for-women/outerwears",
      },
    ],
  },
  {
    name: "Services",
    navigator: [
      {
        label: "Mens Tailoring",
        icon: mensTailoring,
        navigate: "/services/tailoring/mens",
      },
      {
        label: "Womens Tailoring",
        icon: womensTailoring,
        navigate: "/services/tailoring/womens",
      },
      {
        label: "Weddings",
        icon: weddingOccation,
        navigate: "/services/tailoring/wedding-occasion",
      },
      {
        label: "Alteration",
        icon: alteration,
        navigate: "/services/alterations",
      },
    ],
  },
];
