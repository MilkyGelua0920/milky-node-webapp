const path = require('path')

const favicon = require('serve-favicon')

const sequelize = require('./sequelize.js')

const User = require('./models/User.js')
const Person = require('./models/Person.js')
const OAuthClient = require('./models/OAuthClient.js')
const OAuthCode = require('./models/OAuthCode.js')
const OAuthToken = require('./models/OAuthToken.js')

User.setRelations(sequelize.models)
Person.setRelations(sequelize.models)
OAuthClient.setRelations(sequelize.models)
OAuthCode.setRelations(sequelize.models)
OAuthToken.setRelations(sequelize.models)

const moment = require('moment')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
const multer  = require('multer')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(favicon(path.resolve(__dirname, './../favicon.ico')))
app.use(express.static(path.join(__dirname, '../public')))
app.use('/moment', express.static(path.join(__dirname, '../node_modules/moment')))
app.use(session({
	secret: 'milky',
	saveUninitialized: true,
	resave: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(passport.initialize())
app.use(passport.session())

const authController = require('./controllers/auth.js')
const oAuth2Server = require('./controllers/oauth2.js')

const oauth2 = require('./routes/oauth2.js')
const api = require('./routes/api.js')

app.route('/login').get((req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/')
		return
	}
	let registerError = req.session.registerError
	let loginError = req.session.loginError
	delete req.session.registerError
	delete req.session.loginError
	res.render('login', {
		registerError,
		loginError
	})
}).post((req, res, next) => {
	passport.authenticate('local-login', (err, user, info) => {
		if (err) {
			next(err)
			return
		}
		if (!user) {
			req.session.loginError = info
			res.redirect('/login')
			return
		}
		req.login(user, (err) => {
			if (err) {
				next(err)
				return
			}
			if (req.session.returnTo) {
				let returnTo = req.session.returnTo
				delete req.session.returnTo
				res.redirect(returnTo)
				return
			}
			res.redirect('/')
		})
	})(req, res, next)
})

app.route('/register').post((req, res, next) => {
	passport.authenticate('local-register', (err, user, info) => {
		console.log('err, user, info:: ', err, user, info)
		if (err) {
			next(err)
			return
		}
		if (!user) {
			req.session.registerError = info
			res.redirect('/login')
			return
		}
		req.login(user, (err) => {
			if (err) {
				next(err)
				return
			}
			if (req.session.returnTo) {
				let returnTo = req.session.returnTo
				delete req.session.returnTo
				res.redirect(returnTo)
				return
			}
			res.redirect('/')
		})
	})(req, res, next)
})

app.route('/logout').post((req, res) => {
	if (req.isAuthenticated()) {
		req.logout()
	}
	res.redirect('/login')
})

app.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
    	res.redirect('/login')
        return
    }
	res.render('index', {
		user: req.user,
		moment
	})
})

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
    	res.redirect('/login')
        return
    }
	res.render('profile', {
		user: req.user,
		moment
	})
})

app.route('/profile/picture').get((req, res) => {
	res.sendFile(path.resolve(__dirname, `files/images/${req.user.id}-profile.jpg`))
}).post(multer({
	storage: multer.diskStorage({
		destination(req, file, done) {
			done(null, path.resolve(__dirname, 'files/images'))
		},
		filename(req, file, done) {
			done(null, `${req.user.id}-profile.jpg`)
		}
	})
}).single('image'), (req, res) => {
	res.redirect('/profile')
})

app.use('/oauth2', oauth2)
app.use('/api', api)

module.exports = app