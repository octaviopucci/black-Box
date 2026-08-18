-- AlterEnum
ALTER TYPE "PlanTier" ADD VALUE IF NOT EXISTS 'starter';
ALTER TYPE "PlanTier" ADD VALUE IF NOT EXISTS 'empresarial_ilimitado';

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('none', 'pending', 'active', 'expired', 'canceled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'expired', 'cancelled');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'none';
ALTER TABLE "users" ADD COLUMN "planExpiresAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "adsLimit" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "PlanTier" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "pixCopyPaste" TEXT,
    "pixQrBase64" TEXT,
    "pixExpiresAt" TIMESTAMP(3),
    "provider" TEXT NOT NULL DEFAULT 'sandbox',
    "providerPaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerPaymentId_key" ON "payments"("providerPaymentId");

-- CreateIndex
CREATE INDEX "payments_userId_createdAt_idx" ON "payments"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
