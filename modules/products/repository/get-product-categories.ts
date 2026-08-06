import { db } from "@/db";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { categoryAttributes } from "@/db/schema/catalog/categories/category_attributes";
import { categoryAttributeOptions } from "@/db/schema/catalog/categories/category_attribute_options";

export const getProductCategories = async () => {
    // 1. Fetch categories
    let categories = await db.select().from(categoriesTable);

    // 2. If categories table is empty, seed dummy database records
    if (categories.length === 0) {
        console.log(" Database categories empty. Starting seeding catalog data...");

        // Seed main category: Ethnic Wear
        const [ethnicWear] = await db
            .insert(categoriesTable)
            .values({
                name: "Ethnic Wear",
                slug: "ethnic-wear",
                code: "CAT-ETHNIC",
                path: "/ethnic-wear",
                level: 0,
            })
            .returning();

        // Seed Category Attributes (Size, Color, Fabric) for Ethnic Wear
        const [sizeAttr] = await db
            .insert(categoryAttributes)
            .values({
                categoryId: ethnicWear.id,
                name: "Size",
                slug: "size",
                inputType: "SELECT",
                isRequired: false,
                isFilterable: true,
                isVariantAttribute: true,
            })
            .returning();

        const [colorAttr] = await db
            .insert(categoryAttributes)
            .values({
                categoryId: ethnicWear.id,
                name: "Color",
                slug: "color",
                inputType: "SELECT",
                isRequired: false,
                isFilterable: true,
                isVariantAttribute: true,
            })
            .returning();

        const [fabricAttr] = await db
            .insert(categoryAttributes)
            .values({
                categoryId: ethnicWear.id,
                name: "Fabric Material",
                slug: "fabric",
                inputType: "SELECT",
                isRequired: false,
                isFilterable: true,
                isVariantAttribute: false,
            })
            .returning();

        // Seed Size Options
        const sizes = ["S", "M", "L", "XL", "XXL", "Free Size"];
        for (let i = 0; i < sizes.length; i++) {
            await db.insert(categoryAttributeOptions).values({
                attributeId: sizeAttr.id,
                label: sizes[i],
                value: sizes[i].toLowerCase().replace(" ", "_"),
                displayOrder: i,
            });
        }

        // Seed Color Options
        const colors = [
            { label: "Crimson Red", val: "crimson_red", hex: "#DC2626" },
            { label: "Gold", val: "gold", hex: "#D97706" },
            { label: "Blue", val: "blue", hex: "#2563EB" },
            { label: "Green", val: "green", hex: "#16A34A" },
            { label: "Black", val: "black", hex: "#000000" },
            { label: "White", val: "white", hex: "#FFFFFF" },
        ];
        for (let i = 0; i < colors.length; i++) {
            await db.insert(categoryAttributeOptions).values({
                attributeId: colorAttr.id,
                label: colors[i].label,
                value: colors[i].val,
                colorHex: colors[i].hex,
                displayOrder: i,
            });
        }

        // Seed Fabric Options
        const fabrics = ["Cotton", "Silk", "Banarasi Silk", "Georgette", "Chiffon", "Linen"];
        for (let i = 0; i < fabrics.length; i++) {
            await db.insert(categoryAttributeOptions).values({
                attributeId: fabricAttr.id,
                label: fabrics[i],
                value: fabrics[i].toLowerCase().replace(" ", "_"),
                displayOrder: i,
            });
        }

        // Re-fetch category list after seeding
        categories = await db.select().from(categoriesTable);
        console.log(" Database catalog successfully seeded.");
    }

    // Load category attributes and options associated
    const attributes = await db.select().from(categoryAttributes);
    const options = await db.select().from(categoryAttributeOptions);

    return {
        categories,
        attributes,
        options,
    };
}
