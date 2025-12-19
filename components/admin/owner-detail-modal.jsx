"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Package, Mail, Phone, MapPin, Star, TrendingUp, Truck, Users } from "lucide-react"

export function OwnerDetailModal({ ownerId, isOpen, onClose }) {
  const [ownerDetails, setOwnerDetails] = useState(null)
  const [ownerStats, setOwnerStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && ownerId) {
      // Mock API call to fetch owner details
      setTimeout(() => {
        const mockOwnerDetails = {
          id: ownerId,
          name: "Jane Smith",
          email: "owner@demo.com",
          phone: "+1 (555) 987-6543",
          role: "owner",
          companyName: "Fast Delivery Co",
          businessAddress: "456 Logistics Ave, Industrial Zone, State 12345",
          licenseNumber: "DL-2024-001",
          joinDate: "2023-12-15T00:00:00Z",
          status: "active",
          rating: 4.8,
          totalRevenue: 12450.75,
          completedDeliveries: 89,
          activeDeliveries: 5,
          fleetSize: 12,
          lastActivity: "2024-01-15T08:45:00Z",
        }

        const mockStats = {
          monthlyRevenue: [
            { month: "Dec", revenue: 3200 },
            { month: "Jan", revenue: 4150 },
          ],
          deliveryTypes: {
            document: 45,
            fragile: 23,
            large: 21,
          },
          customerSatisfaction: 4.8,
          onTimeDelivery: 96,
        }

        setOwnerDetails(mockOwnerDetails)
        setOwnerStats(mockStats)
        setLoading(false)
      }, 500)
    }
  }, [isOpen, ownerId])

  if (!isOpen) return null

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Delivery Company Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Info Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{ownerDetails.companyName}</h2>
                      <p className="text-muted-foreground">{ownerDetails.name} - Owner</p>
                      <p className="text-sm text-muted-foreground">{ownerDetails.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(ownerDetails.status)}>{ownerDetails.status}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{ownerDetails.rating}/5</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Since {new Date(ownerDetails.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ownerDetails.completedDeliveries}</div>
                  <p className="text-xs text-muted-foreground">{ownerDetails.activeDeliveries} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${ownerDetails.totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Fleet Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ownerDetails.fleetSize}</div>
                  <p className="text-xs text-muted-foreground">vehicles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    On-Time Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ownerStats.onTimeDelivery}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information */}
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">Company Info</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{ownerDetails.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{ownerDetails.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Business Address</p>
                          <p className="text-sm text-muted-foreground">{ownerDetails.businessAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">License Number</p>
                          <p className="text-sm text-muted-foreground">{ownerDetails.licenseNumber}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Documents</span>
                          <span className="font-medium">{ownerStats.deliveryTypes.document}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fragile Items</span>
                          <span className="font-medium">{ownerStats.deliveryTypes.fragile}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Large Packages</span>
                          <span className="font-medium">{ownerStats.deliveryTypes.large}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Customer Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{ownerStats.customerSatisfaction}/5</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>On-Time Delivery</span>
                          <span className="font-medium">{ownerStats.onTimeDelivery}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Activity</span>
                          <span className="font-medium">
                            {new Date(ownerDetails.lastActivity).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
