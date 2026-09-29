-- Multi-asset trading, exact decimal money columns and an account ledger.
-- Existing rows are converted from the old fixed-point integer encoding.

-- AlterEnum
ALTER TYPE "public"."Symbol" ADD VALUE IF NOT EXISTS 'ETH';
ALTER TYPE "public"."Symbol" ADD VALUE IF NOT EXISTS 'SOL';

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('Deposit', 'RealizedPnl');

-- User
ALTER TABLE "public"."User" DROP COLUMN "decimal";
ALTER TABLE "public"."User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Asset: integer base units -> decimal
ALTER TABLE "public"."Asset"
  ALTER COLUMN "balance" TYPE DECIMAL(24,8) USING ("balance"::numeric / power(10, "decimals"));
ALTER TABLE "public"."Asset" DROP COLUMN "decimals";

-- Order: integer fixed-point -> decimal
ALTER TABLE "public"."Order" ADD COLUMN "asset" "public"."Symbol" NOT NULL DEFAULT 'BTC';
ALTER TABLE "public"."Order"
  ALTER COLUMN "qty" TYPE DECIMAL(24,8) USING ("qty"::numeric / power(10, "qtyDecimals")),
  ALTER COLUMN "openingPrice" TYPE DECIMAL(24,8) USING ("openingPrice"::numeric / power(10, "decimals")),
  ALTER COLUMN "closingPrice" DROP NOT NULL,
  ALTER COLUMN "closingPrice" TYPE DECIMAL(24,8) USING (NULLIF("closingPrice", 0)::numeric / power(10, "decimals")),
  ALTER COLUMN "pnl" TYPE DECIMAL(24,8) USING ("pnl"::numeric / power(10, "decimals")),
  ALTER COLUMN "pnl" SET DEFAULT 0,
  ALTER COLUMN "takeProfit" TYPE DECIMAL(24,8) USING ("takeProfit"::numeric / power(10, "decimals")),
  ALTER COLUMN "stopLoss" TYPE DECIMAL(24,8) USING ("stopLoss"::numeric / power(10, "decimals")),
  ALTER COLUMN "margin" TYPE DECIMAL(24,8) USING ("margin"::numeric / 100);
ALTER TABLE "public"."Order" DROP COLUMN "decimals";
ALTER TABLE "public"."Order" DROP COLUMN "qtyDecimals";

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "public"."Order"("userId", "status");

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "symbol" "public"."Symbol" NOT NULL,
    "amount" DECIMAL(24,8) NOT NULL,
    "balanceAfter" DECIMAL(24,8) NOT NULL,
    "orderId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Transaction_userId_createdAt_idx" ON "public"."Transaction"("userId", "createdAt");

ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
