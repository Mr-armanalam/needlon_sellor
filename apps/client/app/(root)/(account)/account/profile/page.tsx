import { auth } from "@/auth";
import { getPersonalinfo } from "@/modules/account/server/personal-Info-controller";
import PersonalInfo from "@/modules/account/view/personal-info";
import React from "react";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  
  let personalData = null;
  
  if (userId) {
    const res = await getPersonalinfo(userId);
    personalData = res?.data ?? null;
  }

  return (
    <div className="px-8">
      {personalData && <PersonalInfo serverData={personalData} />}
    </div>
  );
};

export default page;
