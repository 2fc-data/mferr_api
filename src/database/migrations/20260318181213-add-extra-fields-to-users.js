'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'nationality', {
      type: Sequelize.STRING(15),
      allowNull: true,
      defaultValue: 'Brasileira',
    });

    await queryInterface.addColumn('users', 'birth_state', {
      type: Sequelize.STRING(2),
      allowNull: true,
      defaultValue: 'MG',
    });

    await queryInterface.addColumn('users', 'profession', {
      type: Sequelize.STRING(18),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'birth_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'mother_name', {
      type: Sequelize.STRING(21),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'father_name', {
      type: Sequelize.STRING(21),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'rg', {
      type: Sequelize.STRING(9),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'pis', {
      type: Sequelize.STRING(15),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'ctps', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'ctps');
    await queryInterface.removeColumn('users', 'pis');
    await queryInterface.removeColumn('users', 'rg');
    await queryInterface.removeColumn('users', 'father_name');
    await queryInterface.removeColumn('users', 'mother_name');
    await queryInterface.removeColumn('users', 'birth_date');
    await queryInterface.removeColumn('users', 'profession');
    await queryInterface.removeColumn('users', 'birth_state');
    await queryInterface.removeColumn('users', 'nationality');
  }
};
