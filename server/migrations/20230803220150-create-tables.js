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

      // Create UserSkills table
      await queryInterface.createTable('UserSkills', {
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

      // Create UserInterests table
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
      }, { transaction });
    });
  },

  async down(queryInterface) {
    // Drop UserInterests table
    await queryInterface.dropTable('UserInterests');

    // Drop Interests table
    await queryInterface.dropTable('Interests');

    // Drop UserSkills table
    await queryInterface.dropTable('UserSkills');

    // Drop Skills table
    await queryInterface.dropTable('Skills');
  },
};