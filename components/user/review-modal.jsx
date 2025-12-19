"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, Building2, Send, Sparkles } from "lucide-react"

export function ReviewModal({ order, isOpen, onClose, onSubmitReview }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [categories, setCategories] = useState({
    punctuality: 0,
    communication: 0,
    packaging: 0,
    professionalism: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const reviewData = {
      orderId: order.id,
      companyId: order.acceptedOffer.companyId,
      rating,
      review,
      categories,
      createdAt: new Date().toISOString(),
    }

    onSubmitReview(reviewData)
    setIsSubmitting(false)
    onClose()

    // Reset form
    setRating(0)
    setReview("")
    setCategories({ punctuality: 0, communication: 0, packaging: 0, professionalism: 0 })
  }

  const setCategoryRating = (category, value) => {
    setCategories((prev) => ({ ...prev, [category]: value }))
  }

  if (!isOpen || !order?.acceptedOffer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-50 to-blue-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <Star className="w-6 h-6 text-yellow-500" />
            Rate Your Delivery Experience
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{order.acceptedOffer.companyName}</h3>
                  <p className="text-gray-600">Delivered: {order.title}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Rating */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Overall Rating
              </h4>
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {rating === 0 && "Click to rate"}
                {rating === 1 && "Poor - Needs significant improvement"}
                {rating === 2 && "Fair - Below expectations"}
                {rating === 3 && "Good - Met expectations"}
                {rating === 4 && "Very Good - Exceeded expectations"}
                {rating === 5 && "Excellent - Outstanding service"}
              </p>
            </CardContent>
          </Card>

          {/* Category Ratings */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4">Rate Specific Areas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(categories).map(([category, value]) => (
                  <div key={category} className="space-y-2">
                    <label className="text-sm font-medium capitalize text-gray-700">{category}</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setCategoryRating(category, star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Written Review */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h4 className="text-lg font-semibold mb-4">Share Your Experience</h4>
              <Textarea
                placeholder="Tell others about your delivery experience..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[120px] border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
