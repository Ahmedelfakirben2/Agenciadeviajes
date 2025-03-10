// controllers/viajeController.js
import { Viaje } from '../models/Viaje.js';
import { GuiaTuristico } from '../models/GuiaTuristico.js';
import { Hotel } from '../models/Hotel.js';
import slugify from 'slugify';

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

// Crear nuevo viaje
export const crearViaje = async (req, res) => {
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
      hotel_id 
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
    
    // Si se subió una imagen, usar la URL generada, si no, usar el nombre para la imagen por defecto
    const imagen = req.imageUrl || titulo.toLowerCase().replace(/\s+/g, '-');
    
    // Manejar puntos de itinerario (si se enviaron como JSON string)
    let puntos_itinerario = [];
    if (req.body.puntos_itinerario) {
      try {
        puntos_itinerario = JSON.parse(req.body.puntos_itinerario);
      } catch (error) {
        console.error('Error al parsear puntos_itinerario:', error);
      }
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
      hotel_id
    });
    
    res.redirect('/admin/viajes');
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {
      pagina: 'Error',
      mensaje: 'Error al crear el viaje'
    });
  }
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
  
  try {
    const viaje = await Viaje.findByPk(id);
    
    if (!viaje) {
      return res.status(404).render('error', {
        pagina: 'Viaje no encontrado',
        mensaje: 'El viaje que intentas actualizar no existe'
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
      
      return res.render('admin/editar-viaje', {
        pagina: `Editar Viaje: ${viaje.titulo}`,
        errores,
        viaje: {
          ...viaje.dataValues,
          ...req.body
        },
        guias,
        hoteles
      });
    }
    
    // Si hay una nueva imagen, usar su URL, de lo contrario mantener la anterior
    const imagen = req.imageUrl || viaje.imagen;
    
    // Actualizar el slug si el título cambió
    const slug = titulo !== viaje.titulo 
      ? slugify(titulo, { lower: true }) 
      : viaje.slug;
    
    // Manejar puntos de itinerario
    let puntos_itinerario = viaje.puntos_itinerario;
    if (req.body.puntos_itinerario) {
      try {
        puntos_itinerario = JSON.parse(req.body.puntos_itinerario);
      } catch (error) {
        console.error('Error al parsear puntos_itinerario:', error);
      }
    }
    
    // Actualizar el viaje
    await viaje.update({
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
      hotel_id
    });
    
    res.redirect('/admin/viajes');
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {
      pagina: 'Error',
      mensaje: 'Error al actualizar el viaje'
    });
  }
};

// Eliminar viaje
export const eliminarViaje = async (req, res) => {
  const { id } = req.params;
  
  try {
    const viaje = await Viaje.findByPk(id);
    
    if (!viaje) {
      return res.status(404).render('error', {
        pagina: 'Viaje no encontrado',
        mensaje: 'El viaje que intentas eliminar no existe'
      });
    }
    
    // Eliminar la imagen asociada si es una URL completa
    if (viaje.imagen.startsWith('http')) {
      const urlParts = new URL(viaje.imagen);
      const imagePath = urlParts.pathname;
      const fullPath = path.join(__dirname, '../public', imagePath);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    // Eliminar el viaje
    await viaje.destroy();
    
    res.redirect('/admin/viajes');
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {
      pagina: 'Error',
      mensaje: 'Error al eliminar el viaje'
    });
  }
};