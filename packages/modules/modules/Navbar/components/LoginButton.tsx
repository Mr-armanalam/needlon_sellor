import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { User } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const LoginButton = ({router}:{router:AppRouterInstance}) => {
  const { user } = useCurrentUser();
  if (user?.email) return null;  

  return (
    <Button
      onClick={() => router.push("/login")}
      variant={"ghost"}
      className="text-lg py-3 cursor-pointer"
    >
      <User />
      Login
    </Button>
  );
};

export default LoginButton;
