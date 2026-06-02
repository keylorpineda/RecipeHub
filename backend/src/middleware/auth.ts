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
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    (req as AuthRequest).user = { id: String(payload.id) };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
