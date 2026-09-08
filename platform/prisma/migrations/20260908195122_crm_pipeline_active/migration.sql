-- AlterTable
ALTER TABLE "pipeline_stages" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "pipelines" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
