import dotenv from 'dotenv';
import path from 'path';

// Prioridad 1: .env en la raíz del monorepo (../../ desde dist/ o src/)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Prioridad 2: .env local del backend (si existe, no sobreescribe ya cargadas)
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import authRouter from './routes/auth';
import recipesRouter from './routes/recipes';
import commentsRouter from './routes/comments';
import uploadRouter from './routes/upload';
import Comment from './models/Comment';
import authMiddleware, { AuthRequest } from './middleware/auth';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://app.recipehub.me',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/recetas', recipesRouter);
app.use('/api/recetas/:id/comentarios', commentsRouter);
app.use('/api/upload', uploadRouter);

// DELETE /api/comentarios/:id
app.delete('/api/comentarios/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const comentario = await Comment.findById(req.params.id);
    if (!comentario) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    const { id } = (req as AuthRequest).user!;
    if (comentario.usuarioId.toString() !== id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await comentario.deleteOne();
    return res.status(200).json({ message: 'Comentario eliminado' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;

// Solo arranca el servidor cuando el archivo se ejecuta directamente
if (require.main === module) {
  const PORT: number = parseInt(process.env.PORT ?? '4000', 10);
  const MONGO_URI: string = process.env.MONGO_URI!;

  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Conectado a MongoDB');
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
      });
    })
    .catch((err: Error) => {
      console.error('Error al conectar a MongoDB:', err.message);
      process.exit(1);
    });
}
