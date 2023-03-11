"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "discord_name", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
    await queryInterface.addColumn("users", "bio", {
      type: Sequelize.STRING(1000),
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("users", "twitter_username", {
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("users", "linkedin_url", {
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("users", "github_username", {
      type: Sequelize.STRING(200),
      allowNull: false,
      defaultValue: "",
    });
    await queryInterface.addColumn("users", "website", {
      type: Sequelize.STRING(500),
      allowNull: false,
      defaultValue: "",
    });
  },

  async down(queryInterface, Sequelize) {
    return [
      await queryInterface.removeColumn("users", "website"),
      await queryInterface.removeColumn("users", "github_username"),
      await queryInterface.removeColumn("users", "linkedin_url"),
      await queryInterface.removeColumn("users", "twitter_username"),
      await queryInterface.removeColumn("users", "bio"),
      await queryInterface.removeColumn("users", "discord_name"),
    ];
  },
};
