import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authMiddleware from '../middleware/auth';

const router = Router();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usamos memoria en lugar de multer-storage-cloudinary para evitar conflictos ESM
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB límite
});

// POST /api/upload
router.post('/', authMiddleware, (req: Request, res: Response) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, async (err: any) => {
    if (err) {
      console.error('Multer Error:', err);
      return res.status(400).json({ error: `Error al leer archivo: ${err.message || err}` });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen' });
      }

      // Convertir buffer a Data URI
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Subir directamente con el SDK de Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'recipehub',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      });

      return res.status(200).json({ 
        secure_url: result.secure_url
      });
    } catch (error: any) {
      console.error('Cloudinary Error:', error);
      const msg = error?.message || 'Error al procesar la imagen en Cloudinary';
      return res.status(400).json({ error: msg });
    }
  });
});

export default router;
