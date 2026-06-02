import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  // Cookie HttpOnly tiene prioridad; header Authorization como fallback para Postman/tests
  const token: string | undefined =
    req.cookies?.token ?? req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    (req as AuthRequest).user = { id: String(payload.id) };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
