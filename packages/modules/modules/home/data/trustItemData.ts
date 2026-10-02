import {
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Wallet,
  Lock,
} from "lucide-react";

export const trustItems = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Secure Login",
    subtitle: "Verified instant access via mobile OTP",
  },
  {
    id: 2,
    icon: Smartphone,
    title: "Direct UPI Payment",
    subtitle: "Works instantly with GPay, PhonePe & Paytm",
  },
  {
    id: 3,
    icon: CheckCircle2,
    title: "No Hidden Charges",
    subtitle: "Zero platform cuts. What you earn is yours",
  },
  {
    id: 4,
    icon: Wallet,
    title: "Money Stays With You",
    subtitle: "Direct bank settlement with zero holding days",
  },
];

export type trustChekDataType = typeof trustItems[number];