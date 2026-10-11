import React from "react";
import { auth } from "@/auth";
import { getCustomerMeasurements } from "@/modules/account/server/measurements-controller";
import MeasurementsView from "@/modules/account/view/measurements-view";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email ?? undefined;

  let measurements: any[] = [];
  if (userId || userEmail) {
    const res = await getCustomerMeasurements(userId, userEmail);
    if (res.success && res.data) {
      measurements = res.data;
    }
  }

  return (
    <div className="md:px-8 max-md:px-3">
      <MeasurementsView measurements={measurements} />
    </div>
  );
}
