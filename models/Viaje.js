import { Sequelize } from 'sequelize';
import db from '../config/db.js';
import { GuiaTuristico } from './GuiaTuristico.js';
import { Hotel } from './Hotel.js';

const Viaje = db.define('viajes', {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    precio: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    fecha_ida: {
        type: Sequelize.DATE,
        allowNull: false
    },
    fecha_vuelta: {
        type: Sequelize.DATE,
        allowNull: false
    },
    imagen: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    disponibles: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    itinerario: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    puntos_itinerario: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('puntos_itinerario');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('puntos_itinerario', JSON.stringify(value));
        }
    },
    incluye: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    no_incluye: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    requisitos: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    punto_encuentro: {
        type: Sequelize.STRING,
        allowNull: true
    },
    guia_id: {
        type: Sequelize.INTEGER,
        references: {
            model: GuiaTuristico,
            key: 'id'
        }
    },
    hotel_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Hotel,
            key: 'id'
        }
    }
});

// Establecer las relaciones
Viaje.belongsTo(GuiaTuristico, { foreignKey: 'guia_id' });
Viaje.belongsTo(Hotel, { foreignKey: 'hotel_id' });

export { Viaje };
