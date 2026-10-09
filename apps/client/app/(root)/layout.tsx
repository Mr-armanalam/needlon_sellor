import FooterSection from "@/modules/shared/footer/footer-section";
import MobileNavbarSection from "@/modules/shared/navbar/mobile-navbar-section";
import NavbarSection from "@/modules/shared/navbar/navbar-section";
import { NavSearch } from "@/modules/shared/navbar/ui/nav-search";
import React from "react";

// export const metadata: Metadata = {
//   title: "Needlon",
//   description: "A fashionable clothing tailoring service",
// };

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavbarSection />
      <div className="md:hidden mt-2 mx-2">
        <NavSearch />
      </div>
      <div className="flex flex-col min-h-screen flex-1">{children}</div>

      <FooterSection />
      <MobileNavbarSection />
    </>
  );
};

export default Layout;
