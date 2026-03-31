/*
  Warnings:

  - You are about to drop the column `sessionId` on the `message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `message` DROP COLUMN `sessionId`;
