import { Reserva } from '../models/Reserva.js';
import { Viaje } from '../models/Viaje.js';

const paginaReservar = async (req, res) => {
    const { slug } = req.params;

    try {
        const viaje = await Viaje.findOne({ where: { slug }});

        if(!viaje) {
            return res.redirect('/viajes');
        }

        res.render('reservar', {
            pagina: 'Reservar Viaje',
            viaje
        });
    } catch(error) {
        console.log(error);
    }
};

const guardarReserva = async (req, res) => {
    const { nombre, email, telefono, numero_personas, viaje_id } = req.body;
    const errores = [];

    // Validaciones
    if(nombre.trim() === '') {
        errores.push({mensaje: 'El nombre es obligatorio'});
    }
    if(email.trim() === '') {
        errores.push({mensaje: 'El email es obligatorio'});
    }
    if(telefono.trim() === '') {
        errores.push({mensaje: 'El teléfono es obligatorio'});
    }
    if(numero_personas <= 0) {
        errores.push({mensaje: 'El número de personas debe ser mayor a 0'});
    }

    if(errores.length > 0) {
        const viaje = await Viaje.findByPk(viaje_id);
        return res.render('reservar', {
            pagina: 'Reservar Viaje',
            errores,
            viaje,
            nombre,
            email,
            telefono,
            numero_personas
        });
    }

    try {
        await Reserva.create({
            nombre,
            email,
            telefono,
            numero_personas,
            viaje_id
        });

        // Actualizar plazas disponibles
        const viaje = await Viaje.findByPk(viaje_id);
        await viaje.update({
            disponibles: viaje.disponibles - numero_personas
        });

        res.redirect('/viajes');
    } catch(error) {
        console.log(error);
    }
};

export {
    paginaReservar,
    guardarReserva
};
