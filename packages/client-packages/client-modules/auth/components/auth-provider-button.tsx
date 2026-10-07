import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const AuthProviderButton = ({
  setIsLoading,
  loading,
}: {
  loading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
    setIsLoading(false);
  };
  return (
    <div className="flex mt-3 max-sm:gap-2 text-gray-800 justify-between">
      <Button
        variant={"outline"}
        disabled={loading}
        className="hover:bg-transparent max-sm:text-xs cursor-pointer"
        onClick={() => handleSignIn("google")}
      >
        <FaGoogle className="w-4 h-4" />
        {loading ? "Please wait..." : "Sign In with Google"}
      </Button>
      <Button
        variant={"outline"}
        disabled={loading}
        className="hover:bg-transparent max-sm:text-xs cursor-pointer"
        onClick={() => handleSignIn("facebook")}
      >
        <FaFacebook className="w-4 h-4 " />
        {loading ? "Please wait..." : "Sign In with Facebook"}
      </Button>
    </div>
  );
};

export default AuthProviderButton;
