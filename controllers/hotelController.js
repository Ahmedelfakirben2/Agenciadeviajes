import { Hotel } from '../models/Hotel.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';


// Ya estaba bien:
export const obtenerHoteles = async (req, res) => {
  try {
    const hoteles = await Hotel.findAll();
    res.render('admin/hoteles', {
      pagina: 'Administración de Hoteles',
      hoteles
    });
  } catch (error) {
    console.log(error);
  }
};

export const formularioCrearHotel = (req, res) => {
  res.render('admin/crear-hotel', {
    pagina: 'Crear Hotel'
  });
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

export const crearHotel = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al subir imágenes:", err);
      return res.render('admin/crear-hotel', {
        pagina: 'Crear Hotel',
        errores: [{ msg: err.message }]
      });
    }

    const { nombre, descripcion, direccion, ciudad, pais, estrellas, telefono, email, sitio_web, servicios } = req.body;

    let imagenes = [];

    if (req.files && req.files.length > 0) {
      const uploadsDir = path.join(path.resolve(), 'public', 'uploads', 'hoteles');

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

        return `/uploads/hoteles/${uniqueFilename}`; // Ruta relativa para guardar en la base de datos
      }));
    }

    try {
      await Hotel.create({
        nombre,
        descripcion,
        imagenes, // Guarda el array de URLs o un array vacío
        direccion,
        ciudad,
        pais,
        estrellas,
        telefono,
        email,
        sitio_web,
        servicios
      });
      res.redirect('/admin/hoteles');
    } catch (error) {
      console.error("Error al crear hotel:", error);
      return res.render('admin/crear-hotel', {
        pagina: 'Crear Hotel',
        errores: [{ msg: 'Error al guardar el hotel. Por favor, intenta de nuevo.' }]
      });
    }
  });
};

export const formularioEditarHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) {
      return res.status(404).render('error', {
        pagina: 'Error',
        mensaje: 'Hotel no encontrado'
      });
    }
    res.render('admin/editar-hotel', {
      pagina: 'Editar Hotel',
      hotel,
    });
  } catch (error) {
    console.log(error);
  }
};

export const actualizarHotel = async (req, res) => {
  const { id } = req.params;
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error al subir imágenes:", err);
      // Considera cómo manejar los errores en la actualización (e.g., mostrar un mensaje al usuario)
      // Por ahora, redirigimos de vuelta con un mensaje de error
      return res.redirect('/admin/hoteles');
    }

    try {
      const hotel = await Hotel.findByPk(id);
      if (!hotel) {
        return res.status(404).render('error', {
          pagina: 'Error',
          mensaje: 'Hotel no encontrado'
        });
      }

      const { nombre, descripcion, direccion, ciudad, pais, estrellas, telefono, email, sitio_web, servicios } = req.body;

      let imagenes = hotel.imagenes || []; // Mantiene las imágenes existentes

      if (req.files && req.files.length > 0) {
        const uploadsDir = path.join(path.resolve(), 'public', 'uploads', 'hoteles');

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

          return `/uploads/hoteles/${uniqueFilename}`;
        }));

        imagenes = imagenes.concat(nuevasImagenes); // Añade las nuevas imágenes a las existentes
      }

      await hotel.update({
        nombre,
        descripcion,
        imagenes, // Guarda el array actualizado
        direccion,
        ciudad,
        pais,
        estrellas,
        telefono,
        email,
        sitio_web,
        servicios
      });

      res.redirect('/admin/hoteles');
    } catch (error) {
      console.error("Error al actualizar hotel:", error);
      // Considera cómo manejar los errores (e.g., mostrar un mensaje al usuario)
      res.redirect('/admin/hoteles');
    }
  });
};

export const eliminarHotel = async (req, res) => {
  const { id } = req.params;
  try {
    await Hotel.destroy({
      where: {
        id
      }
    });
    res.redirect('/admin/hoteles');
  } catch (error) {
    console.log(error);
  }
};