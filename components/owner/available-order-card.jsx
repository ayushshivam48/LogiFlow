"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, MapPin, Clock, Scale, DollarSign } from "lucide-react"

const AvailableOrderCard = ({ order, onSubmitBid, hasExistingBid }) => {
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

  const getPackageTypeColor = (packageType) => {
    switch (packageType) {
      case "fragile":
        return "bg-red-100 text-red-800"
      case "large":
        return "bg-blue-100 text-blue-800"
      case "document":
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
            <CardDescription className="mt-1">
              Posted {new Date(order.createdAt).toLocaleDateString()} • {order.offers?.length || 0} bids
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getUrgencyColor(order.urgency)}>{order.urgency}</Badge>
            <Badge className={getPackageTypeColor(order.packageType)}>{order.packageType}</Badge>
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
            <span>By {new Date(order.preferredDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span>
              {order.dimensions.length}×{order.dimensions.width}×{order.dimensions.height}cm
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            {order.offers?.length ? (
              <span>
                Current bids: ${Math.min(...order.offers.map((o) => o.price))} - $
                {Math.max(...order.offers.map((o) => o.price))}
              </span>
            ) : (
              <span>No bids yet - be the first!</span>
            )}
          </div>
          <Button
            onClick={() => onSubmitBid(order)}
            variant={hasExistingBid ? "outline" : "default"}
            size="sm"
            className="flex items-center gap-1"
          >
            <DollarSign className="w-4 h-4" />
            {hasExistingBid ? "Update Bid" : "Submit Bid"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Changed from default export to named export
export { AvailableOrderCard }
