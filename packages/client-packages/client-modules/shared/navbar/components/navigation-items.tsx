import Navigationmenu from "./navigation-menu";
import { items } from "@/lib/data/nav-data";
import Link from "next/link";


const NavigationItems = () => {
  return (
    <div className="flex items-center justify-center space-x-8">
      <Link href={'/'} className="font-bold font-garamond text-2xl">Needlon</Link>
      <div className="flex items-center justify-center mt-auto space-x-2">
        {items.map((item, index) => (
          <Navigationmenu
            key={index}
            navigateTrigger={item.name}
            link={item.link}
            subNevigator={item.subNevigator}
          />
        ))}
      </div>
    </div>
  );
};

export default NavigationItems;
