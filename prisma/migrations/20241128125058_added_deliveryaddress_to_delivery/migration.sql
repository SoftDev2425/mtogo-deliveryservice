/*
  Warnings:

  - Added the required column `deliveryAddress` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "deliveryAddress" TEXT NOT NULL;
