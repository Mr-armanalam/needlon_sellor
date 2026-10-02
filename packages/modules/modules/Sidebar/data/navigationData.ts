import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  Star,
  DollarSign,
  BarChart2,
  Truck,
  Gift,
  CreditCard,
  Settings,
} from "lucide-react";

export const mainNavItems = [
  { name: "Dashboard", icon: Home, navigateTo: '/dashboard' },
  { name: "Products", icon: Package, navigateTo: '/products', badge: 12 },
  { name: "Orders", icon: ShoppingCart, navigateTo: '/orders', badge: 3 },
  { name: "Messages", icon: MessageSquare, navigateTo: '/messages', badge: 5 },
  { name: "Customers", icon: Users, navigateTo: '/customers' },
  { name: "Reviews", icon: Star, navigateTo: '/reviews' },
  { name: "Earnings", icon: DollarSign, navigateTo: '/earnings' },
  { name: "Analytics", icon: BarChart2, navigateTo: '/analytics' },
  { name: "Delivery", icon: Truck, navigateTo: '/delivery' },
  { name: "Marketing", icon: Gift, navigateTo: '/marketing' },
  { name: "Subscription", icon: CreditCard, navigateTo: '/subscription' },
  { name: "Settings", icon: Settings, navigateTo: '/settings' },
];
