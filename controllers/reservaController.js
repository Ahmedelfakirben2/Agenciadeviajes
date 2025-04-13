import Reserva from '../models/Reserva.js';

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll();

        res.render('reservar', {
            reservas,
            pagina: 'Reservas'
        });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.render('error', { mensaje: 'Error al obtener las reservas' });
    }
};


const obtenerReservasAdmin = async (req, res) => {
    try {
        const reservas = await Reserva.findAll();

        res.render('admin/reservas', {
            reservas,
            pagina: 'Administración de Reservas'
        });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.render('error', { mensaje: 'Error al obtener las reservas' });
    }
};


export {
    obtenerReservas,
    obtenerReservasAdmin
}