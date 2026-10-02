import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const CTAButton = ({router}:{router:AppRouterInstance}) => {
  return <Button onClick={()=> router.push('/dashboard')} className={'bg-rose-500 hover:bg-rose-600 text-base cursor-pointer text-white'}>Start Selling Free</Button>;
};

export default CTAButton;
