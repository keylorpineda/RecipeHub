import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRouter from './routes/auth';
import recipesRouter from './routes/recipes';
import commentsRouter from './routes/comments';
import Comment from './models/Comment';
import authMiddleware, { AuthRequest } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/recetas', recipesRouter);
app.use('/api/recetas/:id/comentarios', commentsRouter);

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
