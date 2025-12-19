"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Star, Package, Eye, UserCheck, UserX, Clock } from "lucide-react"

export function OwnerManagementCard({ owner, onStatusChange, onViewDetails }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
    onStatusChange(owner.id, newStatus)
    setIsLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{owner.companyName}</CardTitle>
              <p className="text-sm text-muted-foreground">{owner.name}</p>
              <p className="text-xs text-muted-foreground">{owner.email}</p>
            </div>
          </div>
          <Badge className={getStatusColor(owner.status)}>{owner.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span>{owner.completedDeliveries || 0} deliveries</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{owner.rating ? `${owner.rating}/5` : "No rating"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Joined {new Date(owner.joinDate).toLocaleDateString()}</span>
          </div>
          <div className="text-muted-foreground">Revenue: ${owner.totalRevenue || 0}</div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(owner.id)}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View Details
          </Button>

          {owner.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => handleStatusChange("active")}
                disabled={isLoading}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="w-3 h-3" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleStatusChange("suspended")}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <UserX className="w-3 h-3" />
                Reject
              </Button>
            </>
          )}

          {owner.status === "active" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleStatusChange("suspended")}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <UserX className="w-3 h-3" />
              Suspend
            </Button>
          )}

          {owner.status === "suspended" && (
            <Button
              size="sm"
              onClick={() => handleStatusChange("active")}
              disabled={isLoading}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <UserCheck className="w-3 h-3" />
              Reactivate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
