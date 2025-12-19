"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, CheckCircle, XCircle, Activity } from "lucide-react"
import { CreateOrderForm } from "./create-order-form"
import { OrderCard } from "./order-card"
import { BidManagementModal } from "./bid-management-modal"
import { ReviewModal } from "./review-modal"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"

export function UserDashboard() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showBidModal, setShowBidModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [orderToReview, setOrderToReview] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      if (!user?.id) {
        setOrders([])
        return
      }

      // Mock data for demonstration
      const mockOrders = [
        {
          id: "1",
          userId: user.id,
          title: "Important Documents to Client",
          description: "Urgent delivery of signed contracts to downtown office",
          pickupAddress: "123 Business St, City Center, State 12345",
          deliveryAddress: "456 Corporate Ave, Downtown, State 12346",
          packageType: "document",
          weight: 0.5,
          dimensions: { length: 30, width: 20, height: 2 },
          urgency: "urgent",
          preferredDate: "2024-01-15",
          status: "published",
          createdAt: "2024-01-10T10:00:00Z",
          updatedAt: "2024-01-10T10:00:00Z",
          offers: [
            {
              id: "1",
              orderId: "1",
              ownerId: "2",
              ownerName: "Jane Smith",
              companyName: "Fast Delivery Co",
              price: 25.0,
              estimatedDuration: "2 hours",
              description: "Same-day delivery with tracking",
              rating: 4.8,
              createdAt: "2024-01-10T11:00:00Z",
              status: "pending",
            },
            {
              id: "2",
              orderId: "1",
              ownerId: "3",
              ownerName: "Mike Johnson",
              companyName: "Quick Express",
              price: 30.0,
              estimatedDuration: "1.5 hours",
              description: "Premium express service",
              rating: 4.6,
              createdAt: "2024-01-10T12:00:00Z",
              status: "pending",
            },
          ],
        },
        {
          id: "2",
          userId: user.id,
          title: "Product Sample Delivery",
          description: "Fragile product samples for client presentation",
          pickupAddress: "789 Warehouse Rd, Industrial Area, State 12347",
          deliveryAddress: "321 Client Plaza, Business District, State 12348",
          packageType: "fragile",
          weight: 2.5,
          dimensions: { length: 40, width: 30, height: 15 },
          urgency: "express",
          preferredDate: "2024-01-16",
          status: "bidding",
          createdAt: "2024-01-09T14:30:00Z",
          updatedAt: "2024-01-09T14:30:00Z",
          offers: [],
        },
        {
          id: "3",
          userId: user.id,
          title: "Office Equipment Transfer",
          description: "Moving computer equipment between office locations",
          pickupAddress: "555 Tech Park, Innovation District, State 12349",
          deliveryAddress: "777 Business Center, Corporate Zone, State 12350",
          packageType: "large",
          weight: 15.0,
          dimensions: { length: 60, width: 40, height: 30 },
          urgency: "standard",
          preferredDate: "2024-01-18",
          status: "in_transit",
          createdAt: "2024-01-08T09:15:00Z",
          updatedAt: "2024-01-08T09:15:00Z",
          offers: [
            {
              id: "3",
              orderId: "3",
              ownerId: "2",
              ownerName: "Jane Smith",
              companyName: "Fast Delivery Co",
              price: 85.0,
              estimatedDuration: "1 day",
              description: "Professional equipment handling",
              rating: 4.8,
              createdAt: "2024-01-08T10:00:00Z",
              status: "accepted",
            },
          ],
        },
      ]

      try {
        const res = await fetch(`/api/fetch-orders?ownerId=${encodeURIComponent(user.id)}`)
        if (!res.ok) throw new Error("Failed to fetch orders")
        const data = await res.json()
        const mapped = (Array.isArray(data) ? data : []).map((o) => ({
          id: o._id,
          userId: o.ownerId,
          title: o.title || o.description?.slice(0, 32) || "Order",
          description: o.description,
          pickupAddress: o.pickupAddress || o.loadFrom || "",
          deliveryAddress: o.deliveryAddress || o.loadTo || "",
          packageType: o.packageType || "document",
          weight: typeof o.weight === "number" ? o.weight : (o.bidAmount || 0),
          dimensions: o.dimensions || { length: 0, width: 0, height: 0 },
          urgency: o.urgency || "standard",
          preferredDate: o.preferredDate || o.orderDate || new Date().toISOString(),
          status: o.status || "published",
          createdAt: o.createdAt || new Date().toISOString(),
          updatedAt: o.updatedAt || new Date().toISOString(),
          offers: [],
        }))
        if (!ignore) setOrders(mapped.length > 0 ? mapped : mockOrders)
      } catch {
        if (!ignore) setOrders(mockOrders)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [user?.id])

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev])
    setShowCreateForm(false)

    addNotification({
      type: "order_created",
      title: "Order Created Successfully",
      message: `Your order "${newOrder.title}" has been published and is now accepting bids`,
      orderId: newOrder.id,
      priority: "medium",
    })
  }

  const handleViewOffers = (order) => {
    setSelectedOrder(order)
    setShowBidModal(true)
  }

  const handleAcceptBid = (orderId, bidId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const acceptedOffer = order.offers.find((offer) => offer.id === bidId)
          return {
            ...order,
            status: "assigned",
            acceptedOffer: acceptedOffer
              ? {
                  id: acceptedOffer.id,
                  companyName: acceptedOffer.companyName,
                  ownerName: acceptedOffer.ownerName,
                  price: acceptedOffer.price,
                  companyId: acceptedOffer.ownerId,
                }
              : null,
            offers: order.offers.map((offer) => ({
              ...offer,
              status: offer.id === bidId ? "accepted" : "rejected",
            })),
          }
        }
        return order
      }),
    )
  }

  const handleCancelAcceptedBid = (orderId, bidId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: "bidding",
            acceptedOffer: null,
            offers: order.offers.map((offer) => ({
              ...offer,
              status: "pending",
            })),
          }
        }
        return order
      }),
    )
  }

  const handleReviewOrder = (order) => {
    setOrderToReview(order)
    setShowReviewModal(true)
  }

  const handleSubmitReview = (reviewData) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === reviewData.orderId) {
          return {
            ...order,
            reviewSubmitted: true,
            review: reviewData,
          }
        }
        return order
      }),
    )

    // Add notification for review submission
    addNotification({
      type: "review_submitted",
      title: "Review Submitted",
      message: `Thank you for reviewing ${reviewData.companyName}!`,
      priority: "low",
    })
  }

  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter((o) => ["published", "bidding", "assigned", "in_transit"].includes(o.status)).length,
    completedOrders: orders.filter((o) => o.status === "delivered").length,
    cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
  }

  if (showCreateForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CreateOrderForm onOrderCreated={handleOrderCreated} onCancel={() => setShowCreateForm(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-300/10 to-blue-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              Welcome Back, {user?.name}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-2xl">
              Manage your deliveries and track shipments with ease
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Dashboard ready</span>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl"
            size="lg"
          >
            <Plus className="w-6 h-6" />
            Create New Order
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Package className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats.totalOrders}</div>
              <p className="text-sm text-blue-200 font-medium">All time orders</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-emerald-100">Active Orders</CardTitle>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats.activeOrders}</div>
              <p className="text-sm text-emerald-200 font-medium">In progress</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-purple-100">Completed</CardTitle>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats.completedOrders}</div>
              <p className="text-sm text-purple-200 font-medium">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-medium text-red-100">Cancelled</CardTitle>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <XCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-2">{stats.cancelledOrders}</div>
              <p className="text-sm text-red-200 font-medium">Cancelled orders</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-1 rounded-t-2xl">
              <div className="bg-white rounded-t-xl">
                <div className="p-8 pb-6">
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    Order Management
                  </h2>
                  <p className="text-gray-600 text-lg font-medium">Track and manage all your delivery orders</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <div className="px-8 pt-6">
                <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-100 to-gray-200 p-0 rounded-2xl shadow-inner border border-gray-200">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 flex items-center justify-center"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    All Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 flex items-center justify-center"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Active ({stats.activeOrders})
                  </TabsTrigger>
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed ({stats.completedOrders})
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancelled"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 flex items-center justify-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelled ({stats.cancelledOrders})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl border-2 border-blue-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        All Orders
                      </h3>
                      <p className="text-blue-600/70 font-medium">Complete overview of your delivery orders</p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-8 shadow-xl">
                          <Package className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">No orders yet</h3>
                        <p className="text-gray-500 text-center mb-8 max-w-md text-lg leading-relaxed">
                          Create your first delivery order to get started with our logistics platform
                        </p>
                        <Button
                          onClick={() => setShowCreateForm(true)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg font-semibold rounded-xl"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Create Your First Order
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-8">
                      {orders.map((order, index) => (
                        <div
                          key={order.id}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "slideInUp 0.6s ease-out forwards",
                          }}
                        >
                          <OrderCard order={order} onViewOffers={handleViewOffers} onReviewOrder={handleReviewOrder} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-emerald-50/80 to-green-50/80 rounded-2xl border-2 border-emerald-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        Active Orders ({stats.activeOrders})
                      </h3>
                      <p className="text-emerald-600/70 font-medium">Orders currently in progress</p>
                    </div>
                  </div>

                  <div className="grid gap-8">
                    {orders
                      .filter((order) => ["published", "bidding", "assigned", "in_transit"].includes(order.status))
                      .map((order, index) => (
                        <div
                          key={order.id}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "slideInUp 0.6s ease-out forwards",
                          }}
                        >
                          <OrderCard order={order} onViewOffers={handleViewOffers} onReviewOrder={handleReviewOrder} />
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-purple-50/80 to-violet-50/80 rounded-2xl border-2 border-purple-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                        Completed Orders ({stats.completedOrders})
                      </h3>
                      <p className="text-purple-600/70 font-medium">Successfully delivered orders</p>
                    </div>
                  </div>

                  <div className="grid gap-8">
                    {orders
                      .filter((order) => order.status === "delivered")
                      .map((order, index) => (
                        <div
                          key={order.id}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "slideInUp 0.6s ease-out forwards",
                          }}
                        >
                          <OrderCard order={order} onViewOffers={handleViewOffers} onReviewOrder={handleReviewOrder} />
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cancelled" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-red-50/80 to-pink-50/80 rounded-2xl border-2 border-red-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl shadow-lg">
                      <XCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                        Cancelled Orders ({stats.cancelledOrders})
                      </h3>
                      <p className="text-red-600/70 font-medium">Orders that were cancelled</p>
                    </div>
                  </div>

                  <div className="grid gap-8">
                    {orders
                      .filter((order) => order.status === "cancelled")
                      .map((order, index) => (
                        <div
                          key={order.id}
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "slideInUp 0.6s ease-out forwards",
                          }}
                        >
                          <OrderCard order={order} onViewOffers={handleViewOffers} onReviewOrder={handleReviewOrder} />
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>

      <BidManagementModal
        order={selectedOrder}
        isOpen={showBidModal}
        onClose={() => {
          setShowBidModal(false)
          setSelectedOrder(null)
        }}
        onAcceptBid={handleAcceptBid}
        onCancelAcceptedBid={handleCancelAcceptedBid}
      />

      <ReviewModal
        order={orderToReview}
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false)
          setOrderToReview(null)
        }}
        onSubmitReview={handleSubmitReview}
      />

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
    </div>
  )
}
