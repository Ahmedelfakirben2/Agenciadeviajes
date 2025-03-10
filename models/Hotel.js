import { Sequelize } from 'sequelize';
import db from '../config/db.js';

export const Hotel = db.define('hoteles', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ciudad: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pais: {
        type: Sequelize.STRING,
        allowNull: false
    },
    estrellas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    telefono: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    sitio_web: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imagen: {
        type: Sequelize.STRING,
        allowNull: true
    },
    servicios: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});
