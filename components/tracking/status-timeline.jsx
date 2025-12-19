"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock, Package, Truck, MapPin, AlertCircle } from "lucide-react"

export function StatusTimeline({ order, statusHistory = [] }) {
  const statusSteps = [
    { key: "draft", label: "Draft", icon: Package, description: "Order created", color: "from-gray-500 to-gray-600" },
    {
      key: "published",
      label: "Published",
      icon: Package,
      description: "Order published for bidding",
      color: "from-blue-500 to-blue-600",
    },
    {
      key: "bidding",
      label: "Bidding",
      icon: Clock,
      description: "Receiving bids from delivery companies",
      color: "from-yellow-500 to-orange-500",
    },
    {
      key: "assigned",
      label: "Assigned",
      icon: Check,
      description: "Delivery company assigned",
      color: "from-purple-500 to-purple-600",
    },
    {
      key: "in_transit",
      label: "In Transit",
      icon: Truck,
      description: "Package is being delivered",
      color: "from-cyan-500 to-blue-500",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: MapPin,
      description: "Package delivered successfully",
      color: "from-green-500 to-green-600",
    },
  ]

  const getCurrentStepIndex = () => {
    if (order.status === "cancelled") return -1
    return statusSteps.findIndex((step) => step.key === order.status)
  }

  const currentStepIndex = getCurrentStepIndex()
  const isCancelled = order.status === "cancelled"

  const getStepStatus = (stepIndex) => {
    if (isCancelled) return "cancelled"
    if (stepIndex < currentStepIndex) return "completed"
    if (stepIndex === currentStepIndex) return "current"
    return "pending"
  }

  const getStepIcon = (step, status) => {
    const IconComponent = step.icon

    if (status === "completed") {
      return <Check className="w-5 h-5 text-white" />
    }
    if (status === "current") {
      return <IconComponent className="w-5 h-5 text-white animate-pulse" />
    }
    if (status === "cancelled") {
      return <AlertCircle className="w-5 h-5 text-white" />
    }
    return <IconComponent className="w-5 h-5 text-gray-400" />
  }

  const getStepColor = (step, status) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-green-500 to-green-600 shadow-lg"
      case "current":
        return `bg-gradient-to-r ${step.color} shadow-lg animate-pulse`
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600 shadow-lg"
      default:
        return "bg-gray-200 border-2 border-gray-300"
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          Order Status Timeline
        </CardTitle>
        <CardDescription className="text-blue-100">Track your order progress from creation to delivery</CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        {isCancelled && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 text-red-800">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Order Cancelled</span>
            </div>
            <p className="text-red-600 mt-2 ml-11">This order has been cancelled and will not be processed further.</p>
          </div>
        )}

        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const status = getStepStatus(index)
            const isLast = index === statusSteps.length - 1

            return (
              <div key={step.key} className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${getStepColor(step, status)}`}
                  >
                    {getStepIcon(step, status)}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-1 h-12 mt-3 rounded-full transition-all duration-500 ${
                        status === "completed" ? "bg-gradient-to-b from-green-500 to-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h4
                      className={`font-semibold text-lg transition-all duration-300 ${
                        status === "current"
                          ? "text-blue-600"
                          : status === "completed"
                            ? "text-green-600"
                            : status === "cancelled"
                              ? "text-red-600"
                              : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </h4>
                    {status === "current" && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm animate-pulse">
                        Current
                      </Badge>
                    )}
                    {status === "completed" && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-base mb-2">{step.description}</p>

                  {/* Show timestamp if available */}
                  {status === "completed" && (
                    <p className="text-sm text-gray-500 bg-green-50 px-3 py-1 rounded-full inline-block">
                      ✅ Completed {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  )}
                  {status === "current" && (
                    <p className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full inline-block">
                      🔄 Updated {new Date(order.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Status History */}
        {statusHistory.length > 0 && (
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              Status History
            </h4>
            <div className="space-y-3">
              {statusHistory.map((update) => (
                <div
                  key={update.id}
                  className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        Status changed from <span className="text-red-600">"{update.previousStatus}"</span> to{" "}
                        <span className="text-green-600">"{update.newStatus}"</span>
                      </p>
                      <p className="text-gray-600 mt-1">
                        By <span className="font-medium">{update.updatedBy}</span> ({update.updatedByRole})
                      </p>
                      {update.message && (
                        <p className="text-gray-600 mt-2 bg-white/60 p-2 rounded-lg">{update.message}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full ml-4">
                      {new Date(update.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
