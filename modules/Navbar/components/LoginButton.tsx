import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const LoginButton = () => {
  
  return (
    <Button variant={"ghost"} className="text-lg py-3 cursor-pointer">
      <User />
      Login
    </Button>
  );
};

export default LoginButton;
