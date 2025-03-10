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

// Configurar variables de entorno
dotenv.config();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Establecer BASE_URL para las imágenes
const port = process.env.PORT || 4000;
process.env.BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Conectar la base de datos
db.authenticate()
    .then(() => console.log('Base de datos conectada'))
    .catch(error => {
        console.error('Error al conectar la base de datos:', error);
    });

// Forzar la sincronización de los modelos con la base de datos
db.sync({ force: true })
    .then(() => {
        console.log('Base de datos sincronizada. Todas las tablas han sido recreadas.');
        
        // Crear el guía turístico primero
        return GuiaTuristico.create({
            nombre: 'Juan',
            apellido: 'Pérez',
            email: 'juan@example.com',
            telefono: '+212 666-555-444',
            idiomas: 'Español, Inglés, Francés',
            experiencia_anos: 8,
            foto: 'guia1.jpg'
        });
    })
    .then(guia => {
        // Crear el hotel después del guía
        return Hotel.create({
            nombre: 'Hotel Riad Marrakech',
            direccion: 'Medina 123',
            ciudad: 'Marrakech',
            pais: 'Marruecos',
            estrellas: 5,
            telefono: '+212 524-555-666',
            email: 'info@riadmarrakech.com',
            sitio_web: 'https://riadmarrakech.com',
            imagen: 'hotel1.jpg',
            servicios: 'WiFi, Piscina, Spa, Restaurante, Servicio de habitaciones'
        }).then(hotel => {
            // Crear el viaje después de tener el guía y el hotel
            return Viaje.create({
                titulo: 'Viaje a Marrakech',
                precio: 2500,
                fecha_ida: '2025-03-15',
                fecha_vuelta: '2025-03-22',
                imagen: 'marrakech',
                descripcion: 'Descubre la magia de Marrakech en este viaje inolvidable.',
                disponibles: 15,
                slug: 'viaje-marrakech',
                itinerario: 'Día 1: Llegada y check-in en el hotel\nDía 2: Tour por la Medina y zocos\nDía 3: Visita a los Jardines Majorelle y la Mezquita Koutoubia\nDía 4: Excursión al desierto de Agafay\nDía 5: Día libre para compras y spa',
                puntos_itinerario: [
                    {
                        lat: 31.631794,
                        lng: -8.008889,
                        descripcion: 'Aeropuerto de Marrakech'
                    },
                    {
                        lat: 31.631111,
                        lng: -7.984167,
                        descripcion: 'Hotel Riad Marrakech'
                    },
                    {
                        lat: 31.628674,
                        lng: -7.989178,
                        descripcion: 'Medina y zocos'
                    },
                    {
                        lat: 31.641673,
                        lng: -8.003914,
                        descripcion: 'Jardines Majorelle'
                    },
                    {
                        lat: 31.625132,
                        lng: -7.989397,
                        descripcion: 'Mezquita Koutoubia'
                    },
                    {
                        lat: 31.464722,
                        lng: -8.166667,
                        descripcion: 'Desierto de Agafay'
                    }
                ],
                incluye: 'Vuelos, Hotel, Desayuno, Guía, Traslados, Tours mencionados en el itinerario',
                no_incluye: 'Comidas no especificadas, Propinas, Gastos personales',
                requisitos: 'Pasaporte vigente con al menos 6 meses de validez',
                punto_encuentro: 'Aeropuerto de Marrakech',
                guia_id: guia.id,
                hotel_id: hotel.id
            });
        });
    })
    .then(() => {
        console.log('Datos de ejemplo creados correctamente');
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });

// Establecer motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use((req, res, next) => {
    const year = new Date();
    res.locals.actualYear = year.getFullYear();
    res.locals.nombrepagina = 'Agencia de Viajes';
    next();
});

// Agregar body parser para leer los datos del formulario
app.use(express.urlencoded({ extended: true }));

// Definir la carpeta pública
app.use(express.static(path.join(__dirname, 'public')));

// Crear carpetas para uploads si no existen
const uploadsDir = path.join(__dirname, 'public/uploads');
const viajesDir = path.join(uploadsDir, 'viajes');
const guiasDir = path.join(uploadsDir, 'guias');
const hotelesDir = path.join(uploadsDir, 'hoteles');

[uploadsDir, viajesDir, guiasDir, hotelesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Agregar routers
app.use('/', router);
app.use('/admin', adminRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        pagina: 'Error',
        mensaje: err.message || 'Ocurrió un error inesperado'
    });
});

app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${process.env.BASE_URL}`);
});