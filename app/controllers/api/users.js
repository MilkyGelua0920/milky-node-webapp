const User = require('./../../models/User.js')

const usersController = {}

usersController.getUsers = (req, res) => {
	console.log('getUsers User::: ', User)
	User.findAll({
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
	}).then((users) => {
		res.json(users)
	}).catch((err) => {
		res.status(500).json(err)
	})
}

usersController.postUsers = (req, res) => {
	console.log(req.body)
	res.send(req.body)
}

module.exports = usersController