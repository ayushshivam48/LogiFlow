"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { StatusTimeline } from "./status-timeline"
import { Package, MapPin, Clock, Scale, User, Building } from "lucide-react"

const OrderTrackingModal = ({ order, isOpen, onClose }) => {
  if (!order) return null

  const getStatusColor = (status) => {
    switch (status) {
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

  const assignedOffer = order.offers?.find((offer) => offer.status === "accepted")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Track Order: {order.title}
          </DialogTitle>
          <DialogDescription>
            Order ID: {order.id} • Created {new Date(order.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status and Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Current Status</h4>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(order.status)}>{order.status.replace("_", " ")}</Badge>
                  <Badge className={getUrgencyColor(order.urgency)}>{order.urgency}</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Package Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>
                      {order.packageType} • {order.weight}kg
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>
                      {order.dimensions.length}×{order.dimensions.width}×{order.dimensions.height}cm
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Due: {new Date(order.preferredDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Addresses</h4>
                <div className="space-y-2 text-sm">
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
              </div>

              {assignedOffer && (
                <div>
                  <h4 className="font-medium mb-2">Assigned Delivery Company</h4>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{assignedOffer.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{assignedOffer.ownerName}</span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>
                        <strong>Price:</strong> ${assignedOffer.price}
                      </p>
                      <p>
                        <strong>Estimated Duration:</strong> {assignedOffer.estimatedDuration}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          <StatusTimeline order={order} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrderTrackingModal
