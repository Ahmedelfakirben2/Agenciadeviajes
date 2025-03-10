import { Sequelize } from 'sequelize';
import db from '../config/db.js';

export const Reserva = db.define('reservas', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefono: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fecha_reserva: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    numero_personas: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    viaje_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
