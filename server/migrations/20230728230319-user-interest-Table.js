'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserInterests', {
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      interest_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down (queryInterface) {
    await queryInterface.dropTable('UserInterests');
  },
};
