-- CreateEnum
CREATE TYPE "CatalogStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "status" "CatalogStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BRL',
    "status" "CatalogStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_organization_id_idx" ON "products"("organization_id");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE UNIQUE INDEX "products_organization_id_slug_key" ON "products"("organization_id", "slug");

-- CreateIndex
CREATE INDEX "offers_organization_id_idx" ON "offers"("organization_id");

-- CreateIndex
CREATE INDEX "offers_product_id_idx" ON "offers"("product_id");

-- CreateIndex
CREATE INDEX "offers_status_idx" ON "offers"("status");

-- CreateIndex
CREATE UNIQUE INDEX "offers_organization_id_slug_key" ON "offers"("organization_id", "slug");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offers" ADD CONSTRAINT "offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
