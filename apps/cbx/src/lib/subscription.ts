import { prisma } from '@/lib/prisma'
import {
  adsLimitForPlan,
  isSubscriptionActive,
  periodEndFrom,
  type SellerPlanId,
} from '@/lib/plans'
import type { PlanTier, SubscriptionStatus } from '@prisma/client'

export async function expireIfNeeded(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  if (
    user.subscriptionStatus === 'active' &&
    user.planExpiresAt &&
    user.planExpiresAt.getTime() <= Date.now()
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: 'expired' },
    })
  }
  return user
}

export async function countActiveAds(userId: string): Promise<number> {
  return prisma.product.count({
    where: { sellerId: userId, status: 'ativo' },
  })
}

export async function getPublishGate(userId: string): Promise<{
  canPublish: boolean
  reason: 'ok' | 'subscription' | 'limit' | 'missing'
  activeAds: number
  adsLimit: number
  plan: PlanTier
  subscriptionStatus: SubscriptionStatus
  planExpiresAt: Date | null
}> {
  const user = await expireIfNeeded(userId)
  if (!user) {
    return {
      canPublish: false,
      reason: 'missing',
      activeAds: 0,
      adsLimit: 0,
      plan: 'gratuito',
      subscriptionStatus: 'none',
      planExpiresAt: null,
    }
  }

  const activeAds = await countActiveAds(userId)
  const adsLimit = user.adsLimit
  const subscribed = isSubscriptionActive(user.subscriptionStatus, user.planExpiresAt)

  if (!subscribed) {
    return {
      canPublish: false,
      reason: 'subscription',
      activeAds,
      adsLimit,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      planExpiresAt: user.planExpiresAt,
    }
  }

  if (adsLimit >= 0 && activeAds >= adsLimit) {
    return {
      canPublish: false,
      reason: 'limit',
      activeAds,
      adsLimit,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      planExpiresAt: user.planExpiresAt,
    }
  }

  return {
    canPublish: true,
    reason: 'ok',
    activeAds,
    adsLimit,
    plan: user.plan,
    subscriptionStatus: user.subscriptionStatus,
    planExpiresAt: user.planExpiresAt,
  }
}

export async function activatePlan(userId: string, plan: SellerPlanId, from = new Date()) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const start =
    user?.subscriptionStatus === 'active' && user.planExpiresAt && user.planExpiresAt > from
      ? user.planExpiresAt
      : from
  const periodEnd = periodEndFrom(start)

  return prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      subscriptionStatus: 'active',
      planExpiresAt: periodEnd,
      adsLimit: adsLimitForPlan(plan),
    },
  })
}
