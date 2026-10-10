import "dotenv/config";
import { db } from "../db";
import { usersTable } from "../db/schema/users";
import { categoriesTable } from "../db/schema/catalog/categories/table";
import { productsTable } from "../db/schema/catalog/products/table";
import { seller as sellerTable } from "../db/schema/seller";
import { clientHeroBannersTable } from "../db/schema/client/hero-banners";
import { cartTable, cartItemsTable } from "../db/schema/client/cart";
import { clientLoyaltyAccountsTable } from "../db/schema/client/loyalty";
import { reviewsTable } from "../db/schema/reviews/table";
import { notifications } from "../db/schema/notifications/notification-events";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";

async function seedClientData() {
  console.log("--> Starting Needlon Client Storefront Seeding (Phase 10)...");

  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL environment variable is missing.");
    process.exit(1);
  }

  // 1. Ensure Default Buyer User
  console.log("1. Seeding / resolving buyer profile...");
  let [buyerUser] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, "buyer@needlon.com"))
    .limit(1);

  if (!buyerUser) {
    [buyerUser] = await db
      .insert(usersTable)
      .values({
        id: randomUUID(),
        name: "Arman Alam",
        email: "buyer@needlon.com",
        mobileNumber: "+91 9876543210",
        gender: "male",
      })
      .returning();
    console.log(`✓ Buyer created: ${buyerUser.email} (${buyerUser.id})`);
  } else {
    console.log(`✓ Existing buyer found: ${buyerUser.email} (${buyerUser.id})`);
  }

  // 2. Ensure Seller
  let [sellerRow] = await db.select().from(sellerTable).limit(1);
  if (!sellerRow) {
    [sellerRow] = await db
      .insert(sellerTable)
      .values({
        name: "Needlon Flagship Atelier",
        email: "atelier@needlon.com",
        role: "seller",
        emailVerified: true,
      })
      .returning();
  }

  // 3. Seed Hero Banners
  console.log("2. Seeding dynamic client hero banners...");
  const existingBanners = await db.select().from(clientHeroBannersTable);
  if (existingBanners.length === 0) {
    await db.insert(clientHeroBannersTable).values([
      {
        name: "Autumn / Winter Tailoring",
        description: "Handcrafted cashmere blazers, wool coats, and fine merino knitwear.",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
        offer: "Up to 30% Off",
        slug: "autumn-winter-tailoring",
        displayOrder: 1,
        isActive: true,
      },
      {
        name: "Evening Silk & Velvet Collection",
        description: "Exquisite couture dinner jackets and evening satin dresses.",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200",
        offer: "Flat 25% Off with code PREM25",
        slug: "evening-silk-velvet",
        displayOrder: 2,
        isActive: true,
      },
      {
        name: "Bespoke Modern Essentials",
        description: "Italian cotton oxford shirts, pleated trousers, and artisan leather loafers.",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1200",
        offer: "Free Shipping Worldwide",
        slug: "modern-essentials",
        displayOrder: 3,
        isActive: true,
      },
    ]);
    console.log("✓ Seeded 3 hero banners into client_hero_banners.");
  } else {
    console.log(`✓ Hero banners already present (${existingBanners.length} records).`);
  }

  // 4. Seed Store Categories if empty
  console.log("3. Ensuring store categories...");
  const existingCats = await db.select().from(categoriesTable);
  if (existingCats.length === 0) {
    await db.insert(categoriesTable).values([
      {
        name: "Men's Tailoring",
        slug: "mens-tailoring",
        description: "Suits, blazers, and shirts",
        status: "ACTIVE",
      },
      {
        name: "Women's Couture",
        slug: "womens-couture",
        description: "Evening wear and formal wear",
        status: "ACTIVE",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Artisan leather and silk accessories",
        status: "ACTIVE",
      },
    ]);
    console.log("✓ Seeded store categories.");
  } else {
    console.log(`✓ Store categories present (${existingCats.length} categories).`);
  }

  // 5. Seed Client Cart Items
  console.log("4. Seeding persistent client cart test items...");
  const [product] = await db.select().from(productsTable).limit(1);
  if (product) {
    let [cart] = await db
      .select()
      .from(cartTable)
      .where(eq(cartTable.userId, buyerUser.id))
      .limit(1);

    if (!cart) {
      [cart] = await db
        .insert(cartTable)
        .values({
          userId: buyerUser.id,
        })
        .returning();
    }

    const cartItems = await db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.cartId, cart.id));

    if (cartItems.length === 0) {
      await db.insert(cartItemsTable).values({
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
        size: "M",
        color: "Navy",
      });
      console.log(`✓ Seeded test item in client cart for buyer ${buyerUser.email}`);
    } else {
      console.log(`✓ Cart items already present for buyer.`);
    }

    // 6. Seed Product Verified Review
    console.log("5. Seeding verified buyer reviews...");
    const [existingRev] = await db
      .select()
      .from(reviewsTable)
      .where(and(eq(reviewsTable.productId, product.id), eq(reviewsTable.buyerId, buyerUser.id)))
      .limit(1);

    if (!existingRev) {
      await db.insert(reviewsTable).values({
        sellerId: sellerRow.id,
        buyerId: buyerUser.id,
        productId: product.id,
        rating: 5,
        title: "Perfection in craftsmanship",
        content: "Superb drape and precision stitching. Highly recommend Needlon atelier.",
        isVerifiedBuyer: true,
        status: "PUBLISHED",
      });
      console.log(`✓ Seeded verified 5★ review for product ${product.name}`);
    } else {
      console.log(`✓ Review already exists for product.`);
    }
  }

  // 7. Seed Loyalty Account
  console.log("6. Seeding buyer loyalty points...");
  let [loyalty] = await db
    .select()
    .from(clientLoyaltyAccountsTable)
    .where(eq(clientLoyaltyAccountsTable.userId, buyerUser.id))
    .limit(1);

  if (!loyalty) {
    await db.insert(clientLoyaltyAccountsTable).values({
      userId: buyerUser.id,
      pointsBalance: 500,
      tier: "SILVER",
    });
    console.log("✓ Seeded buyer loyalty account with 500 pts (SILVER tier).");
  } else {
    console.log(`✓ Loyalty account already active (${loyalty.pointsBalance} pts).`);
  }

  // 8. Seed In-App Notifications
  console.log("7. Seeding buyer notifications...");
  const buyerNotifs = await db
    .select()
    .from(notifications)
    .where(and(eq(notifications.recipientType, "BUYER"), eq(notifications.recipientId, buyerUser.id)));

  if (buyerNotifs.length === 0) {
    await db.insert(notifications).values([
      {
        recipientType: "BUYER",
        recipientId: buyerUser.id,
        notificationType: "ORDER_STATUS",
        title: "Welcome to Needlon Atelier",
        message: "Your account is verified. Enjoy free bespoke alterations on all orders.",
        priority: "NORMAL",
        isRead: false,
      },
      {
        recipientType: "BUYER",
        recipientId: buyerUser.id,
        notificationType: "PROMOTION",
        title: "First Order Gift: 20% Off",
        message: "Use voucher code WELCOME20 to get 20% off your first handcrafted piece.",
        priority: "HIGH",
        isRead: false,
      },
    ]);
    console.log("✓ Seeded initial notifications for buyer.");
  } else {
    console.log(`✓ Notifications already present (${buyerNotifs.length} records).`);
  }

  console.log("=== Phase 10: Client Storefront Data Seeding Complete ===");
}

seedClientData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seeding Error:", err);
    process.exit(1);
  });
