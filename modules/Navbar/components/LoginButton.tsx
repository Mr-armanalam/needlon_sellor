import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const router = useRouter();
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
