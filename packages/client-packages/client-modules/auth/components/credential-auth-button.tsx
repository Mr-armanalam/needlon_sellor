import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

const CredentialAuthButton = ({isSignUp , loading}:{isSignUp:boolean, loading: boolean}) => {
  return (
    <>
      <Button
        className=" mt-3 cursor-pointer flex bg-gray-800 px-6 py-2 font-bold text-white"
        type="submit"
        disabled={loading}
      >
        {isSignUp ? loading ? 'Please wait...' :"Sign Up" : "Sign In"} <MoveRight className="size-4 mt-1" />
      </Button>
      {!isSignUp && (
        <>
          <Link href={'/auth/forget-password'} className="text-xs hover:underline cursor-pointer w-fit">Forgot Account?</Link>
          <label className="text-center font-bold text-gray-600">OR</label>
        </>
      )}
      
    </>
  );
};

export default CredentialAuthButton;
