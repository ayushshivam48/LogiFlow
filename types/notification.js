// Notification structure for notification management
// Fields: id, userId, type, title, message, orderId, isRead, createdAt, priority, actionUrl

// StatusUpdate structure for tracking order status changes
// Fields: id, orderId, previousStatus, newStatus, updatedBy, updatedByRole, message, timestamp

// Notification types: "order_status" | "bid_received" | "bid_accepted" | "bid_rejected" | "system" | "reminder"
// Priority levels: "low" | "medium" | "high"
// User roles: "user" | "owner" | "admin" | "system"

export const NOTIFICATION_TYPES = {
  ORDER_STATUS: "order_status",
  BID_RECEIVED: "bid_received",
  BID_ACCEPTED: "bid_accepted",
  BID_REJECTED: "bid_rejected",
  SYSTEM: "system",
  REMINDER: "reminder",
}

export const PRIORITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
}

export const USER_ROLES = {
  USER: "user",
  OWNER: "owner",
  ADMIN: "admin",
  SYSTEM: "system",
}

export const Notification = {
  create: (data) => ({
    id: Date.now().toString(),
    userId: data.userId,
    type: data.type,
    title: data.title,
    message: data.message,
    orderId: data.orderId || null,
    isRead: false,
    createdAt: new Date().toISOString(),
    priority: data.priority || PRIORITY_LEVELS.MEDIUM,
    actionUrl: data.actionUrl || null,
  }),
}

export const StatusUpdate = {
  create: (data) => ({
    id: Date.now().toString(),
    orderId: data.orderId,
    previousStatus: data.previousStatus,
    newStatus: data.newStatus,
    updatedBy: data.updatedBy,
    updatedByRole: data.updatedByRole,
    message: data.message,
    timestamp: new Date().toISOString(),
  }),
}

// Mock notifications for development
export const mockNotifications = [
  {
    id: "1",
    userId: "user1",
    type: NOTIFICATION_TYPES.BID_RECEIVED,
    title: "New Bid Received",
    message: "FastTrack Delivery submitted a bid for your document delivery order",
    orderId: "1",
    isRead: false,
    createdAt: "2024-01-10T11:00:00Z",
    priority: PRIORITY_LEVELS.HIGH,
    actionUrl: "/orders/1",
  },
  {
    id: "2",
    userId: "user1",
    type: NOTIFICATION_TYPES.ORDER_STATUS,
    title: "Order Status Updated",
    message: "Your electronics package is now in transit",
    orderId: "2",
    isRead: false,
    createdAt: "2024-01-12T09:15:00Z",
    priority: PRIORITY_LEVELS.MEDIUM,
    actionUrl: "/orders/2",
  },
  {
    id: "3",
    userId: "owner1",
    type: NOTIFICATION_TYPES.BID_ACCEPTED,
    title: "Bid Accepted",
    message: "Your bid for document delivery has been accepted",
    orderId: "1",
    isRead: true,
    createdAt: "2024-01-10T15:30:00Z",
    priority: PRIORITY_LEVELS.HIGH,
    actionUrl: "/deliveries/1",
  },
]

export const mockStatusUpdates = [
  {
    id: "1",
    orderId: "2",
    previousStatus: "assigned",
    newStatus: "in_transit",
    updatedBy: "owner1",
    updatedByRole: USER_ROLES.OWNER,
    message: "Package picked up and en route to destination",
    timestamp: "2024-01-12T09:15:00Z",
  },
  {
    id: "2",
    orderId: "1",
    previousStatus: "published",
    newStatus: "assigned",
    updatedBy: "user1",
    updatedByRole: USER_ROLES.USER,
    message: "Bid accepted from FastTrack Delivery",
    timestamp: "2024-01-10T15:30:00Z",
  },
]
