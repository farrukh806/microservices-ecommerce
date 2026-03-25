/*
  Warnings:

  - You are about to drop the column `size` on the `Product` table. All the data in the column will be lost.
  - The `colors` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "size",
ADD COLUMN     "sizes" TEXT[],
DROP COLUMN "colors",
ADD COLUMN     "colors" TEXT[];
