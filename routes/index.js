// routes/index.js
import express from 'express';
import * as paginaController from '../controllers/paginaController.js';
import * as viajeController from '../controllers/viajeController.js';
import * as testimonialesController from '../controllers/testimonialesController.js';
// Importar el router de administración
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.get('/', paginaController.paginaInicio );
router.get('/nosotros', paginaController.paginaNosotros );
// Asegúrate de que paginaReservar esté exportado en paginaController o crea una ruta/controlador específico
// router.get('/reservar', paginaController.paginaReservar ); 

// Rutas de Viajes (Asumiendo que paginaController exporta estas funciones para la vista pública)
router.get('/viajes', paginaController.paginaViajes ); // Usar paginaController para la vista pública
router.get('/viajes/:viaje', paginaController.paginaDetalleViaje ); // Usar paginaController y el parámetro :viaje

// Rutas de Testimoniales (Asumiendo que testimonialesController exporta estas funciones)
router.get('/testimoniales', testimonialesController.paginaTestimoniales );
router.post('/testimoniales', testimonialesController.crearTestimonial ); // Corregido de guardarTestimonial si crearTestimonial es la correcta

// Usar el router de administración
router.use('/admin', adminRoutes);

export default router;