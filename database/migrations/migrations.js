const dotenv = require('dotenv')
const result = dotenv.config()
 
if (result.error) {
	throw result.error
}

const sequelize = require('./../../app/sequelize.js')

const User = require('./../../app/models/User.js')
const Person = require('./../../app/models/Person.js')
const OAuthClient = require('./../../app/models/OAuthClient.js')
const OAuthCode = require('./../../app/models/OAuthCode.js')
const OAuthToken = require('./../../app/models/OAuthToken.js')

User.setRelations(sequelize.models)
Person.setRelations(sequelize.models)
OAuthClient.setRelations(sequelize.models)
OAuthCode.setRelations(sequelize.models)
OAuthToken.setRelations(sequelize.models)
	
sequelize.sync({
	force: true
}).then(() => {
	return sequelize.close()
}).then(() => {
	console.log('Migrations Done.')
}).catch((err) => {
	console.log(err)
})