"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, MessageCircle, Clock, Package, UserCheck } from "lucide-react"
import type { Rating, RatingSummary } from "@/types/rating"

interface RatingDisplayProps {
  ratings: Rating[]
  summary: RatingSummary
  companyName: string
}

export function RatingDisplay({ ratings, summary, companyName }: RatingDisplayProps) {
  const categoryIcons = {
    communication: MessageCircle,
    timeliness: Clock,
    packaging: Package,
    professionalism: UserCheck,
  }

  const categoryLabels = {
    communication: "Communication",
    timeliness: "Timeliness",
    packaging: "Packaging",
    professionalism: "Professionalism",
  }

  const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === "lg" ? "w-5 h-5" : "w-4 h-4"} ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Customer Reviews for {companyName}
          </CardTitle>
          <CardDescription>Based on {summary.totalRatings} verified delivery reviews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Rating */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{summary.averageRating.toFixed(1)}</div>
              <StarRating rating={Math.round(summary.averageRating)} size="lg" />
              <p className="text-sm text-muted-foreground mt-1">{summary.totalRatings} reviews</p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{stars}★</span>
                  <Progress
                    value={
                      (summary.ratingDistribution[stars as keyof typeof summary.ratingDistribution] /
                        summary.totalRatings) *
                      100
                    }
                    className="flex-1 h-2"
                  />
                  <span className="text-sm text-muted-foreground w-8">
                    {summary.ratingDistribution[stars as keyof typeof summary.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <h4 className="font-medium mb-3">Service Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(categoryLabels).map(([key, label]) => {
                const IconComponent = categoryIcons[key as keyof typeof categoryIcons]
                const rating = summary.categoryAverages[key as keyof typeof summary.categoryAverages]
                return (
                  <div key={key} className="text-center p-3 border rounded-lg">
                    <IconComponent className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                    <div className="font-medium">{rating.toFixed(1)}</div>
                    <StarRating rating={Math.round(rating)} />
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recommendation Rate */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">
              {Math.round(summary.recommendationRate)}% of customers recommend this company
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        {ratings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageCircle className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No reviews yet</p>
            </CardContent>
          </Card>
        ) : (
          ratings.map((rating) => (
            <Card key={rating.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{rating.userId.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={rating.rating} />
                        <span className="text-sm font-medium">{rating.rating}/5</span>
                        {rating.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{formatDate(rating.createdAt)}</p>
                    </div>
                  </div>

                  {rating.isRecommended && (
                    <div className="flex items-center gap-1 text-green-600">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs">Recommends</span>
                    </div>
                  )}
                </div>

                {rating.review && <p className="text-sm text-muted-foreground mb-3">"{rating.review}"</p>}

                {/* Category breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(rating.categories).map(([key, value]) => (
                    <div key={key} className="text-center p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">
                        {categoryLabels[key as keyof typeof categoryLabels]}
                      </p>
                      <div className="flex justify-center">
                        <StarRating rating={value} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
