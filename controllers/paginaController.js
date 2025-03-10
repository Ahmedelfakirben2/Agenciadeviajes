import { Viaje } from "../models/Viaje.js";
import { Testimonial } from '../models/Testimoniales.js';
import { GuiaTuristico } from '../models/GuiaTuristico.js';
import { Hotel } from '../models/Hotel.js';

const paginaInicio = async (req, res) => {
    const consultasDB = [];
    
    consultasDB.push(Viaje.findAll({limit: 3}))
    consultasDB.push(Testimonial.findAll({limit: 3}));

    try {
        const resultado = await Promise.all(consultasDB);

        res.render('inicio', {
            pagina: "Inicio",
            clase: 'home',
            viajes: resultado[0],
            testimoniales: resultado[1]
        });
    } catch (error) {
        console.log(error);
    }
}

const paginaNosotros = (req, res) => {
    res.render('nosotros', {pagina: 'Nosotros'});
}

const paginaViajes = async (req, res) => {
    const viajes = await Viaje.findAll({
        include: [
            { model: GuiaTuristico },
            { model: Hotel }
        ]
    });
    res.render('viajes', {pagina: 'Proximos Viajes', viajes});
}

const paginaTestimoniales = async (req, res) => {
    try {
        const testimoniales = await Testimonial.findAll();
        res.render('testimoniales', {pagina: 'Testimoniales', testimoniales});
    } catch(error) {
        console.log(error);
    }
}

// Muestra un viaje por su slug
const paginaDetalleViaje = async (req, res) => {
    const { viaje } = req.params;
    
    try {
        const resultado = await Viaje.findOne({
            where: { slug: viaje },
            include: [
                { model: GuiaTuristico },
                { model: Hotel }
            ]
        });

        if (!resultado) {
            return res.redirect('/viajes');
        }

        res.render('viaje', {
            pagina: 'Informacion Viaje',
            resultado
        });
    } catch(error) {
        console.log(error);
        res.redirect('/viajes');
    }
}

const guardarTestimonial = async (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    const errores = [];

    if(nombre.trim() === '') {
        errores.push({mensaje: 'El nombre está vacío'});
    }
    if(correo.trim() === '') {
        errores.push({mensaje: 'El correo está vacío'});
    }
    if(mensaje.trim() === '') {
        errores.push({mensaje: 'El mensaje está vacío'});
    }

    if(errores.length > 0) {
        const testimoniales = await Testimonial.findAll();
        res.render('testimoniales', {
            pagina: 'Testimoniales',
            errores,
            nombre,
            correo,
            mensaje,
            testimoniales
        });
    } else {
        try {
            await Testimonial.create({
                nombre,
                correo,
                mensaje
            });
            res.redirect('/testimoniales');
        } catch(error) {
            console.log(error);
        }
    }
}

export {
    paginaInicio,
    paginaNosotros,
    paginaViajes,
    paginaTestimoniales,
    paginaDetalleViaje,
    guardarTestimonial
};