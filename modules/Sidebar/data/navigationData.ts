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
  { name: "Dashboard", icon: Home },
  { name: "Products", icon: Package, badge: 12 },
  { name: "Orders", icon: ShoppingCart, badge: 3 },
  { name: "Messages", icon: MessageSquare, badge: 5 },
  { name: "Customers", icon: Users },
  { name: "Reviews", icon: Star },
  { name: "Earnings", icon: DollarSign },
  { name: "Analytics", icon: BarChart2 },
  { name: "Delivery", icon: Truck },
  { name: "Marketing", icon: Gift },
  { name: "Subscription", icon: CreditCard },
  { name: "Settings", icon: Settings },
];
