import { Separator } from "@/components/ui/separator";
import {
  Heart,
  PackageOpen,
  Power,
  ReceiptIndianRupee,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  signOut: () => void;
}

const UserSectionData = [
  {
    label: "Your Profile",
    link: "/account/profile",
    description: "Your profile, your world !",
    icon: <User width={16} height={16} />,
  },
  {
    label: "Your Orders",
    link: "/account/orders",
    description: "Track every purchase & get status",
    icon: <PackageOpen width={16} height={16} />,
  },
  {
    label: "Your Wishlist",
    link: "/account/wishlist",
    description: "Save now, your dream cart awaits",
    icon: <Heart width={16} height={16} />,
  },
  {
    label: "Your Coupen",
    link: "/account/rewards",
    description: "Unlock savings with a pro-deals",
    icon: <ReceiptIndianRupee width={16} height={16} />,
  },
  {
    label: "Sign Out",
    link: null,
    description: "Leaving already? Come back anytime",
    icon: <Power width={16} height={16} />,
  },
];

const UserSection = ({ signOut }: Props) => {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <p className="mx-3.5 justify-start font-semibold text-md">Your Account</p>
      <p className="text-xs mx-3.5 text-gray-500">
        Everything you need, in one smart spot
      </p>
      <Separator className="mt-3" />
      {UserSectionData.map(({ link, label, description, icon }, i) => (
        <div
          className="hover:bg-stone-100 group gap-4 flex px cursor-pointer px-4 py-5 font-semibold rounded-sm text-black/80 justify-start text-sm"
          key={i}
        >
          <div className="flex justify-center rounded-sm bg-zinc-200/70 px-2.5 items-center">
            {icon}
          </div>
          <div
            onClick={() => (link ? router.push(link) : signOut())}
            className="dark:group-hover:text-black dark:text-white"
          >
            {label}
            <p className="text-xs text-gray-500 font-normal">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserSection;
