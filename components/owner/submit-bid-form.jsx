"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { MapPin, Package, Clock, Scale } from "lucide-react"

const SubmitBidForm = ({ order, onBidSubmitted, onCancel, existingBid }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    price: existingBid?.price.toString() || "",
    estimatedDuration: existingBid?.estimatedDuration || "",
    description: existingBid?.description || "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      orderId: order.id,
      bidderId: user?.id || "",
      amount: Number.parseFloat(formData.price),
      message: formData.description,
      estimatedDuration: formData.estimatedDuration,
      description: formData.description,
    }

    try {
      const res = await fetch("/api/submit-bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const fallback = {
          id: existingBid?.id || Date.now().toString(),
          orderId: order.id,
          ownerId: user?.id || "",
          ownerName: user?.name || "",
          companyName: user?.companyName || "Unknown Company",
          price: Number.parseFloat(formData.price),
          estimatedDuration: formData.estimatedDuration,
          description: formData.description,
          rating: 4.5,
          createdAt: new Date().toISOString(),
          status: "pending",
        }
        onBidSubmitted(fallback)
        return
      }
      const data = await res.json()
      const b = data.bid
      const mapped = {
        id: b._id,
        orderId: b.orderId,
        ownerId: b.bidderId,
        ownerName: user?.name || "",
        companyName: user?.companyName || "Unknown Company",
        price: b.amount,
        estimatedDuration: b.estimatedDuration,
        description: b.description || b.message,
        rating: 4.5,
        createdAt: b.createdAt,
        status: b.status,
      }
      onBidSubmitted(mapped)
    } catch (err) {
      const fallback = {
        id: existingBid?.id || Date.now().toString(),
        orderId: order.id,
        ownerId: user?.id || "",
        ownerName: user?.name || "",
        companyName: user?.companyName || "Unknown Company",
        price: Number.parseFloat(formData.price),
        estimatedDuration: formData.estimatedDuration,
        description: formData.description,
        rating: 4.5,
        createdAt: new Date().toISOString(),
        status: "pending",
      }
      onBidSubmitted(fallback)
    }
  }

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
          <CardDescription>{order.title}</CardDescription>
        </CardHeader>
        <CardContent>
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

          <div className="flex flex-wrap gap-4 text-sm mt-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Bid Form */}
      <Card>
        <CardHeader>
          <CardTitle>{existingBid ? "Update Your Bid" : "Submit Your Bid"}</CardTitle>
          <CardDescription>Provide your pricing and service details for this delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Your Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => updateFormData("price", e.target.value)}
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Be competitive but fair. Consider distance, urgency, and package type.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={(e) => updateFormData("estimatedDuration", e.target.value)}
                  placeholder="e.g., 2 hours, Same day, 1-2 days"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How long will the delivery take from pickup to delivery?
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Service Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Describe your service, any special handling, tracking options, insurance, etc."
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Highlight what makes your service special and why the customer should choose you.
              </p>
            </div>

            {/* Competitive Analysis */}
            {order.offers && order.offers.length > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Current Competition</h4>
                <div className="text-sm text-muted-foreground">
                  <p>Lowest bid: ${Math.min(...order.offers.map((o) => o.price))}</p>
                  <p>Highest bid: ${Math.max(...order.offers.map((o) => o.price))}</p>
                  <p>
                    Average bid: ${(order.offers.reduce((sum, o) => sum + o.price, 0) / order.offers.length).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {existingBid ? "Update Bid" : "Submit Bid"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Changed from default export to named export
export { SubmitBidForm }
