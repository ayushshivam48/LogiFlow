"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, DollarSign, TrendingUp, Clock, Star, CheckCircle, AlertTriangle } from "lucide-react"
import { AvailableOrderCard } from "./available-order-card"
import { SubmitBidForm } from "./submit-bid-form"
import { MyBidsCard } from "./my-bids-card"
import { ReviewsSection } from "./reviews-section"
import { useAuth } from "@/contexts/auth-context"

export function OwnerDashboard() {
  const { user } = useAuth()
  const [showBidForm, setShowBidForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [availableOrders, setAvailableOrders] = useState([])
  const [myBids, setMyBids] = useState([])
  const [ordersAll, setOrdersAll] = useState([])
  const [ratings, setRatings] = useState([])
  const [ratingSummary, setRatingSummary] = useState(null)

  // Load orders for marketplace (all orders) and derive available ones
  useEffect(() => {
    let ignore = false
    async function loadOrders() {
      // Mock data for demonstration
      const mockOrdersAll = [
        {
          id: "1",
          userId: "1",
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
          offers: [],
        },
        {
          id: "2",
          userId: "1",
          title: "Product Sample Delivery",
          description: "Fragile product samples for client presentation",
          pickupAddress: "789 Warehouse Rd, Industrial Area, State 12347",
          deliveryAddress: "321 Client Plaza, Business District, State 12348",
          packageType: "fragile",
          weight: 2.5,
          dimensions: { length: 40, width: 30, height: 15 },
          urgency: "express",
          preferredDate: "2024-01-16",
          status: "published",
          createdAt: "2024-01-09T14:30:00Z",
          updatedAt: "2024-01-09T14:30:00Z",
          offers: [],
        },
        {
          id: "3",
          userId: "4",
          title: "Office Equipment Transfer",
          description: "Moving computer equipment between office locations",
          pickupAddress: "555 Tech Park, Innovation District, State 12349",
          deliveryAddress: "777 Business Center, Corporate Zone, State 12350",
          packageType: "large",
          weight: 15.0,
          dimensions: { length: 60, width: 40, height: 30 },
          urgency: "standard",
          preferredDate: "2024-01-18",
          status: "bidding",
          createdAt: "2024-01-08T09:15:00Z",
          updatedAt: "2024-01-08T09:15:00Z",
          offers: [],
        },
      ]

      try {
        const res = await fetch("/api/fetch-orders")
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
        if (!ignore) {
          const finalOrders = mapped.length > 0 ? mapped : mockOrdersAll
          setOrdersAll(finalOrders)
          setAvailableOrders(finalOrders.filter((o) => o.status === "published"))
        }
      } catch {
        if (!ignore) {
          setOrdersAll(mockOrdersAll)
          setAvailableOrders(mockOrdersAll.filter((o) => o.status === "published"))
        }
      }
    }
    loadOrders()
    return () => {
      ignore = true
    }
  }, [])

  // Load current user's bids
  useEffect(() => {
    let ignore = false
    async function loadBids() {
      if (!user?.id) {
        setMyBids([])
        return
      }

      // Mock data for demonstration
      const mockMyBids = [
        {
          id: "1",
          orderId: "1",
          ownerId: user.id,
          ownerName: user?.name || "",
          companyName: user?.companyName || "Fast Delivery Co",
          price: 25.0,
          estimatedDuration: "2 hours",
          description: "Same-day delivery with tracking",
          rating: 4.8,
          createdAt: "2024-01-10T11:00:00Z",
          status: "pending",
        },
        {
          id: "2",
          orderId: "2",
          ownerId: user.id,
          ownerName: user?.name || "",
          companyName: user?.companyName || "Fast Delivery Co",
          price: 45.0,
          estimatedDuration: "3 hours",
          description: "Careful handling for fragile items",
          rating: 4.8,
          createdAt: "2024-01-09T15:00:00Z",
          status: "accepted",
        },
        {
          id: "3",
          orderId: "3",
          ownerId: user.id,
          ownerName: user?.name || "",
          companyName: user?.companyName || "Fast Delivery Co",
          price: 85.0,
          estimatedDuration: "1 day",
          description: "Professional equipment handling",
          rating: 4.8,
          createdAt: "2024-01-08T10:00:00Z",
          status: "accepted",
        },
      ]

      try {
        const res = await fetch(`/api/fetch-bids?userId=${encodeURIComponent(user.id)}`)
        if (!res.ok) throw new Error("Failed to fetch bids")
        const data = await res.json()
        const mapped = (Array.isArray(data) ? data : []).map((b) => ({
          id: b._id,
          orderId: b.orderId,
          ownerId: b.bidderId,
          ownerName: user?.name || "",
          companyName: user?.companyName || "",
          price: b.amount,
          estimatedDuration: b.estimatedDuration,
          description: b.description || b.message,
          rating: 4.5,
          createdAt: b.createdAt,
          status: b.status,
        }))
        if (!ignore) setMyBids(mapped.length > 0 ? mapped : mockMyBids)
      } catch {
        if (!ignore) setMyBids(mockMyBids)
      }
    }
    loadBids()
    return () => {
      ignore = true
    }
  }, [user?.id])

  // Mock ratings data for demonstration
  useEffect(() => {
    if (user) {
      const mockRatings = [
        {
          id: "1",
          orderId: "1",
          userId: "1",
          ownerId: user.id,
          ownerName: user.name,
          companyName: user.companyName || "Fast Delivery Co",
          rating: 5,
          review:
            "Excellent service! Package was delivered on time and in perfect condition. The driver was very professional and kept me updated throughout the delivery process.",
          categories: {
            communication: 5,
            timeliness: 5,
            packaging: 4,
            professionalism: 5,
          },
          isRecommended: true,
          createdAt: "2024-01-12T14:30:00Z",
          updatedAt: "2024-01-12T14:30:00Z",
          isVerified: true,
        },
        {
          id: "2",
          orderId: "2",
          userId: "4",
          ownerId: user.id,
          ownerName: user.name,
          companyName: user.companyName || "Fast Delivery Co",
          rating: 4,
          review:
            "Good service overall. Delivery was prompt and the package arrived safely. Communication could be improved but otherwise satisfied.",
          categories: {
            communication: 3,
            timeliness: 5,
            packaging: 4,
            professionalism: 4,
          },
          isRecommended: true,
          createdAt: "2024-01-08T16:45:00Z",
          updatedAt: "2024-01-08T16:45:00Z",
          isVerified: true,
        },
        {
          id: "3",
          orderId: "3",
          userId: "5",
          ownerId: user.id,
          ownerName: user.name,
          companyName: user.companyName || "Fast Delivery Co",
          rating: 5,
          review:
            "Outstanding service! They handled my fragile items with extreme care and delivered everything perfectly. Highly recommend!",
          categories: {
            communication: 5,
            timeliness: 4,
            packaging: 5,
            professionalism: 5,
          },
          isRecommended: true,
          createdAt: "2024-01-05T11:20:00Z",
          updatedAt: "2024-01-05T11:20:00Z",
          isVerified: true,
        },
      ]

      const mockRatingSummary = {
        ownerId: user.id,
        companyName: user.companyName || "Fast Delivery Co",
        averageRating: 4.7,
        totalRatings: 3,
        ratingDistribution: {
          5: 2,
          4: 1,
          3: 0,
          2: 0,
          1: 0,
        },
        categoryAverages: {
          communication: 4.3,
          timeliness: 4.7,
          packaging: 4.3,
          professionalism: 4.7,
        },
        recommendationRate: 100,
      }

      setRatings(mockRatings)
      setRatingSummary(mockRatingSummary)
    }
  }, [user])

  const handleSubmitBid = (order) => {
    setSelectedOrder(order)
    setShowBidForm(true)
  }

  const handleBidSubmitted = (bid) => {
    setMyBids((prev) => {
      const existingIndex = prev.findIndex((b) => b.orderId === bid.orderId && b.ownerId === bid.ownerId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = bid
        return updated
      }
      return [bid, ...prev]
    })
    setShowBidForm(false)
    setSelectedOrder(null)
  }

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await fetch("/api/update-order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      })
      if (!res.ok) throw new Error("Failed to update order")
      setOrdersAll((prev) => {
        const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        setAvailableOrders(updated.filter((o) => o.status === "published"))
        return updated
      })
    } catch (e) {
      // no-op; keep UI unchanged
    }
  }

  const getMyBidForOrder = (orderId) => {
    return myBids.find((bid) => bid.orderId === orderId)
  }

  const stats = {
    totalBids: myBids.length,
    acceptedBids: myBids.filter((b) => b.status === "accepted").length,
    pendingBids: myBids.filter((b) => b.status === "pending").length,
    totalEarnings: myBids.filter((b) => b.status === "accepted").reduce((sum, bid) => sum + bid.price, 0),
    averageRating: ratingSummary?.averageRating || 0,
    totalRatings: ratingSummary?.totalRatings || 0,
  }

  if (showBidForm && selectedOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => {
                setShowBidForm(false)
                setSelectedOrder(null)
              }}
              className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 transition-all duration-300"
            >
              ← Back to Dashboard
            </Button>
          </div>
          <SubmitBidForm
            order={selectedOrder}
            onBidSubmitted={handleBidSubmitted}
            onCancel={() => {
              setShowBidForm(false)
              setSelectedOrder(null)
            }}
            existingBid={getMyBidForOrder(selectedOrder.id)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-teal-300/15 to-cyan-300/15 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Owner Dashboard
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-2xl">
              Manage your delivery services and track your business growth
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Ready for new orders</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
              <span className="text-sm font-medium text-gray-700">{user?.companyName || "Your Company"}</span>
            </div>
          </div>
        </div>

        {/* Enhanced stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <Card className="group border-0 shadow-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-cyan-100">Total Bids</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Package className="h-6 w-6 text-cyan-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.totalBids}</div>
              <p className="text-xs text-cyan-200 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                All submissions
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-emerald-100">Accepted Bids</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CheckCircle className="h-6 w-6 text-emerald-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.acceptedBids}</div>
              <p className="text-xs text-emerald-200 flex items-center">
                <Star className="w-3 h-3 mr-1" />
                Won contracts
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-amber-100">Pending Bids</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock className="h-6 w-6 text-amber-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.pendingBids}</div>
              <p className="text-xs text-amber-200 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Awaiting response
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-purple-500 to-violet-500 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-purple-100">Total Earnings</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <DollarSign className="h-6 w-6 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">${stats.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-purple-200 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Revenue generated
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-rose-500 to-pink-500 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-rose-100">Average Rating</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Star className="h-6 w-6 text-rose-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-rose-200 flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {stats.totalRatings} reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 p-1 rounded-t-2xl">
              <div className="bg-white rounded-t-xl">
                <div className="p-8 pb-6">
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                    Business Operations
                  </h2>
                  <p className="text-gray-600 text-lg font-medium">Manage orders, bids, and customer reviews</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="available" className="w-full">
              <div className="px-8 pt-6">
                <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-cyan-100/80 to-blue-100/80 p-0 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
                  <TabsTrigger
                    value="available"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-cyan-600 transition-all duration-300 rounded-xl font-semibold py-3 flex items-center justify-center"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Available Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="mybids"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-cyan-600 transition-all duration-300 rounded-xl font-semibold py-3 flex items-center justify-center"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    My Bids
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-cyan-600 transition-all duration-300 rounded-xl font-semibold py-3 flex items-center justify-center"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Reviews
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="available" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-cyan-50/80 to-blue-50/80 rounded-2xl border-2 border-cyan-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        Available Orders
                      </h3>
                      <p className="text-cyan-600/70 font-medium">New delivery opportunities for your business</p>
                    </div>
                  </div>

                  {availableOrders.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <Package className="w-16 h-16 text-gray-400 mb-6" />
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">No available orders</h3>
                        <p className="text-gray-500 text-center max-w-md">
                          Check back later for new delivery opportunities
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {availableOrders.map((order) => (
                        <AvailableOrderCard
                          key={order.id}
                          order={order}
                          onSubmitBid={handleSubmitBid}
                          hasExistingBid={!!getMyBidForOrder(order.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="mybids" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-emerald-50/80 to-green-50/80 rounded-2xl border-2 border-emerald-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        My Bids
                      </h3>
                      <p className="text-emerald-600/70 font-medium">Track your submitted bids and contracts</p>
                    </div>
                  </div>

                  {myBids.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <DollarSign className="w-16 h-16 text-gray-400 mb-6" />
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">No bids submitted yet</h3>
                        <p className="text-gray-500 text-center max-w-md">
                          Start bidding on available orders to grow your business
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {myBids.map((bid) => {
                        const order = ordersAll.find((o) => o.id === bid.orderId)
                        if (!order) return null
                        return <MyBidsCard key={bid.id} order={order} bid={bid} onUpdateStatus={handleUpdateStatus} />
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl border-2 border-amber-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Customer Reviews
                      </h3>
                      <p className="text-amber-600/70 font-medium">Feedback from your customers</p>
                    </div>
                  </div>

                  <ReviewsSection reviews={ratings} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  )
}
