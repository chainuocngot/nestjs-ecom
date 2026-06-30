-- AlterTable
ALTER TABLE "ProductTranslation" ADD COLUMN     "deletedById" INTEGER;

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

CREATE UNIQUE INDEX "Product_Translation_product_id_language_id_unique"
ON "ProductTranslation" ("productId", "languageId")
WHERE "deletedAt" IS NULL;
