import { Sequelize } from 'sequelize';

export default new Sequelize({
    dialect:'mysql',
    host: 'localhost',
    port: 3306,
    database: 'gamifylife',
    username: 'root',
    password: '123456',
})