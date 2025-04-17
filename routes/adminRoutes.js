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
import * as hotelController from '../controllers/hotelController.js';
import * as guiaTuristicoController from '../controllers/guiaTuristicoController.js';
import * as testimonialesController from '../controllers/testimonialesController.js';
import * as reservaController from '../controllers/reservaController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Importar el middleware de autenticación

const router = express.Router();

// --- ¡IMPORTANTE! Aplicar el middleware de autenticación PRIMERO a TODAS las rutas de admin ---
router.use(authMiddleware);
console.log('>>>> Middleware de Autenticación Aplicado a /admin'); // Logging para depuración

// --- RUTAS DE ADMINISTRACIÓN (Ya protegidas por router.use(authMiddleware)) ---

// Ruta principal de administración
router.get('/', (req, res) => {
  // Ya no necesitas verificar req.session.authUser aquí, el middleware lo hizo
  res.render('admin/layout/index', {
    pagina: 'Panel de Administración'
    // Puedes pasar datos del usuario si los guardaste en la sesión
    // user: req.session.user // Ejemplo
  });
});

// Rutas de administración de viajes
router.get('/viajes', obtenerViajes); // No necesita 'authMiddleware' individualmente
router.get('/viajes/crear', formularioCrearViaje);
router.post('/viajes/crear', crearViaje);
router.get('/viajes/editar/:id', formularioEditarViaje);
router.post('/viajes/editar/:id', actualizarViaje);
router.post('/viajes/eliminar/:id', eliminarViaje);

// Rutas de administración de hoteles
router.get('/hoteles', hotelController.obtenerHoteles); // No necesita 'authMiddleware' individualmente
router.get('/hoteles/crear', hotelController.formularioCrearHotel);
router.post('/hoteles/crear', hotelController.crearHotel); // Allow up to 10 images
router.get('/hoteles/editar/:id', hotelController.formularioEditarHotel);
router.post('/hoteles/editar/:id', hotelController.actualizarHotel);
router.post('/hoteles/eliminar/:id', hotelController.eliminarHotel);

// Rutas de administración de guías turísticos
router.get('/guias', guiaTuristicoController.obtenerGuias); // No necesita 'authMiddleware' individualmente
router.get('/guias/crear', guiaTuristicoController.formularioCrearGuia)
router.post('/guias/crear', guiaTuristicoController.crearGuia)
router.get('/guias/editar/:id', guiaTuristicoController.formularioEditarGuia);
router.post('/guias/editar/:id', guiaTuristicoController.actualizarGuia);
router.post('/guias/eliminar/:id', guiaTuristicoController.eliminarGuia)

// Rutas de administración de testimoniales
router.get('/testimoniales', testimonialesController.paginaTestimonialesAdmin);

// Rutas de administración de reservas
router.get('/reservas', reservaController.obtenerReservasAdmin);

// --- Ya NO es necesario importar authMiddleware ni usar router.use aquí al final ---

export default router;
