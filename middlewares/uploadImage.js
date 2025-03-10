import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de almacenamiento temporal para multer
const storage = multer.memoryStorage();

// Filtro para validar tipos de archivos
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Solo se permiten imágenes (jpeg, jpg, png, webp)'));
};

// Configuración del middleware multer
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 } // 5MB máximo
});

// Middleware para procesar y guardar las imágenes
export const processImage = async (req, res, next) => {
  try {
    // Si se proporciona una URL, usarla directamente
    if (req.body.imagen_url && req.body.imagen_url.trim() !== '') {
      // Valida que sea una URL de imagen
      const imageUrl = req.body.imagen_url.trim();
      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const isValidImageUrl = validImageExtensions.some(ext => 
        imageUrl.toLowerCase().endsWith(ext) || imageUrl.toLowerCase().includes(ext)
      );

      if (isValidImageUrl) {
        req.imageUrl = imageUrl;
        return next();
      } else {
        return next(new Error('La URL no corresponde a una imagen válida'));
      }
    }

    // Si no hay URL pero hay archivo, procesar el archivo
    if (req.file) {
      // Definir la categoría (viajes, guias, hoteles)
      const category = req.params.category || 'viajes';
      
      // Crear directorios si no existen
      const uploadsDir = path.join(__dirname, '../public/uploads');
      const categoryDir = path.join(uploadsDir, category);
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
      }
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir);
      }

      // Generar nombre de archivo único
      const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(req.file.originalname).toLowerCase()}`;
      const filePath = path.join(categoryDir, uniqueFilename);
      
      // Procesar imagen con sharp (redimensionar y optimizar)
      await sharp(req.file.buffer)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .toFile(filePath);
      
      // Crear URL relativa y completa para la imagen
      const imageRelativePath = `/uploads/${category}/${uniqueFilename}`;
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      const imageUrl = `${baseUrl}${imageRelativePath}`;
      
      // Añadir la URL de la imagen al request para usarla en el controlador
      req.imageUrl = imageUrl;
    }
    
    next();
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    next(error);
  }
};