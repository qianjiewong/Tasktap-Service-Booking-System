/*
  Warnings:

  - You are about to drop the `ServiceProvider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `location` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "captureId" TEXT,
ADD COLUMN     "location" TEXT NOT NULL,
ALTER COLUMN "reviews" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "adminStatus" TEXT NOT NULL DEFAULT 'not approved',
ADD COLUMN     "businessStatus" TEXT NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT;

-- DropTable
DROP TABLE "ServiceProvider";
