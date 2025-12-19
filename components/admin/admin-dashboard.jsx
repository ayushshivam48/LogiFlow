"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Building2,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react"
import { OrderManagementCard } from "./order-management-card"
import { UserManagementCard } from "./user-management-card"
import { OwnerManagementCard } from "./owner-management-card"
import { UserDetailModal } from "./user-detail-modal"
import { OwnerDetailModal } from "./owner-detail-modal"

// Changed from default export to named export
export function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [owners, setOwners] = useState([]) // Added owners state
  const [selectedUserId, setSelectedUserId] = useState(null) // Added user detail modal state
  const [selectedOwnerId, setSelectedOwnerId] = useState(null) // Added owner detail modal state
  const [showUserModal, setShowUserModal] = useState(false)
  const [showOwnerModal, setShowOwnerModal] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders = [
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
        status: "bidding",
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

    const mockUsers = [
      {
        id: "1",
        name: "John Doe",
        email: "user@demo.com",
        role: "user",
        companyName: "ABC Corp",
        joinDate: "2024-01-01T00:00:00Z",
        status: "active",
        ordersCount: 5,
      },
      {
        id: "4",
        name: "Sarah Wilson",
        email: "sarah@techcorp.com",
        role: "user",
        companyName: "Tech Corp",
        joinDate: "2024-01-08T00:00:00Z",
        status: "active",
        ordersCount: 2,
      },
      {
        id: "5",
        name: "Bob Brown",
        email: "bob@suspended.com",
        role: "user",
        companyName: "Suspended Co",
        joinDate: "2023-11-20T00:00:00Z",
        status: "suspended",
        ordersCount: 1,
      },
    ]

    const mockOwners = [
      {
        id: "2",
        name: "Jane Smith",
        email: "owner@demo.com",
        role: "owner",
        companyName: "Fast Delivery Co",
        joinDate: "2023-12-15T00:00:00Z",
        status: "active",
        completedDeliveries: 12,
        rating: 4.8,
        totalRevenue: 2450.75,
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@quickexpress.com",
        role: "owner",
        companyName: "Quick Express",
        joinDate: "2024-01-05T00:00:00Z",
        status: "pending",
        completedDeliveries: 0,
        rating: 4.6,
        totalRevenue: 0,
      },
      {
        id: "6",
        name: "Lisa Garcia",
        email: "lisa@reliablelogistics.com",
        role: "owner",
        companyName: "Reliable Logistics",
        joinDate: "2023-11-10T00:00:00Z",
        status: "active",
        completedDeliveries: 45,
        rating: 4.9,
        totalRevenue: 8750.25,
      },
    ]

    setOrders(mockOrders)
    setUsers(mockUsers)
    setOwners(mockOwners) // Set owners data
  }, [])

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const handleOrderApprove = (orderId) => {
    handleOrderStatusChange(orderId, "bidding")
  }

  const handleOrderReject = (orderId) => {
    handleOrderStatusChange(orderId, "cancelled")
  }

  const handleUserStatusChange = (userId, newStatus) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  const handleOwnerStatusChange = (ownerId, newStatus) => {
    setOwners((prev) => prev.map((owner) => (owner.id === ownerId ? { ...owner, status: newStatus } : owner)))
  }

  const handleViewUserDetails = (userId) => {
    setSelectedUserId(userId)
    setShowUserModal(true)
  }

  const handleViewOwnerDetails = (ownerId) => {
    setSelectedOwnerId(ownerId)
    setShowOwnerModal(true)
  }

  const stats = {
    totalOrders: orders.length,
    pendingApproval: orders.filter((o) => o.status === "published").length,
    activeOrders: orders.filter((o) => ["bidding", "assigned", "in_transit"].includes(o.status)).length,
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    pendingUsers: users.filter((u) => u.status === "pending").length,
    totalOwners: owners.length,
    activeOwners: owners.filter((o) => o.status === "active").length,
    pendingOwners: owners.filter((o) => o.status === "pending").length,
    totalRevenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, order) => {
        const acceptedOffer = order.offers?.find((offer) => offer.status === "accepted")
        return sum + (acceptedOffer?.price || 0)
      }, 0),
    platformFee: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, order) => {
        const acceptedOffer = order.offers?.find((offer) => offer.status === "accepted")
        return sum + (acceptedOffer?.price || 0) * 0.1 // 10% platform fee
      }, 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-violet-300/15 to-indigo-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-medium max-w-2xl">
              Manage orders, users, and monitor platform performance
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System operational</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20">
              <span className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-blue-100">Total Orders</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Package className="h-6 w-6 text-blue-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.totalOrders}</div>
              <p className="text-xs text-blue-200 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stats.activeOrders} active orders
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-amber-100">Pending Approval</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="h-6 w-6 text-amber-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.pendingApproval}</div>
              <p className="text-xs text-amber-200 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Require admin action
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-emerald-100">Platform Users</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 text-emerald-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.totalUsers}</div>
              <p className="text-xs text-emerald-200 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                {stats.activeUsers} active, {stats.pendingUsers} pending
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-purple-100">Delivery Companies</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Building2 className="h-6 w-6 text-purple-200" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold mb-1">{stats.totalOwners}</div>
              <p className="text-xs text-purple-200 flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {stats.activeOwners} active, {stats.pendingOwners} pending
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-1 rounded-t-2xl">
              <div className="bg-white rounded-t-xl">
                <div className="p-8 pb-6">
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                    Platform Management
                  </h2>
                  <p className="text-gray-600 text-lg font-medium">Monitor and control all platform operations</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="orders" className="w-full">
              <div className="px-8 pt-6">
                <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-indigo-100/80 to-purple-100/80 p-0 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg">
                  <TabsTrigger
                    value="orders"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 transition-all duration-300 rounded-xl font-semibold py-3 flex items-center justify-center"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger
                    value="users"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 transition-all duration-300 rounded-xl font-semibold py-3 flex items-center justify-center"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger
                    value="owners"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 transition-all duration-300 rounded-xl font-semibold py-3 flex items-center justify-center"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Companies
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 transition-all duration-300 rounded-xl font-semibold py-3 flex items-center justify-center"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="orders" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-2xl border-2 border-indigo-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Order Management
                        </h3>
                        <p className="text-indigo-600/70 font-medium">Monitor and approve platform orders</p>
                      </div>
                    </div>
                    {stats.pendingApproval > 0 && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full border border-amber-200 shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-700">
                          {stats.pendingApproval} orders need approval
                        </span>
                      </div>
                    )}
                  </div>

                  {orders.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <Package className="w-16 h-16 text-gray-400 mb-6" />
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">No orders found</h3>
                        <p className="text-gray-500 text-center max-w-md">
                          Orders will appear here as users create them
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {orders.map((order) => (
                        <OrderManagementCard
                          key={order.id}
                          order={order}
                          onStatusChange={handleOrderStatusChange}
                          onApprove={handleOrderApprove}
                          onReject={handleOrderReject}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-emerald-50/80 to-green-50/80 rounded-2xl border-2 border-emerald-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                          User Management
                        </h3>
                        <p className="text-emerald-600/70 font-medium">Manage platform users and permissions</p>
                      </div>
                    </div>
                    {stats.pendingUsers > 0 && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full border border-amber-200 shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-700">
                          {stats.pendingUsers} users need approval
                        </span>
                      </div>
                    )}
                  </div>

                  {users.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <Users className="w-16 h-16 text-gray-400 mb-6" />
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">No users found</h3>
                        <p className="text-gray-500 text-center max-w-md">Users will appear here as they register</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {users.map((user) => (
                        <UserManagementCard
                          key={user.id}
                          user={user}
                          onStatusChange={handleUserStatusChange}
                          onViewDetails={handleViewUserDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="owners" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-cyan-50/80 to-blue-50/80 rounded-2xl border-2 border-cyan-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          Company Management
                        </h3>
                        <p className="text-cyan-600/70 font-medium">Manage delivery companies and approvals</p>
                      </div>
                    </div>
                    {stats.pendingOwners > 0 && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full border border-amber-200 shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-700">
                          {stats.pendingOwners} companies need approval
                        </span>
                      </div>
                    )}
                  </div>

                  {owners.length === 0 ? (
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="flex flex-col items-center justify-center py-16">
                        <Building2 className="w-16 h-16 text-gray-400 mb-6" />
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">No delivery companies found</h3>
                        <p className="text-gray-500 text-center max-w-md">
                          Companies will appear here as they register
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {owners.map((owner) => (
                        <OwnerManagementCard
                          key={owner.id}
                          owner={owner}
                          onStatusChange={handleOwnerStatusChange}
                          onViewDetails={handleViewOwnerDetails}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="mx-8 mb-8 mt-6 p-8 bg-gradient-to-br from-purple-50/80 to-violet-50/80 rounded-2xl border-2 border-purple-200/50 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                        Platform Analytics
                      </h3>
                      <p className="text-purple-600/70 font-medium">Performance metrics and insights</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Enhanced analytics cards with better styling */}
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-semibold text-green-700">Order Success Rate</CardTitle>
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {orders.length > 0
                            ? Math.round((orders.filter((o) => o.status === "delivered").length / orders.length) * 100)
                            : 0}
                          %
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          {orders.filter((o) => o.status === "delivered").length} of {orders.length} completed
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-semibold text-blue-700">Average Order Value</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          $
                          {orders.length > 0
                            ? (
                                orders.reduce((sum, order) => {
                                  const acceptedOffer = order.offers?.find((offer) => offer.status === "accepted")
                                  return sum + (acceptedOffer?.price || 0)
                                }, 0) / orders.length
                              ).toFixed(2)
                            : "0.00"}
                        </div>
                        <p className="text-sm text-blue-600 font-medium">Across all orders</p>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      <CardHeader>
                        <CardTitle className="text-purple-700 font-semibold">Recent Activity Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 text-sm">
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-50">
                            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">
                              {orders.filter((o) => o.status === "published").length} orders awaiting approval
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">
                              {orders.filter((o) => o.status === "bidding").length} orders receiving bids
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">
                              {orders.filter((o) => o.status === "in_transit").length} orders in transit
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50">
                            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">
                              {users.filter((u) => u.status === "pending").length} users awaiting approval
                            </span>
                          </div>
                          <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50">
                            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 font-medium">
                              {users.filter((u) => u.status === "active").length} active platform users
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        {/* Detail Modals */}
        <UserDetailModal
          userId={selectedUserId}
          isOpen={showUserModal}
          onClose={() => {
            setShowUserModal(false)
            setSelectedUserId(null)
          }}
        />

        <OwnerDetailModal
          ownerId={selectedOwnerId}
          isOpen={showOwnerModal}
          onClose={() => {
            setShowOwnerModal(false)
            setSelectedOwnerId(null)
          }}
        />
      </div>
    </div>
  )
}
