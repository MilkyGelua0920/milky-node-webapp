const oauth2orize = require('oauth2orize')
const sequelize = require('./../sequelize.js')

const User = require('./../models/User.js')
const OAuthClient = require('./../models/OAuthClient.js')
const OAuthCode = require('./../models/OAuthCode.js')
const OAuthToken = require('./../models/OAuthToken.js')

const server = oauth2orize.createServer()

function uid(len) {
	let buf = []
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let charlen = chars.length
	for (let i = 0; i < len; ++i) {
		buf.push(chars[getRandomInt(0, charlen - 1)]);
	}
	return buf.join('')
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

server.serializeClient((client, done) => {
	done(null, client.id)
})

server.deserializeClient((id, done) => {
	OAuthClient.findById(id, {
		attributes: [
			'id',
			'name'
		],
		include: [
			{
				association: OAuthClient.User,
				attributes: [
					'id',
					'email'
				]
			}
		]
	}).then((client) => {
		done(null, client)
	}).catch((err) => {
		done(err)
	})
})

server.grant(oauth2orize.grant.code((oauth_client, redirectUri, user, ares, done) => {
	OAuthCode.create({
		value: uid(16),
		redirect_uri: redirectUri,
		user_id: user.id,
		oauth_client_id: oauth_client.id
	}).then((oAuthCode) => {
		done(null, oAuthCode.value)
	}).catch((err) => {
		done(err)
	})
}))

server.exchange(oauth2orize.exchange.code((oauth_client, code, redirectUri, done) => {

	async function createOAuthToken() {

		const transaction = await sequelize.transaction()

		let oAuthCode = await OAuthCode.findOne({
			where: {
				value: code
			},
			attributes: [
				'id',
				'value',
				'redirect_uri'
			],
			include: [
				{
					association: OAuthCode.User,
					attributes: [
						'id',
						'email'
					]
				},
				{
					association: OAuthCode.OAuthClient,
					attributes: [
						'id',
						'name'
					]
				}
			],
			transaction
		})

		if (!oAuthCode ||
			oAuthCode.oauth_client.id !== oauth_client.id ||
			oAuthCode.redirect_uri !== redirectUri
		) {
			await transaction.commit()
			return false
		}

		await OAuthCode.destroy({
			where: {
				id: oAuthCode.id
			},
			transaction
		})

		let oAuthToken = await OAuthToken.create({
			value: uid(100),
			user_id: oAuthCode.user.id,
			oauth_client_id: oAuthCode.oauth_client.id
		})

		await transaction.commit()
		return oAuthToken
	}

	createOAuthToken().then((oAuthToken) => {
		done(null, oAuthToken.value)
	}).catch((err) => {
		done(err)
	})

}))

module.exports = server