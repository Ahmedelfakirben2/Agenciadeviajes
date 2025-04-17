import express from 'express';
import router from './routes/index.js';
import adminRoutes from './routes/adminRoutes.js';
import db from './config/db.js';
import { Viaje } from './models/Viaje.js';
import { GuiaTuristico } from './models/GuiaTuristico.js';
import { Hotel } from './models/Hotel.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import session from 'express-session'; // Asegúrate de haber hecho 'npm install express-session'

// Configurar variables de entorno
dotenv.config();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- ¡IMPORTANTE! Configurar express-session PRIMERO ---
app.use(session({
  secret: 'cambia_esto_por_una_clave_secreta_muy_segura', // ¡CAMBIA ESTA CLAVE!
  resave: false, // No guardar la sesión si no se modifica
  saveUninitialized: false, // No guardar sesiones vacías
  cookie: {
    secure: false, // Poner a true si usas HTTPS
    httpOnly: true, // Ayuda a prevenir ataques XSS
    maxAge: 1000 * 60 * 60 * 24 // Duración de la cookie (ej: 1 día)
   }
}));
console.log('>>>> Middleware de Sesión Inicializado'); // Logging para depuración

// Establecer BASE_URL para las imágenes
const port = process.env.PORT || 4000;
process.env.BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Conectar la base de datos
db.authenticate()
    .then(() => console.log('Base de datos conectada'))
    .catch(error => {
        console.error('Error al conectar la base de datos:', error);
    });

// Sincronizar la base de datos (considera usar migraciones en producción)
db.sync()
    .then(() => {
        console.log('Base de datos sincronizada.');
        // Código para crear datos de ejemplo (asegúrate de que no cause errores si ya existen)
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos o crear datos:', error);
    });

// Establecer motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware para variables locales (después de la sesión)
app.use((req, res, next) => {
    console.log('>>>> Accediendo a middleware de variables locales. Session ID:', req.sessionID); // Logging
    const year = new Date();
    res.locals.actualYear = year.getFullYear();
    res.locals.nombrepagina = 'Agencia de Viajes';
    // Podrías pasar aquí si el usuario está autenticado a las vistas
    // res.locals.userAuthenticated = req.session.authUser || false;
    next();
});

// Agregar body parser para leer los datos del formulario (después de la sesión)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Para poder procesar JSON si usas APIs

// Definir la carpeta pública (después de la sesión)
app.use(express.static(path.join(__dirname, 'public')));

// Crear carpetas para uploads si no existen
const uploadsDir = path.join(__dirname, 'public/uploads');
const viajesDir = path.join(uploadsDir, 'viajes');
const guiasDir = path.join(uploadsDir, 'guias');
const hotelesDir = path.join(uploadsDir, 'hoteles');

[uploadsDir, viajesDir, guiasDir, hotelesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (error) {
            console.error(`Error creando directorio ${dir}:`, error);
        }
    }
});

// --- ¡IMPORTANTE! Rutas de Admin ANTES de las rutas generales ---
app.use('/admin', adminRoutes);
console.log('>>>> Rutas de Admin (/admin) Cargadas'); // Logging

app.use('/', router);
console.log('>>>> Rutas Generales (/) Cargadas'); // Logging


// Middleware para manejo de errores (al final)
app.use((err, req, res, next) => {
    console.error('!!!! ERROR DETECTADO !!!!');
    console.error('Ruta:', req.path);
    console.error('Mensaje:', err.message);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).render('error', {
        pagina: 'Error Inesperado',
        mensaje: err.message || 'Ocurrió un error en el servidor.'
    });
});

// Middleware para errores 404 (justo antes del manejador de errores)
app.use((req, res, next) => {
  res.status(404).render('error', {
    pagina: 'No Encontrado',
    mensaje: 'La página que buscas no existe.'
  });
});


app.listen(port, () => {
    console.log(`El servidor está funcionando en ${process.env.BASE_URL}`);
});
