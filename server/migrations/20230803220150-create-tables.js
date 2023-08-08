'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(async transaction => {
      // Create Skills table
      await queryInterface.createTable('Skills', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
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

      // Create User_Skills table
      await queryInterface.createTable('User_Skills', {
        user_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        skill_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
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

      // Create Interests table
      await queryInterface.createTable('Interests', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: {
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

      // Create User_Interests table
      await queryInterface.createTable('User_Interests', {
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
      }, { transaction });
    });
  },

  async down(queryInterface) {
    // Drop User_Interests table
    await queryInterface.dropTable('User_Interests');

    // Drop Interests table
    await queryInterface.dropTable('Interests');

    // Drop User_Skills table
    await queryInterface.dropTable('User_Skills');

    // Drop Skills table
    await queryInterface.dropTable('Skills');
  },
};
