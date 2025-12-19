"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Star, Clock, DollarSign, CheckCircle, X, Sparkles } from "lucide-react"
import { useNotifications } from "@/contexts/notification-context"

export function BidManagementModal({ order, isOpen, onClose, onAcceptBid, onCancelAcceptedBid }) {
  const [acceptedBidId, setAcceptedBidId] = useState(
    order?.offers?.find((offer) => offer.status === "accepted")?.id || null,
  )
  const [isAccepting, setIsAccepting] = useState(null)
  const { addNotification } = useNotifications()

  const handleAcceptBid = async (bidId) => {
    setIsAccepting(bidId)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    setAcceptedBidId(bidId)
    setIsAccepting(null)

    // Add notification for the delivery company
    const acceptedOffer = order.offers.find((offer) => offer.id === bidId)
    addNotification({
      type: "bid_accepted",
      title: "🎉 Bid Accepted!",
      message: `Your bid of $${acceptedOffer.price} for "${order.title}" has been accepted!`,
      orderId: order.id,
      priority: "high",
      actionUrl: "/my-bids",
    })

    onAcceptBid(order.id, bidId)
  }

  const handleCancelBid = async () => {
    setIsAccepting("canceling")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    setAcceptedBidId(null)
    setIsAccepting(null)
    onCancelAcceptedBid(order.id, acceptedBidId)
  }

  if (!isOpen || !order) return null

  const sortedOffers = [...(order.offers || [])].sort((a, b) => {
    if (a.status === "accepted") return -1
    if (b.status === "accepted") return 1
    return a.price - b.price
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Bids for "{order.title}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Pickup Location:</p>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded-md">{order.pickupAddress}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Delivery Location:</p>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded-md">{order.deliveryAddress}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Package Type:</p>
                  <Badge variant="outline" className="capitalize bg-blue-50 text-blue-700 border-blue-200">
                    {order.packageType}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Urgency Level:</p>
                  <Badge
                    variant={order.urgency === "urgent" ? "destructive" : "secondary"}
                    className={order.urgency === "urgent" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}
                  >
                    {order.urgency}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bids List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Received Bids ({sortedOffers.length})
            </h3>

            {sortedOffers.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
                    <DollarSign className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No bids yet</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    Delivery companies will submit their competitive bids soon. You'll be notified when new bids arrive.
                  </p>
                </CardContent>
              </Card>
            ) : (
              sortedOffers.map((offer, index) => (
                <Card
                  key={offer.id}
                  className={`border-0 shadow-lg transition-all duration-500 hover:shadow-xl transform hover:-translate-y-1 ${
                    offer.status === "accepted" || acceptedBidId === offer.id
                      ? "ring-2 ring-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-green-200/50"
                      : "bg-white/80 backdrop-blur-sm hover:bg-white"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "slideInUp 0.6s ease-out forwards",
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{offer.companyName}</h4>
                          <p className="text-sm text-gray-600 font-medium">{offer.ownerName}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(offer.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700 ml-1">{offer.rating}/5</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${offer.price}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4" />
                          {offer.estimatedDuration}
                        </div>
                        {(offer.status === "accepted" || acceptedBidId === offer.id) && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white mt-3 shadow-lg">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accepted
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">{offer.description}</p>
                    </div>

                    <div className="mt-6 flex gap-3">
                      {offer.status === "accepted" || acceptedBidId === offer.id ? (
                        <Button
                          variant="destructive"
                          size="lg"
                          onClick={handleCancelBid}
                          disabled={isAccepting === "canceling"}
                          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg transition-all duration-300"
                        >
                          {isAccepting === "canceling" ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          {isAccepting === "canceling" ? "Canceling..." : "Cancel Selection"}
                        </Button>
                      ) : (
                        <Button
                          size="lg"
                          onClick={() => handleAcceptBid(offer.id)}
                          disabled={acceptedBidId !== null || isAccepting !== null}
                          className={`flex items-center gap-2 transition-all duration-300 shadow-lg ${
                            acceptedBidId !== null || isAccepting !== null
                              ? "opacity-50 cursor-not-allowed bg-gray-400"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
                          }`}
                        >
                          {isAccepting === offer.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Accepting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Accept Bid
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
