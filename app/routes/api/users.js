const express = require('express')
const passport = require('passport')

const router = express.Router()

const usersController = require('./../../controllers/api/users.js')

router.route('/')
	.get(
	(req, res, next) => {
		passport.authenticate(['user-basic', 'bearer'], {
			session: false
		}, (err, user, info) => {
			console.log('user:: ', user)
			console.log('info:: ', info)
			if (err) {
				next(err)
				return
			}
			if (!user) {
				res.sendStatus(401)
				return
			}
			req.login(user, (err) => {
				if (err) {
					next(err)
					return
				}
				next()
			})
		})(req, res, next)
	},
	usersController.getUsers)
	.post(usersController.postUsers)

module.exports = router