import { db } from "@/db";
import { categoriesTable } from "@/db/schema/catalog/categories/table";
import { categoryAttributesTable } from "@/db/schema/catalog/category-attributes";
import { categoryAttributeOptionsTable } from "@/db/schema/catalog/category-attribute-options";

export const getProductCategories = async () => {
    // 1. Fetch categories
    let categories = await db.select().from(categoriesTable);

    // 2. If categories table is empty, seed dummy database records
    if (categories.length === 0) {
        console.log(" Database categories empty. Starting seeding catalog data...");

        // Seed 1. Ethnic Wear
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

        // Seed 2. Western Wear
        await db
            .insert(categoriesTable)
            .values({
                name: "Western Wear",
                slug: "western-wear",
                code: "CAT-WESTERN",
                path: "/western-wear",
                level: 0,
            });

        // Seed 3. Dupattas
        await db
            .insert(categoriesTable)
            .values({
                name: "Dupattas",
                slug: "dupattas",
                code: "CAT-DUPATTAS",
                path: "/dupattas",
                level: 0,
            });

        // Seed 4. Jewelry
        await db
            .insert(categoriesTable)
            .values({
                name: "Jewelry",
                slug: "jewelry",
                code: "CAT-JEWELRY",
                path: "/jewelry",
                level: 0,
            });

        // Seed 5. Footwear
        await db
            .insert(categoriesTable)
            .values({
                name: "Footwear",
                slug: "footwear",
                code: "CAT-FOOTWEAR",
                path: "/footwear",
                level: 0,
            });

        // Seed 6. Cosmetics
        await db
            .insert(categoriesTable)
            .values({
                name: "Cosmetics",
                slug: "cosmetics",
                code: "CAT-COSMETICS",
                path: "/cosmetics",
                level: 0,
            });

        // Seed Category Attributes (Size, Color, Fabric) for Ethnic Wear
        const [sizeAttr] = await db
            .insert(categoryAttributesTable)
            .values({
                categoryId: ethnicWear.id,
                attributeKey: "size",
                name: "Size",
                slug: "size",
                inputType: "SELECT",
                dataType: "STRING",
                isRequired: false,
                isFilterable: true,
                isVariantAttribute: true,
            })
            .returning();

        const [colorAttr] = await db
            .insert(categoryAttributesTable)
            .values({
                categoryId: ethnicWear.id,
                attributeKey: "color",
                name: "Color",
                slug: "color",
                inputType: "SELECT",
                dataType: "STRING",
                isRequired: false,
                isFilterable: true,
                isVariantAttribute: true,
            })
            .returning();

        const [fabricAttr] = await db
            .insert(categoryAttributesTable)
            .values({
                categoryId: ethnicWear.id,
                attributeKey: "fabric",
                name: "Fabric Material",
                slug: "fabric",
                inputType: "SELECT",
                dataType: "STRING",
                isRequired: false,
                isFilterable: true,
                isVariantAttribute: false,
            })
            .returning();

        // Seed Size Options
        const sizes = ["S", "M", "L", "XL", "XXL", "Free Size"];
        for (let i = 0; i < sizes.length; i++) {
            await db.insert(categoryAttributeOptionsTable).values({
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
            await db.insert(categoryAttributeOptionsTable).values({
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
            await db.insert(categoryAttributeOptionsTable).values({
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
    const attributes = await db.select().from(categoryAttributesTable);
    const options = await db.select().from(categoryAttributeOptionsTable);

    return {
        categories,
        attributes,
        options,
    };
}
