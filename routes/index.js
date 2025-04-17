// routes/index.js
import express from 'express';
import * as paginaController from '../controllers/paginaController.js';
import * as testimonialesController from '../controllers/testimonialesController.js';
// Importar el router de administración
 import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.get('/', paginaController.paginaInicio );
router.get('/nosotros', paginaController.paginaNosotros );
// Asegúrate de que paginaReservar esté exportado en paginaController o crea una ruta/controlador específico
// router.get('/reservar', paginaController.paginaReservar ); 

// Rutas de Viajes
 router.get('/viajes', paginaController.paginaViajes);
 router.get('/viajes/:viaje', paginaController.paginaDetalleViaje);

// Rutas de Testimoniales
 router.get('/testimoniales', testimonialesController.paginaTestimoniales);
 router.post('/testimoniales', testimonialesController.crearTestimonial);

// --- RUTAS DE LOGIN ---

// Ruta para mostrar el formulario de login
 router.get('/login', (req, res) => {
  res.render('login', { error: null }); // Pasamos null como valor inicial de error
 });

// Ruta para procesar el formulario de login
 router.post('/login', (req, res) => {
  // Credenciales fijas (¡NO USAR EN PRODUCCIÓN!)
  const ADMIN_EMAIL = 'admin@viajes.com';
  const ADMIN_PASSWORD = 'password';

  // Obtener datos del formulario
  const { email, password } = req.body;

  // Comparar credenciales
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Credenciales correctas: Autenticar y redirigir
    req.session.authUser = true; // Set authUser to true
    console.log('>>>> Usuario AUTENTICADO con credenciales fijas. Redirigiendo a /admin...');
    res.redirect('/admin');
  } else {
    // Credenciales incorrectas: Mostrar error y volver al login
    console.log('!!!! Credenciales INCORRECTAS !!!!. Redirigiendo de nuevo a /login...');
    res.render('login', { error: 'Credenciales incorrectas. Intenta de nuevo.' });
  }
 });

// Usar el router de administración (importante: después de las rutas de login)
 router.use('/admin', adminRoutes);

 export default router;