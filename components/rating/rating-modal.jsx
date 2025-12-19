"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RatingForm } from "./rating-form"
import type { DeliveryOrder, DeliveryOffer } from "@/types/order"
import type { Rating } from "@/types/rating"

interface RatingModalProps {
  order: DeliveryOrder | null
  offer: DeliveryOffer | null
  isOpen: boolean
  onClose: () => void
  onRatingSubmitted: (rating: Rating) => void
  existingRating?: Rating
}

export function RatingModal({ order, offer, isOpen, onClose, onRatingSubmitted, existingRating }: RatingModalProps) {
  if (!order || !offer) return null

  const handleRatingSubmitted = (rating: Rating) => {
    onRatingSubmitted(rating)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingRating ? "Update Review" : "Rate Your Delivery"}</DialogTitle>
          <DialogDescription>Help other users by sharing your experience with this delivery service</DialogDescription>
        </DialogHeader>

        <RatingForm
          order={order}
          offer={offer}
          onRatingSubmitted={handleRatingSubmitted}
          onCancel={onClose}
          existingRating={existingRating}
        />
      </DialogContent>
    </Dialog>
  )
}
