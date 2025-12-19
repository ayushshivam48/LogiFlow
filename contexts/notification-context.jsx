"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

const NotificationContext = createContext(undefined)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  // Mock notifications for demonstration
  useEffect(() => {
    if (user) {
      const mockNotifications = [
        {
          id: "1",
          userId: user.id,
          type: "bid_received",
          title: "New Bid Received",
          message: "Fast Delivery Co submitted a bid of $25.00 for your document delivery order",
          orderId: "1",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          priority: "medium",
          actionUrl: "/orders/1",
        },
        {
          id: "2",
          userId: user.id,
          type: "order_status",
          title: "Order Status Updated",
          message: 'Your order "Product Sample Delivery" is now in transit',
          orderId: "2",
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          priority: "high",
          actionUrl: "/orders/2",
        },
        {
          id: "3",
          userId: user.id,
          type: "system",
          title: "Welcome to LogiFlow",
          message: "Thank you for joining our logistics platform. Start by creating your first delivery order.",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          priority: "low",
        },
      ]

      // Filter notifications based on user role
      const filteredNotifications = mockNotifications.filter((notification) => {
        if (user.role === "admin") return true // Admins see all notifications
        return notification.userId === user.id
      })

      setNotifications(filteredNotifications)
    }
  }, [user])

  const addNotification = (notificationData) => {
    if (!user) return

    const newNotification = {
      ...notificationData,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      isRead: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const clearNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
