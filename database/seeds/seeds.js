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
	


async function seed() {
	let transaction = await sequelize.transaction()

	let person = (await Person.findOrCreate({
		where: {
			first_name: 'Milky',
			middle_name: 'Grayda',
			last_name: 'Gelua',
			gender: 'Female',
			civil_status: 'Single',
			date_of_birth: '1996-09-20',
			date_of_death: null
		},
		transaction
	}))[0]

	let user = (await User.findOrCreate({
		where: {
			email: 'MilkyGelua0920@gmail.com'
		},
		defaults: {
			password: 'ingkangkong',
			person_id: person.id
		},
		transaction
	}))[0]

	let oAuthClient = (await OAuthClient.findOrCreate({
		where: {
			name: 'Client 1',
			secret: '123',
			user_id: user.id
		},
		transaction
	}))[0]

	user = await User.findById(user.id, {
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
		],
		transaction
	})

	console.log(JSON.stringify(user, null, 4))
	console.log(JSON.stringify(oAuthClient, null, 4))
	await transaction.commit()
	return sequelize.close()
}

seed().then(() => {
	console.log('Seeds Done')
}).catch((err) => {
	console.log(err)
})