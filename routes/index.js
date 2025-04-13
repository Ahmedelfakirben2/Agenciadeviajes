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

// Rutas de Viajes (Asumiendo que viajeController exporta estas funciones)
router.get('/viajes', viajeController.paginaViajes ); // Cambiado de obtenerViajes si paginaViajes es la correcta para la vista pública
router.get('/viajes/:viaje', viajeController.paginaDetalleViaje ); // Cambiado :slug a :viaje si eso usa el controlador

// Rutas de Testimoniales (Asumiendo que testimonialesController exporta estas funciones)
router.get('/testimoniales', testimonialesController.paginaTestimoniales );
router.post('/testimoniales', testimonialesController.crearTestimonial );

// Usar el router de administración
router.use('/admin', adminRoutes);

export default router;