-- MySQL init script (optional)
-- If you use Prisma migrations, you don't need this file.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `AdminUser` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `role` enum('owner','admin','staff') NOT NULL DEFAULT 'owner',
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `lastLoginAt` datetime(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AdminUser_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `Car` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `imageUrl` longtext NOT NULL,
  `passengers` int NOT NULL,
  `transmission` varchar(191) NOT NULL,
  `fuel` varchar(191) NOT NULL,
  `pricePerDay` int NOT NULL,
  `featured` boolean NOT NULL DEFAULT false,
  `availabilityStatus` enum('available','unavailable','maintenance') NOT NULL DEFAULT 'available',
  `year` int NOT NULL,
  `description` text NULL,
  `isActive` boolean NOT NULL DEFAULT true,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Car_active_status_idx` (`isActive`,`availabilityStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `Lead` (
  `id` varchar(191) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `customerEmail` varchar(191) NULL,
  `customerPhone` varchar(191) NULL,
  `contactChannel` enum('whatsapp','email','telefone','outro') NOT NULL DEFAULT 'whatsapp',
  `status` enum('pendente','confirmada','em_andamento','concluida','cancelada') NOT NULL DEFAULT 'pendente',
  `pickupDate` datetime(3) NULL,
  `returnDate` datetime(3) NULL,
  `pickupLocation` varchar(191) NULL,
  `dropoffLocation` varchar(191) NULL,
  `message` text NULL,
  `notes` text NULL,
  `carId` varchar(191) NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Lead_created_idx` (`createdAt`),
  KEY `Lead_status_idx` (`status`),
  KEY `Lead_customerName_idx` (`customerName`),
  KEY `Lead_carId_idx` (`carId`),
  CONSTRAINT `Lead_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `AdminSession` (
  `id` varchar(191) NOT NULL,
  `adminUserId` varchar(191) NOT NULL,
  `tokenHash` varchar(64) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `AdminSession_tokenHash_key` (`tokenHash`),
  KEY `AdminSession_adminUserId_idx` (`adminUserId`),
  CONSTRAINT `AdminSession_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS=1;
