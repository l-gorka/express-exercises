export default function (sequelize, Sequelize) {
	const Exercise = sequelize.define("exercise", {
		userId: {
			type: Sequelize.STRING,
			allowNull: false
		},
		description: {
			type: Sequelize.STRING,
			allowNull: false
		},
    duration: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    }
	});
	return Exercise;
};