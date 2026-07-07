/*
  Warnings:

  - You are about to drop the column `images` on the `ProductSKUSnapshot` table. All the data in the column will be lost.
  - Added the required column `image` to the `ProductSKUSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deletedById" INTEGER;

-- AlterTable
ALTER TABLE "ProductSKUSnapshot" DROP COLUMN "images",
ADD COLUMN     "image" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
