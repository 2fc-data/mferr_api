'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('causes', 'closed_at', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Data de encerramento do processo',
    });

    await queryInterface.addColumn('causes', 'subject', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Assunto do processo (TPU)',
    });

    await queryInterface.addColumn('causes', 'litigation_type', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Tipo de litígio (ex: PF, Empresa)',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('causes', 'closed_at');
    await queryInterface.removeColumn('causes', 'subject');
    await queryInterface.removeColumn('causes', 'litigation_type');
  },
};
