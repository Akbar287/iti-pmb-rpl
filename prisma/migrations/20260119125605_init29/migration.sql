/*
  Warnings:

  - Changed the type of `status` on the `tickets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusTiketBantuan" AS ENUM ('OPEN', 'IN_PROGRESS', 'REOPEN', 'SOLVED', 'ON_HOLD', 'PENDING', 'RESOLVED', 'CLOSED');

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "status",
ADD COLUMN     "status" "StatusTiketBantuan" NOT NULL;
