const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const OAuthCode = sequelize.define('oauth_code', {
	id: {
		type: Sequelize.BIGINT(11).UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	value: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	redirect_uri: {
		type: Sequelize.STRING(100),
		allowNull: false
	}
}, {
	timestamps: true,
	paranoid: true,
	underscored: true
})

OAuthCode.setRelations = (models) => {
	OAuthCode.User = OAuthCode.belongsTo(models.user, {
		as: 'user',
		foreignKey: {
			name: 'user_id',
			allowNull: false
		},
		targetKey: 'id'
	})
	
	OAuthCode.OAuthClient = OAuthCode.belongsTo(models.oauth_client, {
		as: 'oauth_client',
		foreignKey: {
			name: 'oauth_client_id',
			allowNull: false
		},
		targetKey: 'id'
	})
}

module.exports= OAuthCode