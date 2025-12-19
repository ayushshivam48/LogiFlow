// Rating structure for review management
// Fields: id, orderId, userId, ownerId, ownerName, companyName, rating, review, categories, isRecommended, createdAt, updatedAt, isVerified

// RatingSummary structure for aggregated rating data
// Fields: ownerId, companyName, averageRating, totalRatings, ratingDistribution, categoryAverages, recommendationRate

// Rating scale: 1-5 stars
// Categories: communication, timeliness, packaging, professionalism

export const RATING_CATEGORIES = {
  COMMUNICATION: "communication",
  TIMELINESS: "timeliness",
  PACKAGING: "packaging",
  PROFESSIONALISM: "professionalism",
}

export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
}

export const createEmptyRating = () => ({
  rating: 0,
  review: "",
  categories: {
    communication: 0,
    timeliness: 0,
    packaging: 0,
    professionalism: 0,
  },
  isRecommended: false,
})

export const createEmptyRatingSummary = (ownerId, companyName) => ({
  ownerId,
  companyName,
  averageRating: 0,
  totalRatings: 0,
  ratingDistribution: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
  categoryAverages: {
    communication: 0,
    timeliness: 0,
    packaging: 0,
    professionalism: 0,
  },
  recommendationRate: 0,
})

export const Rating = {
  create: (data) => ({
    id: Date.now().toString(),
    orderId: data.orderId,
    userId: data.userId,
    ownerId: data.ownerId,
    ownerName: data.ownerName,
    companyName: data.companyName,
    rating: data.rating,
    review: data.review || "",
    categories: data.categories || {
      communication: data.rating,
      timeliness: data.rating,
      packaging: data.rating,
      professionalism: data.rating,
    },
    isRecommended: data.isRecommended || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: false,
  }),
}

export const RatingSummary = {
  create: (ownerId, companyName) => createEmptyRatingSummary(ownerId, companyName),

  calculate: (ratings) => {
    if (!ratings || ratings.length === 0) {
      return createEmptyRatingSummary("", "")
    }

    const totalRatings = ratings.length
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings

    const ratingDistribution = {
      5: ratings.filter((r) => r.rating === 5).length,
      4: ratings.filter((r) => r.rating === 4).length,
      3: ratings.filter((r) => r.rating === 3).length,
      2: ratings.filter((r) => r.rating === 2).length,
      1: ratings.filter((r) => r.rating === 1).length,
    }

    const categoryAverages = {
      communication: ratings.reduce((sum, r) => sum + r.categories.communication, 0) / totalRatings,
      timeliness: ratings.reduce((sum, r) => sum + r.categories.timeliness, 0) / totalRatings,
      packaging: ratings.reduce((sum, r) => sum + r.categories.packaging, 0) / totalRatings,
      professionalism: ratings.reduce((sum, r) => sum + r.categories.professionalism, 0) / totalRatings,
    }

    const recommendationRate = (ratings.filter((r) => r.isRecommended).length / totalRatings) * 100

    return {
      ownerId: ratings[0]?.ownerId || "",
      companyName: ratings[0]?.companyName || "",
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
      ratingDistribution,
      categoryAverages,
      recommendationRate: Math.round(recommendationRate),
    }
  },
}

// Mock ratings for development
export const mockRatings = [
  {
    id: "1",
    orderId: "2",
    userId: "user1",
    ownerId: "owner1",
    ownerName: "John Smith",
    companyName: "FastTrack Delivery",
    rating: 5,
    review: "Excellent service! Package arrived safely and on time.",
    categories: {
      communication: 5,
      timeliness: 5,
      packaging: 4,
      professionalism: 5,
    },
    isRecommended: true,
    createdAt: "2024-01-13T10:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
    isVerified: true,
  },
  {
    id: "2",
    orderId: "3",
    userId: "user2",
    ownerId: "owner1",
    ownerName: "John Smith",
    companyName: "FastTrack Delivery",
    rating: 4,
    review: "Good service overall, minor delay but well communicated.",
    categories: {
      communication: 5,
      timeliness: 3,
      packaging: 4,
      professionalism: 4,
    },
    isRecommended: true,
    createdAt: "2024-01-11T16:30:00Z",
    updatedAt: "2024-01-11T16:30:00Z",
    isVerified: true,
  },
]

export const mockRatingSummaries = [
  {
    ownerId: "owner1",
    companyName: "FastTrack Delivery",
    averageRating: 4.8,
    totalRatings: 25,
    ratingDistribution: {
      5: 18,
      4: 5,
      3: 2,
      2: 0,
      1: 0,
    },
    categoryAverages: {
      communication: 4.9,
      timeliness: 4.6,
      packaging: 4.8,
      professionalism: 4.9,
    },
    recommendationRate: 92,
  },
  {
    ownerId: "owner2",
    companyName: "QuickMove Logistics",
    averageRating: 4.6,
    totalRatings: 18,
    ratingDistribution: {
      5: 12,
      4: 4,
      3: 2,
      2: 0,
      1: 0,
    },
    categoryAverages: {
      communication: 4.7,
      timeliness: 4.4,
      packaging: 4.6,
      professionalism: 4.8,
    },
    recommendationRate: 89,
  },
]
