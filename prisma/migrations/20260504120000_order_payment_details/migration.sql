-- Add order display and counter-payment fields.
ALTER TABLE "Order" ADD COLUMN "orderNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "orderDate" TEXT;
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'IN_STORE';
ALTER TABLE "Order" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'PAY_AT_COUNTER';
ALTER TABLE "Order" ADD COLUMN "paidAt" DATETIME;

CREATE UNIQUE INDEX "Order_branchId_orderDate_orderNumber_key" ON "Order"("branchId", "orderDate", "orderNumber");
