// controllers/viajeController.js
import { Viaje } from '../models/Viaje.js';
import { GuiaTuristico } from '../models/GuiaTuristico.js';
import { Hotel } from '../models/Hotel.js';
import slugify from 'slugify';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';

// Obtener todos los viajes
export const obtenerViajes = async (req, res) => {
  try {
    const viajes = await Viaje.findAll({
      include: [
        { model: GuiaTuristico },
        { model: Hotel }
      ]
    });
    
    res.render('admin/viajes', {
      pagina: 'Administrar Viajes',
      viajes
    });
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {
      pagina: 'Error',
      mensaje: 'Error al cargar los viajes'
    });
  }
};

// Formulario para crear viaje
export const formularioCrearViaje = async (req, res) => {
  try {
    // Obtener todos los guías y hoteles para los selects
    const [guias, hoteles] = await Promise.all([
      GuiaTuristico.findAll(),
      Hotel.findAll()
    ]);
    
    res.render('admin/crear-viaje', {
      pagina: 'Crear Nuevo Viaje',
      guias,
      hoteles
    });
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {
      pagina: 'Error',
      mensaje: 'Error al cargar el formulario'
    });
  }
};

// Configuración de Multer para la subida de imágenes
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)'));
    }
  }
}).array('imagenes', 10); // 'imagenes' es el nombre del campo, máximo 10 archivos

// Crear nuevo viaje
export const crearViaje = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al subir imágenes:", err);
      const [guias, hoteles] = await Promise.all([
        GuiaTuristico.findAll(),
        Hotel.findAll()
      ]);
      return res.render('admin/crear-viaje', {
        pagina: 'Crear Nuevo Viaje',
        errores: [{ msg: err.message }],
        guias,
        hoteles
      });
    }
  try {
        // Extraer la información
        const {
      titulo,
      precio,
      fecha_ida,
      fecha_vuelta,
      descripcion,
      disponibles,
      itinerario,
      incluye,
      no_incluye,
      requisitos,
      punto_encuentro,
      guia_id,
      hotel_id,
      puntos_itinerario // Extraer puntos_itinerario
        } = req.body;
        
        // Validar campos requeridos
        const errores = [];
        if (!titulo) errores.push({mensaje: 'El título es obligatorio'});
        if (!precio) errores.push({mensaje: 'El precio es obligatorio'});
        if (!fecha_ida) errores.push({mensaje: 'La fecha de ida es obligatoria'});
        if (!fecha_vuelta) errores.push({mensaje: 'La fecha de vuelta es obligatoria'});
        if (!descripcion) errores.push({mensaje: 'La descripción es obligatoria'});
        if (!disponibles) errores.push({mensaje: 'Las plazas disponibles son obligatorias'});
        
        // Si hay errores, volver a mostrar el formulario
        if (errores.length > 0) {
          const [guias, hoteles] = await Promise.all([
            GuiaTuristico.findAll(),
            Hotel.findAll()
          ]);
          
          return res.render('admin/crear-viaje', {
            pagina: 'Crear Nuevo Viaje',
            errores,
            guias,
            hoteles,
            viaje: req.body
          });
        }
        
        // Crear el slug
        const slug = slugify(titulo, { lower: true });
        
        let imagenes = [];

        if (req.files && req.files.length > 0) {
          const uploadsDir = path.join(path.resolve(), 'public', 'uploads', 'viajes');

          // Verificar si el directorio existe y crearlo si no
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          imagenes = await Promise.all(req.files.map(async (file) => {
            const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadsDir, uniqueFilename);

            await sharp(file.buffer)
              .resize({ width: 800, height: 600, fit: 'inside' })
              .toFile(filePath);

            return `/uploads/viajes/${uniqueFilename}`; // Ruta relativa para guardar en la base de datos
          }));
        }

        // Crear el viaje
        await Viaje.create({
      titulo,
      precio,
      fecha_ida,
      fecha_vuelta,
      imagen,
      descripcion,
      disponibles,
      slug,
      itinerario,
      puntos_itinerario,
      incluye,
      no_incluye,
      requisitos,
      punto_encuentro,
      guia_id,
      hotel_id,
      imagenes
        });

        res.redirect('/admin/viajes');
      } catch (error) {
        console.log(error);
        return res.render('admin/crear-viaje', {
          pagina: 'Crear Nuevo Viaje',
          errores: [{ msg: 'Error al guardar el viaje. Por favor, intenta de nuevo.' }],
          // Asegúrate de que guias y hoteles están definidos incluso en caso de error
          ... (await Promise.all([GuiaTuristico.findAll(), Hotel.findAll()]).then(([guias, hoteles]) => ({ guias, hoteles }))),
          viaje: req.body
        });
      }
    });
};

// Formulario para editar viaje
export const formularioEditarViaje = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obtener el viaje a editar y todos los guías y hoteles
    const [viaje, guias, hoteles] = await Promise.all([
      Viaje.findByPk(id),
      GuiaTuristico.findAll(),
      Hotel.findAll()
    ]);
    
    if (!viaje) {
      return res.status(404).render('error', {
        pagina: 'Viaje no encontrado',
        mensaje: 'El viaje que intentas editar no existe'
      });
    }
    
    res.render('admin/editar-viaje', {
      pagina: `Editar Viaje: ${viaje.titulo}`,
      viaje,
      guias,
      hoteles
    });
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {
      pagina: 'Error',
      mensaje: 'Ocurrió un error al cargar el formulario'
    });
  }
};


// Actualizar viaje
export const actualizarViaje = async (req, res) => {
  const { id } = req.params;
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al subir imágenes:", err);
      // Considera cómo manejar los errores en la actualización (e.g., mostrar un mensaje al usuario)
      // Por ahora, redirigimos de vuelta con un mensaje de error
      return res.redirect('/admin/viajes');
    }
  
  try {
    const viaje = await Viaje.findByPk(id);
      if (!viaje) {
        return res.status(404).render('error', {
          pagina: 'Viaje no encontrado',
          mensaje: 'Viaje no encontrado'
        });
      }
      
      // Extraer la información
      const {
        titulo,
        precio,
        fecha_ida,
        fecha_vuelta,
        descripcion,
        disponibles,
        itinerario,
        incluye,
        no_incluye,
        requisitos,
        punto_encuentro,
        guia_id,
        hotel_id
      } = req.body;
      
      let imagenes = viaje.imagenes || []; // Mantiene las imágenes existentes
      
      if (req.files && req.files.length > 0) {
        const uploadsDir = path.join(path.resolve(), 'public', 'uploads', 'viajes');
          
          // Verificar si el directorio existe y crearlo si no
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          const nuevasImagenes = await Promise.all(req.files.map(async (file) => {
            const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadsDir, uniqueFilename);
              
              await sharp(file.buffer)
              .resize({ width: 800, height: 600, fit: 'inside' })
              .toFile(filePath);
              
              return `/uploads/viajes/${uniqueFilename}`;
            }));
            
            imagenes = imagenes.concat(nuevasImagenes); // Añade las nuevas imágenes a las existentes
          }
          
          await viaje.update({
            titulo,
            precio,
            fecha_ida,
            fecha_vuelta,
            descripcion,
            disponibles,
            itinerario,
            incluye,
            no_incluye,
            requisitos,
            punto_encuentro,
            guia_id,
            hotel_id,
            imagenes // Guarda el array actualizado
          });
          
          res.redirect('/admin/viajes');
        } catch (error) {
          console.error("Error al actualizar viaje:", error);
          // Considera cómo manejar los errores (e.g., mostrar un mensaje al usuario)
          res.redirect('/admin/viajes');
        }
  });
};

// Eliminar viaje
export const eliminarViaje = async (req, res) => {
  const { id } = req.params;
  
  try {
    const viaje = await Viaje.findByPk(id);
    
    if (!viaje) {
      return res.status(404).render('error', {
        pagina: 'Viaje no encontrado',
        mensaje: 'El viaje que intentas actualizar no existe'
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {
      pagina: 'Error',
      mensaje: 'Error al actualizar el viaje'
    });
  }
};