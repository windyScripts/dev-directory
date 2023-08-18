'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.sequelize.transaction(async transaction => {
      // Create skills table
      await queryInterface.createTable('skills', {
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

      // Create user_skills table
      await queryInterface.createTable('user_skills', {
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

      // Create interests table
      await queryInterface.createTable('interests', {
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

      // Create user_interests table
      await queryInterface.createTable('user_interests', {
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
    // Drop user_interests table
    await queryInterface.dropTable('user_interests');

    // Drop interests table
    await queryInterface.dropTable('interests');

    // Drop user_skills table
    await queryInterface.dropTable('user_skills');

    // Drop skills table
    await queryInterface.dropTable('skills');
  },
};
