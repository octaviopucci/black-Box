-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" UUID,
    "name" TEXT NOT NULL,
    "legal_name" TEXT,
    "document" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "PartnerStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "partners_organization_id_idx" ON "partners"("organization_id");

-- CreateIndex
CREATE INDEX "partners_status_idx" ON "partners"("status");

-- CreateIndex
CREATE UNIQUE INDEX "partners_organization_id_user_id_key" ON "partners"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "partners_organization_id_document_key" ON "partners"("organization_id", "document");

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
