import express from 'express';
import { 
    paginaInicio, 
    paginaNosotros, 
    paginaViajes, 
    paginaTestimoniales, 
    paginaDetalleViaje,
    guardarTestimonial 
} from '../controllers/paginaController.js';
import { 
    paginaReservar,
    guardarReserva 
} from '../controllers/reservaController.js';

const router = express.Router();

// Páginas principales
router.get('/', paginaInicio);
router.get('/nosotros', paginaNosotros);
router.get('/viajes', paginaViajes);
router.get('/viajes/:viaje', paginaDetalleViaje);
router.get('/testimoniales', paginaTestimoniales);
router.post('/testimoniales', guardarTestimonial);

// Rutas de reservas
router.get('/reservar/:slug', paginaReservar);
router.post('/reservar', guardarReserva);

export default router;