/*
  Warnings:

  - You are about to drop the column `email` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Hospital` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_email]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_email` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Hospital_email_key` ON `Hospital`;

-- AlterTable
ALTER TABLE `Hospital` DROP COLUMN `email`,
    DROP COLUMN `password`,
    ADD COLUMN `owner_email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Hospital_owner_email_key` ON `Hospital`(`owner_email`);
