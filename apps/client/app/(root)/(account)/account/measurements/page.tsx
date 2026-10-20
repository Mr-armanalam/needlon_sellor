import React from "react";
import { auth } from "@/auth";
import { getCustomerMeasurements } from "@/modules/account/server/measurements-controller";
import MeasurementsView, { type CustomerMeasurementItem } from "@/modules/account/view/measurements-view";

// The measurement columns are jsonb, so Drizzle infers them as `unknown`.
// Narrow them to the string/number value map the view renders.
function toMeasurementValues(value: unknown): Record<string, string | number> {
  if (typeof value !== "object" || value === null) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string | number] =>
        typeof entry[1] === "string" || typeof entry[1] === "number"
    )
  );
}

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email ?? undefined;

  let measurements: CustomerMeasurementItem[] = [];
  if (userId || userEmail) {
    const res = await getCustomerMeasurements(userId, userEmail);
    if (res.success && res.data) {
      measurements = res.data.map((record) => ({
        ...record,
        essentialMeasurements: toMeasurementValues(record.essentialMeasurements),
        postureSpecifics: toMeasurementValues(record.postureSpecifics),
      }));
    }
  }

  return (
    <div className="md:px-8 max-md:px-3">
      <MeasurementsView measurements={measurements} />
    </div>
  );
}
