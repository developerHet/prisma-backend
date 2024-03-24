/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ResetToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_token_key" ON "ResetToken"("token");
