import { Hotel } from '../models/Hotel.js';

exports.obtenerHoteles = async (req, res) => {
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

exports.formularioCrearHotel = (req, res) => {
  res.render('admin/crear-hotel', {
    pagina: 'Crear Hotel'
  });
};

exports.crearHotel = async (req, res) => {
  try {
    await Hotel.create(req.body);
    res.redirect('/admin/hoteles');
  } catch (error) {
    console.log(error);
  }
};

exports.formularioEditarHotel = async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await Hotel.findByPk(id);
    res.render('admin/editar-hotel', {
      pagina: 'Editar Hotel',
      hotel
    });
  } catch (error) {
    console.log(error);
  }
};

exports.actualizarHotel = async (req, res) => {
  const { id } = req.params;
  try {
    await Hotel.update(req.body, {
      where: {
        id
      }
    });
    res.redirect('/admin/hoteles');
  } catch (error) {
    console.log(error);
  }
};

exports.eliminarHotel = async (req, res) => {
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