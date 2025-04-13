// routes/index.js
import express from 'express';
import paginaController from '../controllers/paginaController.js';
import viajeController from '../controllers/viajeController.js';
import testimonialesController from '../controllers/testimonialesController.js';
// Importar el router de administración
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.get('/', paginaController.paginaInicio );
router.get('/nosotros', paginaController.paginaNosotros );
router.get('/viajes', viajeController.obtenerViajes );
router.get('/viajes/:slug', viajeController.paginaDetalleViaje );
router.get('/testimoniales', testimonialesController.paginaTestimoniales );
router.post('/testimoniales', testimonialesController.crearTestimonial );
router.get('/reservar', paginaController.paginaReservar );

// Usar el router de administración
router.use('/admin', adminRoutes);

export default router;