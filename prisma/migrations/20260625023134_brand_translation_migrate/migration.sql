/*
  Warnings:

  - You are about to drop the column `deletedById` on the `Brand` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_deletedById_fkey";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "deletedById",
ALTER COLUMN "name" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Language_deletedAt_idx" ON "Language"("deletedAt");

CREATE UNIQUE INDEX "Brand_Translation_brand_id_language_id_unique"
ON "BrandTranslation" ("brandId", "languageId")
WHERE "deletedAt" IS NULL;
