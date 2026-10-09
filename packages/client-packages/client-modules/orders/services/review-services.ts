export const ReviewService = {
  async createReview({ orderItemId, productId, userId, userName, rating, comment }: any) {
    return {
      id: `rev-${Date.now()}`,
      productId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date(),
    };
  }
};