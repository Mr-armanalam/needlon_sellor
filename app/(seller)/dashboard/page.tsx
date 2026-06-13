import { requireSeller } from "@/modules/auth/lib/require-seller";

export default async function DashboardPage() {
  const seller =
    await requireSeller();

  return (
    <div>
      Welcome {seller.name}
    </div>
  );
}