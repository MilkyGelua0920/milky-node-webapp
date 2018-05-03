const Sequelize = require('sequelize')
const sequelize = new Sequelize({
	dialect: process.env.DB_CONNECTION || 'mysql',
	host: process.env.DB_HOST || '127.0.0.1',
	port: process.env.DB_PORT || '3306',
	username: process.env.DB_USERNAME || 'root',
	password: process.env.DB_PASSWORD || null,
	database: process.env.DB_DATABASE || 'milky'
})

sequelize.authenticate().then(() => {
	console.log('Connection has been established successfully.')
}).catch(err => {
	console.error('Unable to connect to the database:', err)
})

module.exports = sequelize