"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, MapPin, Clock, Scale, User, Building } from "lucide-react"

const OrderManagementCard = ({ order, onStatusChange, onApprove, onReject }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "published":
        return "bg-blue-100 text-blue-800"
      case "bidding":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-emerald-100 text-emerald-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "express":
        return "bg-orange-100 text-orange-800"
      case "standard":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const needsApproval = order.status === "published"
  const canChangeStatus = ["bidding", "assigned", "in_transit"].includes(order.status)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.title}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <User className="w-4 h-4" />
              Order ID: {order.id} • Created {new Date(order.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
            <Badge className={getUrgencyColor(order.urgency)}>{order.urgency}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{order.description}</p>

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

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span>{order.packageType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Scale className="w-4 h-4 text-muted-foreground" />
            <span>{order.weight}kg</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Due: {new Date(order.preferredDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Building className="w-4 h-4 text-muted-foreground" />
            <span>{order.offers?.length || 0} bids received</span>
          </div>
        </div>

        {order.offers && order.offers.length > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Bid Summary</h4>
            <div className="text-sm text-muted-foreground grid grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Lowest:</p>
                <p>${Math.min(...order.offers.map((o) => o.price))}</p>
              </div>
              <div>
                <p className="font-medium">Highest:</p>
                <p>${Math.max(...order.offers.map((o) => o.price))}</p>
              </div>
              <div>
                <p className="font-medium">Average:</p>
                <p>${(order.offers.reduce((sum, o) => sum + o.price, 0) / order.offers.length).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {needsApproval && (
            <>
              <Button size="sm" onClick={() => onApprove(order.id)} className="bg-green-600 hover:bg-green-700">
                Approve Order
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onReject(order.id)}>
                Reject Order
              </Button>
            </>
          )}

          {canChangeStatus && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Update Status:</span>
              <Select onValueChange={(value) => onStatusChange(order.id, value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bidding">Open for Bidding</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { OrderManagementCard }
