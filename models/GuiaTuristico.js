import { Sequelize } from 'sequelize';
import db from '../config/db.js';

const GuiaTuristico = db.define('guias_turisticos', {
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellido: {
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
    telefono: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idiomas: {
        type: Sequelize.STRING,
        allowNull: false
    },
    experiencia_anos: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    foto: {
        type: Sequelize.STRING,
        allowNull: true
    }});
export { GuiaTuristico };
export { GuiaTuristico };
