-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('pendente', 'confirmada', 'em_andamento', 'concluida', 'cancelada') NOT NULL DEFAULT 'pendente',
    `customerName` VARCHAR(191) NOT NULL,
    `customerEmail` VARCHAR(191) NULL,
    `customerPhone` VARCHAR(191) NULL,
    `contactChannel` ENUM('whatsapp', 'email', 'telefone', 'outro') NOT NULL DEFAULT 'whatsapp',
    `pickupDate` DATETIME(3) NULL,
    `returnDate` DATETIME(3) NULL,
    `pickupLocation` VARCHAR(191) NULL,
    `dropoffLocation` VARCHAR(191) NULL,
    `carId` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lead_status_idx`(`status`),
    INDEX `Lead_carId_idx`(`carId`),
    INDEX `Lead_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
