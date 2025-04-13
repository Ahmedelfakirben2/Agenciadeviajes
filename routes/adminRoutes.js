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

// Importar los controladores de hoteles
import {
  obtenerHoteles,
  formularioCrearHotel,
  crearHotel,
  formularioEditarHotel,
  actualizarHotel,
  eliminarHotel
} from '../controllers/hotelController.js';

// Importar los controladores de guías turísticos
import {
  obtenerGuias,
  formularioCrearGuia,
  crearGuia,
  formularioEditarGuia,
  actualizarGuia,
  eliminarGuia
} from '../controllers/guiaTuristicoController.js';

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

// Rutas de administración de hoteles
router.get('/hoteles', obtenerHoteles);
router.get('/hoteles/crear', formularioCrearHotel);
router.post('/hoteles/crear', crearHotel);
router.get('/hoteles/editar/:id', formularioEditarHotel);
router.post('/hoteles/editar/:id', actualizarHotel);
router.post('/hoteles/eliminar/:id', eliminarHotel);

// Rutas de administración de guías turísticos
router.get('/guias', obtenerGuias);
router.get('/guias/crear', formularioCrearGuia);
router.post('/guias/crear', crearGuia);
router.get('/guias/editar/:id', formularioEditarGuia);
router.post('/guias/editar/:id', actualizarGuia);
router.post('/guias/eliminar/:id', eliminarGuia);

export default router;