import { GuiaTuristico } from '../models/GuiaTuristico.js';

exports.obtenerGuias = async (req, res) => {
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

exports.formularioCrearGuia = (req, res) => {
  res.render('admin/crear-guia', {
    pagina: 'Crear Guía Turístico'
  });
};

exports.crearGuia = async (req, res) => {
  try {
    await GuiaTuristico.create(req.body);
    res.redirect('/admin/guias');
  } catch (error) {
    console.log(error);
  }
};

exports.formularioEditarGuia = async (req, res) => {
  const { id } = req.params;
  try {
    const guia = await GuiaTuristico.findByPk(id);
    res.render('admin/editar-guia', {
      pagina: 'Editar Guía Turístico',
      guia
    });
  } catch (error) {
    console.log(error);
  }
};

exports.actualizarGuia = async (req, res) => {
  const { id } = req.params;
  try {
    await GuiaTuristico.update(req.body, {
      where: {
        id
      }
    });
    res.redirect('/admin/guias');
  } catch (error) {
    console.log(error);
  }
};

exports.eliminarGuia = async (req, res) => {
  const { id } = req.params;
  try {
    await GuiaTuristico.destroy({
      where: {
        id
      }
    });
    res.redirect('/admin/guias');
  } catch (error) {
    console.log(error);
  }
};