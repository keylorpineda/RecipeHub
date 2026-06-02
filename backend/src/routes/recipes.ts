import { Router, Request, Response } from 'express';
import Recipe from '../models/Recipe';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/recetas
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};

    if (req.query.categoria) filter.categoria = req.query.categoria as string;
    if (req.query.dificultad) filter.dificultad = req.query.dificultad as string;
    if (req.query.tags) {
      const tags = Array.isArray(req.query.tags) ? (req.query.tags as string[]) : [req.query.tags as string];
      filter.tags = { $in: tags };
    }

    const recetas = await Recipe.find(filter).populate('autorId', 'nombre email');
    return res.status(200).json({ recetas });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// POST /api/recetas
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { titulo, descripcion, categoria, tiempoMin, porciones, dificultad, ingredientes, pasos, tags, imagenUrl } = req.body as Record<string, unknown>;

  if (!titulo || !descripcion || !categoria || !tiempoMin || !porciones || !dificultad || !ingredientes || !pasos) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const { id } = (req as AuthRequest).user!;
    const receta = await Recipe.create({
      titulo,
      descripcion,
      categoria,
      tiempoMin,
      porciones,
      dificultad,
      ingredientes,
      pasos,
      tags,
      imagenUrl,
      autorId: id,
    });

    return res.status(201).json({ receta });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// GET /api/recetas/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const receta = await Recipe.findById(req.params.id).populate('autorId', 'nombre email');
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    return res.status(200).json({ receta });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/recetas/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const receta = await Recipe.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const { id } = (req as AuthRequest).user!;
    if (receta.autorId.toString() !== id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const campos = ['titulo', 'descripcion', 'categoria', 'tiempoMin', 'porciones', 'dificultad', 'ingredientes', 'pasos', 'tags', 'imagenUrl'] as const;

    for (const campo of campos) {
      if (req.body[campo] !== undefined) {
        (receta as unknown as Record<string, unknown>)[campo] = req.body[campo];
      }
    }

    receta.updatedAt = new Date();
    await receta.save();

    return res.status(200).json({ receta });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
});

// DELETE /api/recetas/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const receta = await Recipe.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    const { id } = (req as AuthRequest).user!;
    if (receta.autorId.toString() !== id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await receta.deleteOne();
    return res.status(200).json({ message: 'Receta eliminada' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
