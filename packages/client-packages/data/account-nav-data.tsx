import {
  Bell,
  Heart,
  MapPinHouse,
  PackageOpenIcon,
  ReceiptIndianRupee,
  ShoppingBagIcon,
  User,
} from "lucide-react";

export const accountNavData = [
  {
    label: 'profile',
    url: "/account/profile",
    icon: <User size={15} />,
    name: "Your Profile",
    description: "Do you want to update your profile ?",
  },
  {
    label: 'address',
    url: "/account/address",
    icon: <MapPinHouse size={15} />,
    name: "Manage Address",
    description: "Add or update your address",
  },
  {
    label: 'wishlist',
    url: "/account/wishlist",
    icon: <Heart size={15} />,
    name: "Your Wishlist",
    description: "Some items, which you love",
  },
  {
    label: 'cart',
    url: "/cart",
    icon: <ShoppingBagIcon size={15} />,
    name: "Your Cart",
    description: "Some items, which you want to order",
  },
  {
    label: 'orders',
    url: "/account/orders",
    icon: <PackageOpenIcon size={15} />,
    name: "Your Order",
    description: "Track & seen you order status",
  },
  {
    label: 'rewards',
    url: "/account/rewards",
    icon: <ReceiptIndianRupee size={15} />,
    name: "Your Coupen",
    description: "Earn & redeem your rewards",
  },
  {
    label: 'updates',
    url: "/account/updates",
    icon: <Bell size={15} />,
    name: "All Notification",
    description: "Something is needed to inform you",
  },
];
