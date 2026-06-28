-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "deletedById" INTEGER;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
