import { HelpCircle, LogOut, MessageCircle } from "lucide-react";

export const footerNavItems = [
  { name: "Help", icon: HelpCircle, navigateTo: '/help'},
  { name: "Feedback", icon: MessageCircle, navigateTo: '/feedback'},
  { name: "Logout", icon: LogOut, isDanger: true, navigateTo: '/logout'},
];