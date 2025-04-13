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
import * as hotelController from '../controllers/hotelController.js';

// Importar los controladores de guías turísticos
import * as guiaTuristicoController from '../controllers/guiaTuristicoController.js';

// Importar el controlador de testimoniales
import * as testimonialesController from '../controllers/testimonialesController.js';

//Importar el controlador de reservas
import * as reservaController from '../controllers/reservaController.js';

const router = express.Router();

// Ruta principal de administración
router.get('/', (req, res) => {
  res.render('admin/index', {
    pagina: 'Panel de Administración'
  });
});

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
router.get('/viajes/editar/:id', formularioEditarViaje);
router.post('/viajes/editar/:id',
  upload.single('imagen'), // Ahora es opcional porque podemos usar URL
  (req, res, next) => {
    req.params.category = 'viajes';
    next();
  },
  processImage,
  actualizarViaje
);
router.post('/viajes/eliminar/:id', eliminarViaje);

// Rutas de administración de hoteles
router.get('/hoteles', hotelController.obtenerHoteles);
router.get('/hoteles/crear', hotelController.formularioCrearHotel);
router.post('/hoteles/crear', hotelController.crearHotel);
router.get('/hoteles/editar/:id', hotelController.formularioEditarHotel);
router.post('/hoteles/editar/:id', hotelController.actualizarHotel);
router.post('/hoteles/eliminar/:id', hotelController.eliminarHotel);

// Rutas de administración de guías turísticos
router.get('/guias', guiaTuristicoController.obtenerGuias);
router.get('/guias/crear', guiaTuristicoController.formularioCrearGuia);
router.post('/guias/crear', guiaTuristicoController.crearGuia);
router.get('/guias/editar/:id', guiaTuristicoController.formularioEditarGuia);
router.post('/guias/editar/:id', guiaTuristicoController.actualizarGuia);
router.post('/guias/eliminar/:id', guiaTuristicoController.eliminarGuia);

// Rutas de administración de testimoniales
router.get('/testimoniales', testimonialesController.paginaTestimonialesAdmin);

//Rutas de administración de reservas
router.get('/reservas', reservaController.obtenerReservasAdmin);

export default router;
