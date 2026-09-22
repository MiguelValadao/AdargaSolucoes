import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface AdminPayload {
  id: number;
  nome: string;
  email: string;
}

export interface AuthedRequest extends Request {
  admin?: AdminPayload;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autenticado." });
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;
    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}