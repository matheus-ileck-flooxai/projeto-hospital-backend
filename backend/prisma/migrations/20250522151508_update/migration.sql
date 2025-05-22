-- DropForeignKey
ALTER TABLE `Vacancy` DROP FOREIGN KEY `Vacancy_userId_fkey`;

-- DropIndex
DROP INDEX `Vacancy_userId_fkey` ON `Vacancy`;

-- AlterTable
ALTER TABLE `Vacancy` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Vacancy` ADD CONSTRAINT `Vacancy_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
