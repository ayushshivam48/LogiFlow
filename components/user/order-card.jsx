"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, MapPin, Clock, Scale, Eye } from "lucide-react"

export function OrderCard({ order, onViewOffers }) {
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
        return "bg-gray-100 text-gray-800"
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.title}</CardTitle>
            <CardDescription className="mt-1">Created {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
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
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Pickup:</p>
              <p className="text-muted-foreground">{order.pickupAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium">Delivery:</p>
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
            <span>{new Date(order.preferredDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-muted-foreground">{order.offers?.length || 0} offers received</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
              <Eye className="w-4 h-4" />
              Track Order
            </Button>
            <Button variant="outline" size="sm" onClick={() => onViewOffers(order)} disabled={!order.offers?.length}>
              View Offers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
