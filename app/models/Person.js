const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const Person = sequelize.define('person', {
	id: {
		type: Sequelize.BIGINT(11).UNSIGNED,
		autoIncrement: true,
		primaryKey: true
	},
	first_name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	middle_name: {
		type: Sequelize.STRING(100),
		allowNull: true
	},
	last_name: {
		type: Sequelize.STRING(100),
		allowNull: false
	},
	gender: {
		type: Sequelize.ENUM('Male', 'Female'),
		allowNull: false,
		validate: {
			isIn: [['Male', 'Female']]
		}
	},
	civil_status: {
		type: Sequelize.ENUM('Single', 'Married', 'Widowed', 'Divorced', 'Seperated'),
		allowNull: true,
		validate: {
			isIn: [['Single', 'Married', 'Widowed', 'Divorced', 'Seperated']]
		}
	},
	date_of_birth: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			isDate: true
		}
	},
	date_of_death: {
		type: Sequelize.DATE,
		allowNull: true,
		validate: {
			isDate: true
		}
	}
}, {
	timestamps: true,
	paranoid: true,
	underscored: true
})

Person.setRelations = (models) => {
	Person.User = Person.hasOne(models.user, {
		as: 'user',
		foreignKey: {
			name: 'person_id',
			allowNull: false,
			unique: true
		}
	})
}

module.exports= Person