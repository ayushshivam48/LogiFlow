"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Package, Clock, MessageCircle, UserCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function RatingForm({ order, offer, onRatingSubmitted, onCancel, existingRating }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    rating: existingRating?.rating || 0,
    review: existingRating?.review || "",
    categories: existingRating?.categories || {
      communication: 0,
      timeliness: 0,
      packaging: 0,
      professionalism: 0,
    },
    isRecommended: existingRating?.isRecommended || false,
  })

  const handleStarClick = (field, value) => {
    if (field === "rating") {
      setFormData((prev) => ({ ...prev, rating: value }))
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: { ...prev.categories, [field]: value },
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newRating = {
      id: existingRating?.id || Date.now().toString(),
      orderId: order.id,
      userId: user?.id || "",
      ownerId: offer.ownerId,
      ownerName: offer.ownerName,
      companyName: offer.companyName,
      rating: formData.rating,
      review: formData.review,
      categories: formData.categories,
      isRecommended: formData.isRecommended,
      createdAt: existingRating?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: true,
    }

    onRatingSubmitted(newRating)
  }

  const StarRating = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none transform hover:scale-110 transition-transform duration-200"
          >
            <Star
              className={`w-6 h-6 transition-all duration-300 ${
                star <= value ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  const categoryIcons = {
    communication: MessageCircle,
    timeliness: Clock,
    packaging: Package,
    professionalism: UserCheck,
  }

  const categoryLabels = {
    communication: "Communication",
    timeliness: "Timeliness",
    packaging: "Packaging & Handling",
    professionalism: "Professionalism",
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          {existingRating ? "Update Your Review" : "Rate Your Delivery Experience"}
        </CardTitle>
        <CardDescription className="text-blue-100">
          Share your experience with {offer.companyName} for order "{order.title}"
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Overall Rating */}
          <div className="space-y-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <StarRating
              value={formData.rating}
              onChange={(value) => handleStarClick("rating", value)}
              label="Overall Rating"
            />

            {formData.rating > 0 && (
              <p className="text-sm text-gray-600 font-medium bg-white/60 p-3 rounded-lg">
                {formData.rating === 5 && "🌟 Excellent! Outstanding service."}
                {formData.rating === 4 && "⭐ Very good! Above expectations."}
                {formData.rating === 3 && "👍 Good. Met expectations."}
                {formData.rating === 2 && "⚠️ Fair. Some issues encountered."}
                {formData.rating === 1 && "❌ Poor. Significant problems."}
              </p>
            )}
          </div>

          {/* Category Ratings */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              Rate Specific Aspects
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const IconComponent = categoryIcons[key]
                return (
                  <div
                    key={key}
                    className="flex items-start gap-4 p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mt-1">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <StarRating
                        value={formData.categories[key]}
                        onChange={(value) => handleStarClick(key, value)}
                        label={label}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Written Review */}
          <div className="space-y-3">
            <Label htmlFor="review" className="text-base font-semibold text-gray-800">
              Written Review
            </Label>
            <Textarea
              id="review"
              value={formData.review}
              onChange={(e) => setFormData((prev) => ({ ...prev, review: e.target.value }))}
              placeholder="Share details about your delivery experience. What went well? What could be improved?"
              rows={4}
              className="resize-none border-2 border-gray-200 focus:border-blue-500 rounded-xl p-4 text-base transition-all duration-300"
            />
            <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
              💡 Your review helps other users make informed decisions and helps delivery companies improve their
              service.
            </p>
          </div>

          {/* Recommendation */}
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <Checkbox
              id="recommend"
              checked={formData.isRecommended}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecommended: checked }))}
              className="w-5 h-5"
            />
            <Label htmlFor="recommend" className="text-base font-medium text-gray-800 cursor-pointer">
              👍 I would recommend {offer.companyName} to others
            </Label>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Order Summary
            </h4>
            <div className="text-sm space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Order:</span>
                <span className="text-gray-800">{order.title}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Company:</span>
                <span className="text-gray-800">{offer.companyName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Price:</span>
                <span className="text-green-600 font-semibold">${offer.price}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-600">Duration:</span>
                <span className="text-gray-800">{offer.estimatedDuration}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600">Completed:</span>
                <span className="text-gray-800">{new Date(order.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              disabled={formData.rating === 0}
            >
              {existingRating ? "Update Review" : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
