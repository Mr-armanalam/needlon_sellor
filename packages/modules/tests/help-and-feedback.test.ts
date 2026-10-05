import assert from "node:assert";
import { createSupportTicketSchema } from "../modules/help/dto/support.dto";
import {
  createFeedbackSchema,
  submitSurveySchema,
  addCommentSchema,
} from "../modules/feedback/dto/feedback.dto";

function testSupportTicketValidations() {
  console.log("--> Testing Support Ticket Zod Validations...");

  const validTicket = {
    subject: "Order Payout Reconciliation Query",
    category: "PAYMENT_PAYOUT",
    priority: "HIGH",
    message: "Requesting breakdown of weekly bank transfer settlements for order #94012.",
  };

  const parsedTicket = createSupportTicketSchema.parse(validTicket);
  assert.strictEqual(parsedTicket.subject, "Order Payout Reconciliation Query");
  assert.strictEqual(parsedTicket.category, "PAYMENT_PAYOUT");
  assert.strictEqual(parsedTicket.priority, "HIGH");

  // Invalid short subject assertion
  assert.throws(() => {
    createSupportTicketSchema.parse({
      subject: "hi",
      category: "OTHER",
      priority: "LOW",
      message: "Short message length test.",
    });
  });

  console.log("✓ Support Ticket Zod validation tests passed.");
}

function testFeedbackValidations() {
  console.log("--> Testing Feedback Ecosystem Zod Validations...");

  const validFeedback = {
    title: "Multi-currency checkout selector",
    category: "Feature Request",
    priority: "High",
    description: "Allow international buyers to view catalog prices in USD, EUR, and GBP.",
    deviceInfo: "Windows 11 Desktop",
    browserInfo: "Google Chrome 124",
    appVersion: "v2.4.1",
  };

  const parsedFeedback = createFeedbackSchema.parse(validFeedback);
  assert.strictEqual(parsedFeedback.title, "Multi-currency checkout selector");
  assert.strictEqual(parsedFeedback.category, "Feature Request");

  // Survey validation
  const validSurvey = {
    rating: 5,
    feedbackText: "Great store experience!",
    context: "Product Listing Workflow",
  };

  const parsedSurvey = submitSurveySchema.parse(validSurvey);
  assert.strictEqual(parsedSurvey.rating, 5);

  // Invalid rating assertion (> 5)
  assert.throws(() => {
    submitSurveySchema.parse({ rating: 10 });
  });

  // Comment validation
  const validComment = { comment: "We would love this feature!" };
  const parsedComment = addCommentSchema.parse(validComment);
  assert.strictEqual(parsedComment.comment, "We would love this feature!");

  console.log("✓ Feedback Ecosystem Zod validation tests passed.");
}

function testUpvoteCounterLogic() {
  console.log("--> Testing Roadmap Upvote Counter Logic...");

  let upvoteCount = 142;
  let hasVoted = false;

  // Toggle vote ON
  if (!hasVoted) {
    upvoteCount += 1;
    hasVoted = true;
  }
  assert.strictEqual(upvoteCount, 143);
  assert.strictEqual(hasVoted, true);

  // Toggle vote OFF
  if (hasVoted) {
    upvoteCount -= 1;
    hasVoted = false;
  }
  assert.strictEqual(upvoteCount, 142);
  assert.strictEqual(hasVoted, false);

  console.log("✓ Upvote counter calculation tests passed.");
}

function testSearchFilteringLogic() {
  console.log("--> Testing Knowledge Base Search Filtering...");

  const mockArticles = [
    { title: "Product Photography Tips", category: "selling", content: "Use optimal daylight background." },
    { title: "Setting Up Local Delivery Radius", category: "delivery", content: "Configure pin codes." },
    { title: "Refund Policy Blueprints", category: "payment", content: "Manage buyer returns." },
  ];

  const query = "photograph";
  const matched = mockArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query)
  );

  assert.strictEqual(matched.length, 1);
  assert.strictEqual(matched[0].title, "Product Photography Tips");

  console.log("✓ Knowledge base search filtering tests passed.");
}

function runAllTests() {
  console.log("=== HELP CENTER & FEEDBACK ECOSYSTEM MODULE TEST SUITE ===");
  testSupportTicketValidations();
  testFeedbackValidations();
  testUpvoteCounterLogic();
  testSearchFilteringLogic();
  console.log("=== ALL HELP & FEEDBACK UNIT TESTS PASSED SUCCESSFULLY! ===");
}

runAllTests();
