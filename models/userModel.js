export default function (sequelize, Sequelize) {
	const User = sequelize.define("user", {
		id: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false
		},
		username: {
			type: Sequelize.STRING,
			allowNull: false
		}
	});
	return User;
};