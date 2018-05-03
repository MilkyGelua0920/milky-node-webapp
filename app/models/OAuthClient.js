const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const OAuthClient = sequelize.define('oauth_client', {
	id: {
		type: Sequelize.BIGINT(11).UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	secret: {
		type: Sequelize.STRING(100),
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	underscored: true
})

OAuthClient.setRelations = (models) => {
	OAuthClient.User = OAuthClient.belongsTo(models.user, {
		as: 'user',
		foreignKey: {
			name: 'user_id',
			allowNull: false,
			unique: true
		},
		targetKey: 'id'
	})

	OAuthClient.OAuthCodes = OAuthClient.hasMany(models.oauth_code, {
		as: 'oauth_codes',
		foreignKey: {
			name: 'oauth_client_id',
			allowNull: false
		}
	})

	OAuthClient.OAuthTokens = OAuthClient.hasMany(models.oauth_token, {
		as: 'oauth_tokens',
		foreignKey: {
			name: 'oauth_client_id',
			allowNull: false
		}
	})
}

module.exports= OAuthClient