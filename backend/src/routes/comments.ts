import { Router, Request, Response } from 'express';
import Comment from '../models/Comment';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router({ mergeParams: true });

// GET /api/recetas/:id/comentarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const comentarios = await Comment.find({ recetaId: req.params.id })
      .populate('usuarioId', 'nombre');
    return res.status(200).json({ comentarios });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/recetas/:id/comentarios
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { texto, calificacion } = req.body as {
    texto?: string;
    calificacion?: unknown;
  };

  if (!texto || calificacion === undefined) {
    return res.status(400).json({ error: 'texto y calificacion son requeridos' });
  }

  const cal = Number(calificacion);
  if (!Number.isInteger(cal) || cal < 1 || cal > 5) {
    return res.status(400).json({ error: 'calificacion debe ser un entero entre 1 y 5' });
  }

  try {
    const { id } = (req as AuthRequest).user!;
    const comentario = await Comment.create({
      recetaId: req.params.id,
      usuarioId: id,
      texto,
      calificacion: cal,
    });

    return res.status(201).json({ comentario });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
