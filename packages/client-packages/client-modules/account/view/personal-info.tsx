"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import NameInfo from "../components/name-info";
import GenderInfo from "../components/gender-info";
import Emailinfo from "../components/email-info";
import PhoneInfo from "../components/phone-info";
import { registerPersonalinfo } from "../server/personal-Info-controller";

type props = {
  name: string;
  email: string;
  phone: string | null;
  gender: "male" | "female";
};
const PersonalInfo = ({ serverData }: { serverData: props }) => {  
  const { data: session } = useSession();

  const [personalData, setPersonalData] = useState({
    firstname: serverData?.name?.split(" ")?.[0] ?? "",
    lastname: serverData?.name?.split(" ")?.slice(1).join(" ") ?? "",
    email: serverData?.email ?? "",
    number: serverData?.phone ?? "",
    gender: serverData?.gender ?? "male",
  });  

  const [editSection, setEditSection] = useState<
    null | "personal" | "email" | "phone"
  >(null);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registerPersonalinfo({
      ...personalData,
      userId: session?.user.id,
    });

    if (res.success) {
      toast("Data saved successfully!");
    } else {
      toast("Failed to save data");
    }

    setEditSection(null);
  };

  return (
    <form>
      <NameInfo
        editSection={editSection}
        setEditSection={setEditSection}
        firstname={personalData.firstname}
        lastname={personalData.lastname}
        handleOnChange={handleOnChange}
        handleSave={handleSave}
      />

      <GenderInfo gender={personalData.gender} />

      <Emailinfo
        editSection={editSection}
        setEditSection={setEditSection}
        email={personalData.email}
        handleOnChange={handleOnChange}
        handleSave={handleSave}
      />

      <PhoneInfo
        editSection={editSection}
        setEditSection={setEditSection}
        number={personalData.number}
        handleOnChange={handleOnChange}
        handleSave={handleSave}
      />
    </form>
  );
};

export default PersonalInfo;
