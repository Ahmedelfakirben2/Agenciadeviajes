import { Sequelize } from 'sequelize';
import db from '../config/db.js';

const Oferta = db.define('ofertas', {
    imagen: {
        type: Sequelize.STRING,
        allowNull: false
    },
    anuncio: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

export { Oferta };