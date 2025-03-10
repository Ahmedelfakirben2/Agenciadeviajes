// routes/adminRoutes.js
import express from 'express';
import { 
  obtenerViajes, 
  formularioCrearViaje, 
  crearViaje, 
  formularioEditarViaje, 
  actualizarViaje, 
  eliminarViaje 
} from '../controllers/viajeController.js';
import { upload, processImage } from '../middlewares/uploadImage.js';

const router = express.Router();

// Rutas de administración de viajes
router.get('/viajes', obtenerViajes);
router.get('/viajes/crear', formularioCrearViaje);
router.post('/viajes/crear', 
  upload.single('imagen'), // Ahora es opcional porque podemos usar URL
  (req, res, next) => {
    req.params.category = 'viajes';
    next();
  },
  processImage,
  crearViaje
);

router.post('/viajes/editar/:id', 
  upload.single('imagen'),
  (req, res, next) => {
    req.params.category = 'viajes';
    next();
  },
  processImage,
  actualizarViaje
);
router.post('/viajes/eliminar/:id', eliminarViaje);

// Agregar aquí otras rutas de administración para guías y hoteles

export default router;