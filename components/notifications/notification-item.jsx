"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Package, DollarSign, AlertCircle, Info } from "lucide-react"
import { useNotifications } from "@/contexts/notification-context"

const NotificationItem = ({ notification, onClose }) => {
  const { markAsRead, clearNotification } = useNotifications()

  const getIcon = (type) => {
    switch (type) {
      case "order_status":
        return <Package className="h-4 w-4" />
      case "bid_received":
      case "bid_accepted":
      case "bid_rejected":
        return <DollarSign className="h-4 w-4" />
      case "system":
        return <Info className="h-4 w-4" />
      case "reminder":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      // In a real app, this would navigate to the URL
      console.log("Navigate to:", notification.actionUrl)
    }
    onClose?.()
  }

  const handleClear = (e) => {
    e.stopPropagation()
    clearNotification(notification.id)
  }

  const timeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div
      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
        !notification.isRead ? "bg-blue-50/50" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
            </div>

            <div className="flex items-center gap-1">
              {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">{timeAgo(notification.createdAt)}</span>
            <Badge className={getPriorityColor(notification.priority)} variant="secondary">
              {notification.priority}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

// Changed from default export to named export
export { NotificationItem }
