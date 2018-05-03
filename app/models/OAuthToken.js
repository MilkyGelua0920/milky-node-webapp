const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const OAuthToken = sequelize.define('oauth_token', {
	id: {
		type: Sequelize.BIGINT(11).UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	value: {
		type: Sequelize.STRING(100),
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	underscored: true
})

OAuthToken.setRelations = (models) => {
	OAuthToken.User = OAuthToken.belongsTo(models.user, {
		as: 'user',
		foreignKey: {
			name: 'user_id',
			allowNull: false
		},
		targetKey: 'id'
	})
	
	OAuthToken.Client = OAuthToken.belongsTo(models.oauth_client, {
		as: 'oauth_client',
		foreignKey: {
			name: 'oauth_client_id',
			allowNull: false
		},
		targetKey: 'id'
	})
}

module.exports= OAuthToken