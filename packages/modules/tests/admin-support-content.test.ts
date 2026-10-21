/**
 * Admin support inbox + content authoring integration test (live Postgres):
 *
 *   - a ticket + seller message created through the EXISTING seller-side
 *     support repository is visible in the staff inbox with the seller's
 *     identity, message count and last-message preview
 *   - an agent reply lands with senderType 'agent' and is returned by the
 *     seller-side thread read (getTicketDetailsRepo) — proving the seller
 *     sees staff replies in their own support UI
 *   - staff status transitions persist
 *   - knowledge base: create (slug auto-generated) -> seller-side list only
 *     exposes published articles; the admin publishedOnly filter behaves;
 *     update publishes a draft; delete removes it
 *   - hero banners: create -> the storefront read path (HeroBannerService)
 *     returns it -> deactivate hides it -> delete removes it
 *
 * Run (from packages/modules):
 *   DATABASE_URL=postgres://needlon:needlon@localhost:5432/needlon_test
 *     node <tsx-cli> tests/admin-support-content.test.ts
 */
import assert from "node:assert";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";

// Env defaults MUST be set before any module that creates the DB client
// (packages/db reads DATABASE_URL at import time) is loaded — hence the
// dynamic imports inside main().
process.env.DATABASE_URL ??=
  "postgres://needlon:needlon@localhost:5432/needlon_test";

const stamp = Date.now().toString().slice(-6);
const sellerId = randomUUID();
const adminId = randomUUID();
const storeId = randomUUID();
const sellerEmail = `sup-seller-${stamp}@example.com`;
const adminEmail = `sup-admin-${stamp}@example.com`;
const sellerName = `Support Seller ${stamp}`;
const adminName = `Support Admin ${stamp}`;
const storeName = `Support Store ${stamp}`;

let ticketId = "";
const articleIdsForCleanup: string[] = [];
const bannerIdsForCleanup: string[] = [];

async function main() {
  const { db } = await import("../../db/db/index");
  const { seller } = await import("../../db/db/schema/seller");
  const { sellerStore } = await import("../../db/db/schema/seller/seller-store");
  const {
    sellerSupportTickets,
    supportTicketMessages,
    knowledgeBaseArticles,
  } = await import("../../db/db/schema/help");
  const { clientHeroBannersTable } = await import(
    "../../db/db/schema/client/hero-banners"
  );

  const { createSupportTicketRepo, getTicketDetailsRepo } = await import(
    "../modules/help/repository/support.repository"
  );
  const { getKnowledgeBaseArticlesRepo, getArticleBySlugRepo } = await import(
    "../modules/help/repository/help.repository"
  );
  const {
    listAdminSupportTickets,
    getAdminSupportTicketThread,
    replyAsAgent,
    setAdminTicketStatus,
  } = await import("../modules/admin/repository/admin-support.repository");
  const {
    createAdminKnowledgeBaseArticle,
    updateAdminKnowledgeBaseArticle,
    deleteAdminKnowledgeBaseArticle,
    listAdminKnowledgeBaseArticles,
  } = await import(
    "../modules/admin/repository/admin-knowledge-base.repository"
  );
  const {
    createAdminHeroBanner,
    updateAdminHeroBanner,
    deleteAdminHeroBanner,
    listAdminHeroBanners,
  } = await import("../modules/admin/repository/admin-hero-banners.repository");
  const { HeroBannerService } = await import(
    "../../client-packages/client-modules/home/services/hero-banner-service"
  );
  const { slugifyText } = await import("../modules/shared/slug/slugify");

  async function cleanup() {
    if (ticketId) {
      await db
        .delete(supportTicketMessages)
        .where(eq(supportTicketMessages.ticketId, ticketId));
      await db
        .delete(sellerSupportTickets)
        .where(eq(sellerSupportTickets.id, ticketId));
    }
    for (const id of articleIdsForCleanup) {
      await db
        .delete(knowledgeBaseArticles)
        .where(eq(knowledgeBaseArticles.id, id));
    }
    for (const id of bannerIdsForCleanup) {
      await db
        .delete(clientHeroBannersTable)
        .where(eq(clientHeroBannersTable.id, id));
    }
    await db.delete(sellerStore).where(eq(sellerStore.id, storeId));
    await db.delete(seller).where(eq(seller.id, sellerId));
    await db.delete(seller).where(eq(seller.id, adminId));
  }

  try {
    console.log("=== ADMIN SUPPORT + CONTENT ===");

    // Fixtures: a seller (with store) and a platform admin account.
    await db.insert(seller).values({
      id: sellerId,
      name: sellerName,
      email: sellerEmail,
      passwordHash: "test-hash",
      emailVerified: true,
    });
    await db.insert(seller).values({
      id: adminId,
      name: adminName,
      email: adminEmail,
      passwordHash: "test-hash",
      emailVerified: true,
      role: "admin",
    });
    await db.insert(sellerStore).values({
      id: storeId,
      sellerId,
      storeName,
      storeSlug: `sup-store-${stamp}`,
    });
    console.log("✓ Fixtures: seller + store, admin account");

    // (a) Support: ticket created through the seller-side repository -------
    const initialMessage = `Payout for order SUP-${stamp} has not arrived yet.`;
    const ticket = await createSupportTicketRepo(sellerId, {
      subject: `Payout missing ${stamp}`,
      category: "PAYMENT_PAYOUT",
      priority: "HIGH",
      message: initialMessage,
    });
    ticketId = ticket.id;
    assert.equal(ticket.status, "OPEN");
    console.log("✓ Ticket created via seller-side createSupportTicketRepo");

    const inbox = await listAdminSupportTickets({});
    const inboxRow = inbox.find((t) => t.id === ticketId);
    assert.ok(inboxRow, "staff inbox should list the seller's ticket");
    assert.equal(inboxRow.sellerName, sellerName);
    assert.equal(inboxRow.storeName, storeName);
    assert.equal(inboxRow.messageCount, 1);
    assert.equal(inboxRow.lastMessage?.message, initialMessage);
    assert.equal(inboxRow.lastMessage?.senderType, "seller");
    console.log("✓ Inbox shows seller identity, count and last-message preview");

    const openOnly = await listAdminSupportTickets({ status: "OPEN" });
    assert.ok(openOnly.some((t) => t.id === ticketId));
    const resolvedOnly = await listAdminSupportTickets({ status: "RESOLVED" });
    assert.ok(!resolvedOnly.some((t) => t.id === ticketId));
    const bySearch = await listAdminSupportTickets({
      search: `Support Seller ${stamp}`,
    });
    assert.ok(bySearch.some((t) => t.id === ticketId));
    console.log("✓ Inbox status filter + seller search behave");

    // (b) Agent reply -> visible to the seller through their own read path -
    const replyText = `We have traced payout SUP-${stamp}; it lands tomorrow.`;
    const thread = await replyAsAgent(ticketId, adminId, replyText);
    assert.equal(thread.messages.length, 2);
    const agentMessage = thread.messages[1];
    assert.ok(agentMessage, "thread should contain the agent reply");
    assert.equal(agentMessage.senderType, "agent");
    assert.equal(agentMessage.senderName, adminName);
    assert.equal(agentMessage.message, replyText);
    assert.equal(thread.ticket.status, "IN_PROGRESS");
    assert.equal(thread.ticket.assignedAgent, adminName);
    console.log("✓ Agent reply recorded (senderType 'agent'), ticket IN_PROGRESS");

    const sellerView = await getTicketDetailsRepo(sellerId, ticketId);
    assert.ok(sellerView, "seller-side thread read should return the ticket");
    const timeline = sellerView.timeline ?? [];
    const visibleReply = timeline.find((m) => m.message === replyText);
    assert.ok(
      visibleReply,
      "seller-side timeline must include the agent reply",
    );
    assert.equal(visibleReply.senderType, "agent");
    assert.equal(sellerView.status, "IN_PROGRESS");
    console.log("✓ Seller-side getTicketDetailsRepo returns the agent reply");

    // (c) Staff status transition -------------------------------------------
    const resolved = await setAdminTicketStatus(ticketId, "RESOLVED");
    assert.equal(resolved.status, "RESOLVED");
    const sellerViewAfter = await getTicketDetailsRepo(sellerId, ticketId);
    assert.equal(sellerViewAfter?.status, "RESOLVED");
    const threadAfter = await getAdminSupportTicketThread(ticketId);
    assert.equal(threadAfter.ticket.messageCount, 2);
    console.log("✓ Status transition to RESOLVED persists on both read paths");

    // (d) Knowledge base authoring -------------------------------------------
    const publishedTitle = `Getting Paid Guide ${stamp}`;
    const published = await createAdminKnowledgeBaseArticle({
      title: publishedTitle,
      category: "payment",
      description: "How payouts work.",
      content: "Payouts are settled weekly to your registered bank account.",
    });
    articleIdsForCleanup.push(published.id);
    assert.equal(published.slug, slugifyText(publishedTitle));
    assert.equal(published.isPublished, true);

    const draftTitle = `Draft Delivery Notes ${stamp}`;
    const draft = await createAdminKnowledgeBaseArticle({
      title: draftTitle,
      category: "delivery",
      description: "Internal draft.",
      content: "Draft content not yet ready for sellers.",
      isPublished: false,
    });
    articleIdsForCleanup.push(draft.id);
    assert.equal(draft.isPublished, false);
    console.log("✓ KB articles created; slug auto-generated from title");

    const sellerArticles = await getKnowledgeBaseArticlesRepo();
    assert.ok(
      sellerArticles.some((a) => a.id === published.id),
      "seller-side KB list should include the published article",
    );
    assert.ok(
      !sellerArticles.some((a) => a.id === draft.id),
      "seller-side KB list must hide drafts",
    );
    const draftBySlug = await getArticleBySlugRepo(draft.slug);
    assert.equal(draftBySlug, undefined, "draft must not resolve by slug");
    console.log("✓ Seller-side KB reads expose published articles only");

    const allArticles = await listAdminKnowledgeBaseArticles();
    assert.ok(allArticles.some((a) => a.id === draft.id));
    const publishedOnly = await listAdminKnowledgeBaseArticles({
      publishedOnly: true,
    });
    assert.ok(publishedOnly.some((a) => a.id === published.id));
    assert.ok(!publishedOnly.some((a) => a.id === draft.id));
    console.log("✓ Admin KB list publishedOnly filter behaves");

    const republished = await updateAdminKnowledgeBaseArticle(draft.id, {
      title: `Delivery Notes ${stamp}`,
      isPublished: true,
    });
    assert.equal(republished.isPublished, true);
    const sellerArticlesAfter = await getKnowledgeBaseArticlesRepo();
    assert.ok(sellerArticlesAfter.some((a) => a.id === draft.id));
    console.log("✓ Publishing a draft via update makes it seller-visible");

    await deleteAdminKnowledgeBaseArticle(published.id);
    const afterDelete = await listAdminKnowledgeBaseArticles();
    assert.ok(!afterDelete.some((a) => a.id === published.id));
    articleIdsForCleanup.splice(
      articleIdsForCleanup.indexOf(published.id),
      1,
    );
    console.log("✓ KB article deleted");

    // (e) Hero banners ---------------------------------------------------------
    const banner = await createAdminHeroBanner({
      name: `Festive Sale ${stamp}`,
      description: "Seasonal storefront banner",
      image: "https://example.com/banners/festive.png",
      offer: "Up to 50% off",
      slug: `festive-sale-${stamp}`,
      displayOrder: 1,
      isActive: true,
    });
    bannerIdsForCleanup.push(banner.id);

    const storefront = await HeroBannerService.getActiveHeroBanners();
    assert.ok(
      storefront.some((b) => b.id === banner.id),
      "storefront read path should return the new active banner",
    );
    console.log("✓ Storefront HeroBannerService returns the created banner");

    const deactivated = await updateAdminHeroBanner(banner.id, {
      isActive: false,
    });
    assert.equal(deactivated.isActive, false);
    const storefrontAfter = await HeroBannerService.getActiveHeroBanners();
    assert.ok(
      !storefrontAfter.some((b) => b.id === banner.id),
      "deactivated banner must disappear from the storefront",
    );
    console.log("✓ Deactivating a banner hides it from the storefront");

    await deleteAdminHeroBanner(banner.id);
    const adminBanners = await listAdminHeroBanners();
    assert.ok(!adminBanners.some((b) => b.id === banner.id));
    bannerIdsForCleanup.length = 0;
    console.log("✓ Hero banner deleted");

    console.log("=== ALL ADMIN SUPPORT + CONTENT CHECKS PASSED ===");
  } finally {
    await cleanup().catch((err: unknown) => {
      console.error("Cleanup failed:", err);
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("✗ ADMIN SUPPORT + CONTENT FAILED:", err);
    process.exit(1);
  });
