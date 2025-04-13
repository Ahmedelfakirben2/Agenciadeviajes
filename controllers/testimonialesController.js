import Testimonial from '../models/Testimoniales.js';

const paginaTestimoniales = async (req, res) => {
    try {
        const testimoniales = await Testimonial.findAll();

        res.render('testimoniales', {
            testimoniales,
            pagina: 'Testimoniales'
        });
    } catch (error) {
        console.error('Error al obtener los testimoniales:', error);
        res.render('error', { mensaje: 'Error al obtener los testimoniales' });
    }
};

const paginaTestimonialesAdmin = async (req, res) => {
    try {
        const testimoniales = await Testimonial.findAll();

        res.render('admin/testimoniales', {
            testimoniales,
            pagina: 'Administración de Testimoniales'
        });
    } catch (error) {
        console.error('Error al obtener los testimoniales:', error);
        res.render('error', { mensaje: 'Error al obtener los testimoniales' });
    }
};


const crearTestimonial = async (req, res) => {

    const errores = [];

    const { nombre, correo, mensaje } = req.body;

    if(nombre === ''){
        errores.push({ mensaje: 'Agrega tu Nombre' });
    }
    if(correo === ''){
        errores.push({ mensaje: 'Agrega tu Correo' });
    }
    if(mensaje === ''){
        errores.push({ mensaje: 'Agrega tu Mensaje' });
    }

    // Revisar por errores
    if(errores.length > 0) {

        // Consultar Testimoniales Existentes
        const testimoniales = await Testimonial.findAll();

        // Mostrar la vista con errores
        res.render('testimoniales', {
            pagina: 'Testimoniales',
            errores,
            nombre,
            correo,
            mensaje,
            testimoniales
        });
    } else {
        // Almacenarlo en la base de datos
        try {
            await Testimonial.create({
                nombre,
                correo,
                mensaje
            });

            res.redirect('/testimoniales');
        } catch (error) {
            console.log(error)
        }
    }

}

export { paginaTestimoniales, crearTestimonial, paginaTestimonialesAdmin };