'use server'
import { db } from "@/db";
import { productItems } from "@/db/schema/product-items";
import { filterOptions } from "@/db/schema/filter-options";
import { productFilterOptions } from "@/db/schema/product-filter-options";

export async function seedProductFilterOptions() {
  // 1. Fetch all products
  const products = await db.select().from(productItems);

  // 2. Fetch all filter options
  const options = await db.select().from(filterOptions);

  // 3. Group filter options by filter_group_id
  const optionsByGroup = options.reduce<Record<string, typeof options>>(
    (acc, opt) => {
      acc[opt.filterGroupId] ??= [];
      acc[opt.filterGroupId].push(opt);
      return acc;
    },
    {}
  );

  const inserts: {
    productId: string;
    filterOptionId: string;
  }[] = [];

  for (const product of products) {
    // Pick 1 option from each group deterministically
    Object.values(optionsByGroup).forEach((groupOptions, index) => {
      const option =
        groupOptions[
          product.id.charCodeAt(0) % groupOptions.length
        ];

      inserts.push({
        productId: product.id,
        filterOptionId: option.id,
      });
    });
  }

  // 4. Insert safely (composite PK avoids duplicates)
  if (inserts.length) {
    await db.insert(productFilterOptions).values(inserts);
  }

  console.log("✅ product_filter_options seeded");
}
