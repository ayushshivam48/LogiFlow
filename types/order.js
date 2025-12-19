// DeliveryOrder structure for order management
// Fields: id, userId, title, description, pickupAddress, deliveryAddress, packageType, weight, dimensions, urgency, preferredDate, status, createdAt, updatedAt, offers, assignedOffer

// DeliveryOffer structure for bid management
// Fields: id, orderId, ownerId, ownerName, companyName, price, estimatedDuration, description, rating, createdAt, status

// Package types: "document" | "small" | "medium" | "large" | "fragile"
// Urgency levels: "standard" | "express" | "urgent"
// Order statuses: "draft" | "published" | "bidding" | "assigned" | "in_transit" | "delivered" | "cancelled"
// Offer statuses: "pending" | "accepted" | "rejected"

export const PACKAGE_TYPES = {
  DOCUMENT: "document",
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
  FRAGILE: "fragile",
}

export const URGENCY_LEVELS = {
  STANDARD: "standard",
  EXPRESS: "express",
  URGENT: "urgent",
}

export const ORDER_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  BIDDING: "bidding",
  ASSIGNED: "assigned",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
}

export const OFFER_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
}

export const DeliveryOrder = {
  create: (data) => ({
    id: Date.now().toString(),
    userId: data.userId,
    title: data.title,
    description: data.description,
    pickupAddress: data.pickupAddress,
    deliveryAddress: data.deliveryAddress,
    packageType: data.packageType || PACKAGE_TYPES.SMALL,
    weight: data.weight,
    dimensions: data.dimensions,
    urgency: data.urgency || URGENCY_LEVELS.STANDARD,
    preferredDate: data.preferredDate,
    status: ORDER_STATUSES.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    offers: [],
    assignedOffer: null,
  }),
}

export const DeliveryOffer = {
  create: (data) => ({
    id: Date.now().toString(),
    orderId: data.orderId,
    ownerId: data.ownerId,
    ownerName: data.ownerName,
    companyName: data.companyName,
    price: data.price,
    estimatedDuration: data.estimatedDuration,
    description: data.description,
    rating: data.rating || 0,
    createdAt: new Date().toISOString(),
    status: OFFER_STATUSES.PENDING,
  }),
}

// Mock data for development
export const mockOrders = [
  {
    id: "1",
    userId: "user1",
    title: "Document Delivery",
    description: "Important legal documents need to be delivered urgently",
    pickupAddress: "123 Business St, Downtown",
    deliveryAddress: "456 Legal Ave, Uptown",
    packageType: PACKAGE_TYPES.DOCUMENT,
    weight: "0.5kg",
    dimensions: "A4 envelope",
    urgency: URGENCY_LEVELS.URGENT,
    preferredDate: "2024-01-15",
    status: ORDER_STATUSES.PUBLISHED,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
    offers: [],
    assignedOffer: null,
  },
  {
    id: "2",
    userId: "user1",
    title: "Electronics Package",
    description: "Fragile electronics package requiring careful handling",
    pickupAddress: "789 Tech Plaza, Silicon Valley",
    deliveryAddress: "321 Home St, Residential Area",
    packageType: PACKAGE_TYPES.FRAGILE,
    weight: "2.5kg",
    dimensions: "30x20x15cm",
    urgency: URGENCY_LEVELS.STANDARD,
    preferredDate: "2024-01-20",
    status: ORDER_STATUSES.IN_TRANSIT,
    createdAt: "2024-01-08T14:30:00Z",
    updatedAt: "2024-01-12T09:15:00Z",
    offers: [],
    assignedOffer: {
      id: "offer1",
      ownerId: "owner1",
      ownerName: "John Smith",
      companyName: "FastTrack Delivery",
      price: 25.99,
      estimatedDuration: "2-3 hours",
      description: "Professional handling with tracking",
      rating: 4.8,
    },
  },
]

export const mockOffers = [
  {
    id: "offer1",
    orderId: "1",
    ownerId: "owner1",
    ownerName: "John Smith",
    companyName: "FastTrack Delivery",
    price: 15.99,
    estimatedDuration: "1-2 hours",
    description: "Express delivery with real-time tracking",
    rating: 4.8,
    createdAt: "2024-01-10T11:00:00Z",
    status: OFFER_STATUSES.PENDING,
  },
  {
    id: "offer2",
    orderId: "1",
    ownerId: "owner2",
    ownerName: "Sarah Johnson",
    companyName: "QuickMove Logistics",
    price: 12.5,
    estimatedDuration: "2-3 hours",
    description: "Reliable service with insurance coverage",
    rating: 4.6,
    createdAt: "2024-01-10T11:30:00Z",
    status: OFFER_STATUSES.PENDING,
  },
]
