import BrandStory from "../components/BrandStory";
import QuickLink from "../components/QuickLink";
import Support from "../components/Support";
import Languages from "../components/Languages";
import SellerResources from "../components/SellerResources";
import SocialMedia from "../components/SocialMedia";

const FooterGridCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 pb-12 border-b border-slate-900">
      <BrandStory />
      <QuickLink />
      <Support />
      <Languages />
      <SellerResources />
      <SocialMedia />
    </div>
  );
};

export default FooterGridCard;
