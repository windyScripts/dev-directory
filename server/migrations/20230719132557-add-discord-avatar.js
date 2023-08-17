'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'discord_avatar', {
      type: Sequelize.STRING(500),
      allowNull: false,
      defaultValue: '',
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('users', 'discord_avatar');
  },
};
