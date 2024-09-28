-- CreateEnum
CREATE TYPE "MarketplaceType" AS ENUM ('SELL', 'RENT', 'DONATE');

-- CreateEnum
CREATE TYPE "MarketplaceItemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SOLD', 'RENTED', 'DONATED');

-- CreateTable
CREATE TABLE "MarketplaceItem" (
    "id" SERIAL NOT NULL,
    "wardrobeItemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "rentalPrice" DOUBLE PRECISION,
    "status" "MarketplaceItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "transactionType" "MarketplaceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketplaceItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MarketplaceItem" ADD CONSTRAINT "MarketplaceItem_wardrobeItemId_fkey" FOREIGN KEY ("wardrobeItemId") REFERENCES "WardrobeItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceItem" ADD CONSTRAINT "MarketplaceItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
