'use client'

import { motion } from 'framer-motion'

import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'
import { formatRelativeDate } from '@/lib/utils'
import type { Review } from '@/types'
import { staggerContainer, staggerItem } from '@/animations/variants'

interface SellerReviewsProps {
  reviews: Review[]
}

export function SellerReviews({ reviews }: SellerReviewsProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Este vendedor ainda não possui avaliações.</p>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {reviews.map((review) => (
        <motion.article
          key={review.id}
          variants={staggerItem}
          className="rounded-xl border border-border/60 bg-card p-4"
        >
          <div className="flex items-start gap-3">
            <Avatar src={review.authorAvatar} fallback={review.authorName} size="sm" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{review.authorName}</p>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeDate(review.createdAt)}
                </span>
              </div>
              <Rating value={review.rating} size="sm" className="mt-1" />
              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
