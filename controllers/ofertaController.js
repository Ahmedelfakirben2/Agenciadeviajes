import { Oferta } from '../models/Oferta.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';


// Obtener todas las ofertas
export const obtenerOfertas = async (req, res) => {
    try {
        let ofertas = await Oferta.findAll();
        for (const oferta of ofertas) {
          if (!oferta.imagen) {
            oferta.imagen = [];
          }
        }
        res.render('admin/ofertas/ofertas', {
            pagina: 'Administrar Ofertas',
            ofertas,
        });
    } catch (error) {
        console.error("Error al obtener ofertas:", error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Error al cargar las ofertas'
        }, console.error("Error al obtener ofertas:", error));
    }
};

// Formulario para crear oferta
export const formularioCrearOferta = (req, res) => {
    res.render('admin/ofertas/crear-oferta', {
        pagina: 'Crear Nueva Oferta'
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
}).single('imagen'); // 'imagen' es el nombre del campo


// Crear nueva oferta
export const crearOferta = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error al subir imágenes:", err);
        return res.render('admin/ofertas/crear-oferta', {
            pagina: 'Crear Nueva Oferta',
            errores: [{ msg: err.message }],
        });
      }
        try {
            // Extraer la información
            const { anuncio } = req.body;

            // Validar campos requeridos
            const errores = [];
            if (!anuncio) errores.push({mensaje: 'El anuncio es obligatorio'});

            // Si hay errores, volver a mostrar el formulario
            if (errores.length > 0) {
                return res.render('admin/ofertas/crear-oferta', {
                    pagina: 'Crear Nueva Oferta',
                    errores,
                    oferta: req.body
                });
            }

            let imagen = ''; // Declarar imagen aquí
            const uploadsDir = path.join(path.resolve(), 'public', 'uploads', 'ofertas');


            try {
                // Verificar si el directorio existe y crearlo si no
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }

                if(req.file){
                  const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(req.file.originalname)}`;
                  const filePath = path.join(uploadsDir, uniqueFilename);
      
                  await sharp(req.file.buffer)
                  .resize({ width: 800, height: 600, fit: 'inside' })
                  .toFile(filePath);
      
                  imagen = `/uploads/ofertas/${uniqueFilename}`;
                } 
            } catch (error) {
                console.error("Error processing images:", error);
            }

            // Validar que se haya subido una imagen
            if (!imagen) {
                errores.push({ mensaje: 'Debes subir una imagen para la oferta' });
            }

            if (errores.length > 0) {
                return res.render('admin/ofertas/crear-oferta', {
                    pagina: 'Crear Nueva Oferta',
                    errores,
                    oferta: req.body
                });
            }
            // Crear la oferta
            await Oferta.create({
                imagen,
                anuncio
            });

            res.redirect('/admin/ofertas');
        } catch (error) {
            console.error("Error al crear la oferta:", error);
            return res.render('admin/ofertas/crear-oferta', {
                pagina: 'Crear Nueva Oferta',
                errores: [{ msg: 'Error al guardar la oferta. Por favor, intenta de nuevo.' }],
                oferta: req.body
            });
        }
    });
};

// Formulario para editar oferta
export const formularioEditarOferta = async (req, res) => {
    const { id } = req.params;
    try {
        const oferta = await Oferta.findByPk(id);
        if (!oferta) {
            return res.status(404).render('error', {
                pagina: 'Oferta no encontrada',
                mensaje: 'La oferta que intentas editar no existe'
            });
        }
        res.render('admin/ofertas/editar-oferta', {
            pagina: `Editar Oferta: ${oferta.anuncio}`,
            oferta
        });
    } catch (error) {
        console.error("Error al cargar el formulario de edición:", error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Ocurrió un error al cargar el formulario'
        });
    }
};

// Actualizar oferta
export const actualizarOferta = async (req, res) => {
    const { id } = req.params;
      upload(req, res, async (err) => {
        if (err) {
          console.error("Error al subir imágenes:", err);
          // Considera cómo manejar los errores en la actualización (e.g., mostrar un mensaje al usuario)
          // Por ahora, redirigimos de vuelta con un mensaje de error
          return res.redirect('/admin/ofertas');
        }
    
        try {
            const oferta = await Oferta.findByPk(id);
            if (!oferta) {
              return res.status(404).render('error', {
                pagina: 'Oferta no encontrada',
                mensaje: 'Oferta no encontrada'
              });
            }

            // Extraer la información
            const { anuncio } = req.body;

            // Actualizar oferta con la imagen
            let imagen = oferta.imagen;

            if(req.file){
              const uploadsDir = path.join(path.resolve(), 'public', 'uploads', 'ofertas');
              
              // Verificar si el directorio existe y crearlo si no
              if (!fs.existsSync(uploadsDir)) {
                  fs.mkdirSync(uploadsDir, { recursive: true });
              }

              const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(req.file.originalname)}`;
              const filePath = path.join(uploadsDir, uniqueFilename);

              await sharp(req.file.buffer)
                  .resize({ width: 800, height: 600, fit: 'inside' })
                  .toFile(filePath);
                  
              imagen = `/uploads/ofertas/${uniqueFilename}`;

            }
        
            await oferta.update({
              anuncio,
              imagen // Guarda la imagen
            });
            
            res.redirect('/admin/ofertas');
        } catch (error) {
            console.error("Error al actualizar oferta:", error);
            // Considera cómo manejar los errores (e.g., mostrar un mensaje al usuario)
            res.redirect('/admin/ofertas');
        }
      });
};

// Eliminar oferta
export const eliminarOferta = async (req, res) => {
    const { id } = req.params;
    try {
        const oferta = await Oferta.findByPk(id);
        if (!oferta) {
            return res.status(404).render('error', {
                pagina: 'Oferta no encontrada',
                mensaje: 'La oferta que intentas eliminar no existe'
            });
        }
        await oferta.destroy();
        res.redirect('/admin/ofertas');
    } catch (error) {
        console.error("Error al eliminar oferta:", error);
        res.status(500).render('error', {
            pagina: 'Error',
            mensaje: 'Error al eliminar la oferta'
        });
    }
};