// ----- INICIO DEL ARCHIVO controllers/guiaTuristicoController.js -----
import { GuiaTuristico } from '../models/GuiaTuristico.js';

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

export const crearGuia = async (req, res) => {
  try {
    await GuiaTuristico.create(req.body);
    res.redirect('/admin/guias');
  } catch (error) {
    console.log(error);
  }
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

    // Actualizar el guía
    await guia.update(req.body); // O GuiaTuristico.update(req.body, { where: { id } })

    res.redirect('/admin/guias');
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