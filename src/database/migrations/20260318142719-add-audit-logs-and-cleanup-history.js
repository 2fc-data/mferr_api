'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Clean up old history tables
    await queryInterface.dropTable('cause_outcome_history');
    await queryInterface.dropTable('cause_stage_history');
    await queryInterface.dropTable('cause_status_history');

    // 2. Create the unified audit_logs table
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "'cause' or 'user'",
      },
      entity_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      action: {
        type: Sequelize.ENUM('CREATE', 'UPDATE', 'DELETE'),
        defaultValue: 'UPDATE',
      },
      changes: {
        type: Sequelize.JSON,
        allowNull: false,
        comment: "JSON with format: { field: { old, new } }",
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id']);
    await queryInterface.addIndex('audit_logs', ['user_id']);
    await queryInterface.addIndex('audit_logs', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('audit_logs');
    
    // We won't restore the old tables in down() because that would require complex mapping.
    // If needed, they can be restored from the initial-schema migration.
  }
};
