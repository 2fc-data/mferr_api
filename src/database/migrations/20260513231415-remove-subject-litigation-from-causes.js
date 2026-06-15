'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('causes', 'subject');
    await queryInterface.removeColumn('causes', 'litigation_type');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('causes', 'subject', {
      type: Sequelize.STRING(255),
      comment: 'Assunto do processo (TPU)',
    });
    await queryInterface.addColumn('causes', 'litigation_type', {
      type: Sequelize.STRING(50),
      comment: 'Tipo de litígio (ex: PF, Empresa)',
    });
  }
};
