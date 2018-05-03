const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const User = sequelize.define('user', {
	id: {
		type: Sequelize.BIGINT(11).UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	email: {
		type: Sequelize.STRING(100),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: Sequelize.STRING(100),
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	underscored: true
})

User.setRelations = (models) => {
	User.Person = User.belongsTo(models.person, {
		as: 'person',
		foreignKey: {
			name: 'person_id',
			allowNull: false,
			unique: true
		},
		targetKey: 'id'
	})

	User.OAuthClients = User.hasMany(models.oauth_client, {
		as: 'oauth_clients',
		foreignKey: {
			name: 'user_id',
			allowNull: false
		}
	})

	User.OAuthTokens = User.hasMany(models.oauth_token, {
		as: 'oauth_tokens',
		foreignKey: {
			name: 'user_id',
			allowNull: false
		}
	})
}

module.exports= User