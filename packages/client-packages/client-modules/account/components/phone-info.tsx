import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  editSection: null | "personal" | "email" | "phone",
  setEditSection: Dispatch<SetStateAction<null | "personal" | "email" | "phone" >>,
  number: string ;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: (e: React.FormEvent) => void;
}


const PhoneInfo = ({editSection, setEditSection, number, handleOnChange, handleSave} : Props) => {
  return (
    <>
      <div className="flex mt-8 mb-6 items-end gap-8">
        <p className="text-lg font-semibold dark:text-white text-stone-800">Mobile Number</p>
        {editSection === "phone" ? (
          <button
            type="button"
            className="text-base cursor-pointer text-blue-800 font-semibold"
            onClick={() => setEditSection(null)}
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            className="text-base cursor-pointer text-blue-800 font-semibold"
            onClick={() => setEditSection("phone")}
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex gap-6">
        <Input
          disabled={editSection !== "phone" && true}
          type="text"
          className="w-75 font-semibold dark:border-gray-600 rounded-sm h-12 mb-4"
          value={number}
          name="number"
          placeholder="Number"
          onChange={(e) => handleOnChange(e)}
        />
        {editSection === "phone" && (
          <Button
            onClick={(e) => handleSave(e)}
            variant={"secondary"}
            className="h-12 w-20"
            type="submit"
          >
            {" "}
            Save
          </Button>
        )}
      </div>
    </>
  )
}

export default PhoneInfo