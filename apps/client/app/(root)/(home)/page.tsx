import HomeView from "@/modules/home/view/home-view";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Needlon | home",
  description: "A fashionable clothing tailoring service",
};

const page = () => {
  return (
    <div>
      <HomeView />
    </div>
  )
}

export default page

