import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router();

function signToken(userId: unknown): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

function sanitizeUser(user: IUser): Record<string, unknown> {
  const obj = user.toObject() as Record<string, unknown>;
  delete obj.password;
  return obj;
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { nombre, email, password } = req.body as {
    nombre?: string;
    email?: string;
    password?: string;
  };

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'nombre, email y password son requeridos' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email ya registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ nombre, email, password: hashed });
    const token = signToken(user._id);

    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son requeridos' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = signToken(user._id);
    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = (req as AuthRequest).user!;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
