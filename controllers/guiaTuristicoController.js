// ----- INICIO DEL ARCHIVO controllers/guiaTuristicoController.js -----
import { GuiaTuristico } from '../models/GuiaTuristico.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
export const obtenerGuias = async (req, res) => {
  try {
    const guias = await GuiaTuristico.findAll();
    res.render('admin/guias', {
      pagina: 'Administración de Guías Turísticos',
      guias
    });
  } catch (error) {
    console.log(error);
  }
};

export const formularioCrearGuia = (req, res) => {
    res.render('admin/crear-guia', {
        pagina: 'Crear Guía Turístico'
    });
};

// Configuración de almacenamiento de multer
const storage = multer.diskStorage({
    destination: path.resolve('./public/uploads/guias'),
    filename:  (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

// Middleware de multer para un solo archivo 'foto'
const upload = multer({ storage }).single('foto');

export const crearGuia = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.render('admin/crear-guia', {
                pagina: 'Crear Guía Turístico',
                errores: [{msg: err.message}]
            });
        }

        let foto = '';
        if (req.file) {
            // Procesar la imagen con Sharp
            const uniqueFilename = req.file.filename;
            const imagePath = path.resolve('./public/uploads/guias', uniqueFilename);
            const resizedImagePath = path.resolve('./public/uploads/guias', `resized-${uniqueFilename}`);

            try {
                await sharp(req.file.path)
                    .resize(800, 600, {
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .toFile(resizedImagePath);

                // Eliminar la imagen original
                fs.unlinkSync(req.file.path);

                foto = `resized-${uniqueFilename}`; // Usar el nombre del archivo redimensionado
            } catch (error) {
                console.error("Error al procesar la imagen:", error);
                // Manejar el error apropiadamente, tal vez asignando una imagen por defecto
                foto = 'default.jpg'; // Asegurate de tener una imagen por defecto
            }
        } else {
            // Si no se sube imagen, usar una por defecto
            foto = 'default.jpg'; // Asegúrate de tener una imagen por defecto
        }

        try {
            await GuiaTuristico.create({
                ...req.body,
                foto
            });
            res.redirect('/admin/guias');
        } catch (error) {
            console.log(error)
            // Mostrar errores en el formulario
            return res.render('admin/crear-guia', {
                pagina: 'Crear Guía Turístico',
                errores: [{ msg: 'Hubo un error al guardar el guía turístico' }],
                values: req.body // Mantener los valores del formulario
            });
        }
    });
};












export const formularioEditarGuia = async (req, res) => {
    const { id } = req.params;
    try {
        const guia = await GuiaTuristico.findByPk(id);
        // Validar si el guía existe
        if (!guia) {
            return res.redirect('/admin/guias'); // O mostrar un mensaje de error
        }
        res.render('admin/editar-guia', {
            pagina: 'Editar Guía Turístico',
            guia
        });
    } catch (error) {
        console.log(error);
        return res.redirect('/admin/guias'); // Redirigir en caso de error
    }
};

export const actualizarGuia = async (req, res) => {
  const { id } = req.params;
  try {
    // Primero, verificar si el guía existe
    const guia = await GuiaTuristico.findByPk(id);
    if (!guia) {
      return res.redirect('/admin/guias'); // O manejar el error
    }

    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        // En un caso real, podrías mostrar un mensaje de error al usuario
        // y renderizar el formulario de edición con los datos actuales y el error.
        return res.redirect('/admin/guias'); // O manejar el error apropiadamente
      }

      let foto = guia.foto; // Mantener la foto actual por defecto

      if (req.file) {
        // Procesar la imagen con Sharp
          const uniqueFilename = req.file.filename;
          const imagePath = path.resolve('./public/uploads/guias', uniqueFilename);
          const resizedImagePath = path.resolve('./public/uploads/guias', `resized-${uniqueFilename}`);
          
        try {
          await sharp(req.file.path)
            .resize(800, 600, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .toFile(resizedImagePath);

            // Eliminar la imagen original y la anterior si existe
          fs.unlinkSync(req.file.path);
          if (guia.foto && guia.foto !== 'default.jpg') {
            const oldImagePath = path.resolve('./public/uploads/guias', guia.foto);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            } else {
              console.warn(`Imagen anterior no encontrada en: ${oldImagePath}`);
            }
          }

          foto = `resized-${uniqueFilename}`; // Usar el nombre del archivo redimensionado
        } catch (error) {
          console.error("Error al procesar la imagen:", error);
          // Manejar el error apropiadamente, tal vez manteniendo la imagen anterior o asignando una por defecto
        }
      }

      try {
        await guia.update({
          ...req.body,
          foto
        });
        res.redirect('/admin/guias');
      } catch (error) {
        console.log(error);
        return res.redirect('/admin/guias'); // O manejar el error apropiadamente
      }
    });
  } catch (error) {
    console.log(error);
    // Considera renderizar la misma página de edición con un mensaje de error
    // en lugar de solo redirigir, para no perder los datos del formulario.
    // Por ahora, redirigimos:
    return res.redirect('/admin/guias');
  }
};

export const eliminarGuia = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si existe antes de intentar borrar
    const guia = await GuiaTuristico.findByPk(id);
    if (!guia) {
      // Puedes enviar una respuesta 404 o simplemente redirigir
      return res.status(404).redirect('/admin/guias?error=notfound');
    }

    await guia.destroy(); // O GuiaTuristico.destroy({ where: { id } })

    res.redirect('/admin/guias');
  } catch (error) {
      console.log(error);
    // Redirigir con un mensaje de error podría ser útil
    return res.redirect('/admin/guias?error=deletefailed');
  }
};
// ----- FIN DEL ARCHIVO controllers/guiaTuristicoController.js -----