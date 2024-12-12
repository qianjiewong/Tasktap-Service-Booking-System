-- DropIndex
DROP INDEX "Business_email_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;
