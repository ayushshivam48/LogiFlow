"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Building, Mail, Calendar, Star } from "lucide-react"

export function UserManagementCard({ user, onStatusChange, onViewDetails }) {
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "owner":
        return "bg-blue-100 text-blue-800"
      case "user":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {user.companyName && (
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>{user.companyName}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
          </div>
          {user.ordersCount !== undefined && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{user.ordersCount} orders</span>
            </div>
          )}
          {user.rating && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{user.rating} rating</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button size="sm" variant="outline" onClick={() => onViewDetails(user.id)}>
            View Details
          </Button>
          {user.status === "active" && (
            <Button size="sm" variant="destructive" onClick={() => onStatusChange(user.id, "suspended")}>
              Suspend User
            </Button>
          )}
          {user.status === "suspended" && (
            <Button size="sm" onClick={() => onStatusChange(user.id, "active")}>
              Reactivate User
            </Button>
          )}
          {user.status === "pending" && (
            <>
              <Button size="sm" onClick={() => onStatusChange(user.id, "active")}>
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onStatusChange(user.id, "suspended")}>
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
