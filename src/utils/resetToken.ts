import crypto from "crypto";
import db from "./db";
import { ResetToken } from "@prisma/client";

export const deleteResetToken = async (id: string) => {
  await db.resetToken.deleteMany({
    where: {
      OR: [
        {
          id,
        },
        {
          expiresAt: {
            lt: new Date(),
          },
        },
      ],
    },
  });
};

export const generateResetToken = async (userId: string): Promise<ResetToken> => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  const resetToken = await db.resetToken.create({
    data: {
      userId,
      expiresAt,
      token: crypto.randomBytes(32).toString("hex"),
    },
  });
  return resetToken;
};
