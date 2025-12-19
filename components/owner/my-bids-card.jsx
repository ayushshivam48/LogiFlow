"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, MapPin, Clock, DollarSign, Star } from "lucide-react"

export function MyBidsCard({ order, bid, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isAccepted = bid.status === "accepted"
  const canUpdateStatus = isAccepted && ["assigned", "in_transit"].includes(order.status)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.title}</CardTitle>
            <CardDescription className="mt-1">
              Bid submitted {new Date(bid.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex flex-2">
            <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
            {isAccepted && (
              <Badge className={getOrderStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-green-600" />
            <div>
              <p className="font-medium text-green-700">Pickup:</p>
              <p className="text-muted-foreground">{order.pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-red-600" />
            <div>
              <p className="font-medium text-red-700">Delivery:</p>
              <p className="text-muted-foreground">{order.deliveryAddress}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Your Bid Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium">Price:</p>
              <p className="text-lg font-bold text-green-600">${bid.price}</p>
            </div>
            <div>
              <p className="font-medium">Duration:</p>
              <p>{bid.estimatedDuration}</p>
            </div>
            <div>
              <p className="font-medium">Your Rating:</p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{bid.rating}</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="font-medium">Service Service:</p>
            <p className="text-muted-foreground">{bid.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span>
              {order.packageType} • {order.weight}kg
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Due: {new Date(order.preferredDate).toLocaleDateString()}</span>
          </div>
        </div>

        {canUpdateStatus && onUpdateStatus && (
          <div className="flex gap-2 pt-2 border-t">
            {order.status === "assigned" && (
              <Button size="sm" onClick={() => onUpdateStatus(order.id, "in_transit")} className="flex-1">
                Mark as In Transit
              </Button>
            )}
            {order.status === "in_transit" && (
              <Button size="sm" onClick={() => onUpdateStatus(order.id, "delivered")} className="flex-1">
                Mark as Delivered
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
