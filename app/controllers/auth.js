const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const BasicStrategy = require('passport-http').BasicStrategy
const BearerStrategy = require('passport-http-bearer').Strategy

const sequelize = require('./../sequelize.js')

const User = require('./../models/User.js')
const Person = require('./../models/Person.js')
const OAuthClient = require('./../models/OAuthClient.js')
const OAuthToken = require('./../models/OAuthToken.js')

const authController = {}

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser((id, done) => {
	User.findById(id, {
		attributes: [
			'id',
			'email'
		],
		include: [
			{
				association: User.Person,
				attributes: [
					'id',
					'first_name',
					'middle_name',
					'last_name',
					'gender',
					'civil_status',
					'date_of_birth',
					'date_of_death'
				]
			}
		]
	}).then((user) => {
		done(null, user)
	}).catch((err) => {0
		done(err)
	})
})

passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, (email, password, done) => {
	User.findOne({
		where: {
			email: email
		},
		attributes: [
			'id',
			'email',
			'password'
		],
		include: [
			{
				association: User.Person,
				attributes: [
					'id',
					'first_name',
					'middle_name',
					'last_name',
					'gender',
					'civil_status',
					'date_of_birth',
					'date_of_death'
				]
			}
		]
	}).then((user) => {
		if (!user) {
			done(null, false, { message: 'Incorrect email.' })
			return
		}
		if (user.password != password) {
			done(null, false, { message: 'Incorrect password.' })
			return
		}
		done(null, user)
	}).catch((err) => {
		done(err)
	})
}))

passport.use('local-register', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, (req, email, password, done) => {

	async function createUser() {

		const transaction = await sequelize.transaction()

		let user = await User.findOne({
			where: {
				email
			},
			attributes: [
				'id'
			],
			transaction
		})

		if (user) {
			await transaction.commit()
			return {
				user: false,
				info: {
					message: 'Email already taken.'
				}
			}
		}

		let person = await Person.create({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			gender: req.body.gender,
			civil_status: req.body.civil_status,
			date_of_birth: req.body.date_of_birth
		})

		user = await User.create({
			email,
			password,
			person_id: person.id
		})

		await transaction.commit()
		return {
			user
		}
	}

	createUser().then(({user, info}) => {
		done(null, user, info)
	}).catch((err) => {
		done(err)
	})

}))

passport.use('user-basic', new BasicStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, (email, password, done) => {
	console.log('user-basic')
	console.log('email:: ', email)
	console.log('password:: ', password)
	User.findOne({
		where: {
			email: email
		},
		attributes: [
			'id',
			'email',
			'password'
		],
		include: [
			{
				association: User.Person,
				attributes: [
					'id',
					'first_name',
					'middle_name',
					'last_name',
					'gender',
					'civil_status',
					'date_of_birth',
					'date_of_death'
				]
			}
		]
	}).then((user) => {
		if (!user) {
			done(null, false, { message: 'Incorrect email.' })
			return
		}
		if (user.password != password) {
			done(null, false, { message: 'Incorrect password.' })
			return
		}
		done(null, user)
	}).catch((err) => {
		done(err)
	})
}))

passport.use('client-basic', new BasicStrategy({
	usernameField: 'id',
	passwordField: 'secret'
}, (id, secret, done) => {
	OAuthClient.findOne({
		where: {
			id: id
		},
		attributes: [
			'id',
			'name',
			'secret'
		]
	}).then((oAuthClient) => {
		if (!oAuthClient) {
			done(null, false, { message: 'Incorrect id.' })
			return
		}
		if (oAuthClient.secret != secret) {
			done(null, false, { message: 'Incorrect secret.' })
			return
		}
		done(null, oAuthClient)
	}).catch((err) => {
		done(err)
	})
}))

passport.use('bearer', new BearerStrategy((token, done) => {
	console.log('bearer')
	console.log('token:: ', token)
	OAuthToken.findOne({
		where: {
			value: token
		},
		attributes: [
			'id',
			'value'
		],
		include: [
			{
				association: OAuthToken.User,
				attributes: [
					'id',
					'email'
				],
				include: [
					{
						association: User.Person,
						attributes: [
							'id',
							'first_name',
							'middle_name',
							'last_name',
							'gender',
							'civil_status',
							'date_of_birth',
							'date_of_death'
						]
					}
				]
			},
			{
				association: OAuthToken.Client,
				attributes: [
					'id',
					'name'
				]
			},
		]
	}).then((oAuthToken) => {
		console.log('oAuthToken:: ', oAuthToken)
		if (!oAuthToken) {
			done(null, false, { message: 'Incorrect token.' })
			return
		}
		done(null, oAuthToken.user)

	}).catch((err) => {
		console.log('err:: ', err)
		done(err)
	})
}))

module.exports = authController