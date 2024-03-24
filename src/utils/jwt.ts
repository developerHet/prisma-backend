import jwt from "jsonwebtoken";
import dotenv from "dotenv";

interface decodedToken {
  id: string
}

export const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) throw new Error("JWT secret is not defined.");
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
};

export const verifyToken = (token: string) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT secret is not defined.");
  return jwt.verify(token, process.env.JWT_SECRET) as decodedToken;
};
