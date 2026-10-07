import React from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type props = {
  gender: string
}

const GenderInfo = ({gender}: props) => {
  return (
    <>
      <p className="text-sm ml-2 font-semibold dark:text-gray-400 text-stone-500">Your Gender</p>

      <div className="ml-2 mt-4">
        <RadioGroup
          className="flex text-stone-600 dark:text-gray-400 gap-x-12"
          defaultValue={gender ?? "male"}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={"male"} id="male" />
            <Label htmlFor="male">MALE</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={"female"} id="female" />
            <Label htmlFor="female">FEMALE</Label>
          </div>
        </RadioGroup>
      </div>
    </>
  );
};

export default GenderInfo;
