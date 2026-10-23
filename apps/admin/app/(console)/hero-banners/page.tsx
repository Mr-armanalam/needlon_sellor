import HeroBannersManager from "./hero-banners-manager";
import { AdminPageShell } from "../page-shell";

export const dynamic = "force-dynamic";

export default function AdminHeroBannersPage() {
  return (
    <AdminPageShell
      title="Hero Banners"
      description="Storefront homepage hero banners. Only active banners are shown, in display order."
    >
      <HeroBannersManager />
    </AdminPageShell>
  );
}
