const express = require('express')

const router = express.Router()

const passport = require('passport')
const oAuth2Server = require('./../controllers/oauth2.js')

const OAuthClient = require('./../models/OAuthClient.js')

router.route('/authorize').get((req, res, next) => {
	if (req.isAuthenticated()) {
		next()
		return
	}
	req.session.returnTo = req.originalUrl
	res.redirect('/login')
}, oAuth2Server.authorization((clientId, redirectUri, done) => {
	OAuthClient.findOne({
		where: {
			id: clientId
		},
		attributes: [
			'id',
			'name'
		]
	}).then((oAuthClient) => {
		done(null, oAuthClient, redirectUri)
	}).catch((err) => {
		done(err)
	})
}), (req, res) => {
	res.render('oauth2_dialog', {
		user: req.user,
		client: req.oauth2.client,
		transactionID: req.oauth2.transactionID
	})
}).post((req, res, next) => {
	if (req.isAuthenticated()) {
		next()
		return
	}
	req.session.returnTo = req.originalUrl
	res.redirect('/login')
}, oAuth2Server.decision())

router.route('/token').post(
// (req, res, next) => {
// 	console.log('post token', req.body)
// 	next()
// 	passport.authenticate('client-basic', {
// 		session: false
// 	}, (err, client, info) => {

// 	})(req, res, next)
// },
passport.authenticate('client-basic', {
	session : false
}),
oAuth2Server.token(), oAuth2Server.errorHandler())

module.exports = router