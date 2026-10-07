import React, { ReactNode } from "react";

const Layout = ({
  hero_section,
  children,
  premium_section,
  you_may_like_section,
  recommendation_section,
  season_section
}: {
  children: ReactNode;
  hero_section: ReactNode;
  premium_section: ReactNode;
  you_may_like_section: ReactNode;
  recommendation_section: ReactNode;
  season_section: ReactNode;
}) => {
  return (
    <>
      {hero_section}
      <div className="bg-gray-100 dark:bg-white/2 flex gap-y-2 py-2 flex-col">
        {premium_section}
        {you_may_like_section}
        {season_section}
        {recommendation_section}
        {children}
      </div>
    </>
  );
};

export default Layout;
