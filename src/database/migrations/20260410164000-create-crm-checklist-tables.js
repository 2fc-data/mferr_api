'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create status_tasks table (Templates)
    await queryInterface.createTable('status_tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      status_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'status',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      order_index: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Create cause_tasks table (Execution)
    await queryInterface.createTable('cause_tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      cause_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'causes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status_task_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'status_tasks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      completed_by: {
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
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('status_tasks', ['status_id']);
    await queryInterface.addIndex('cause_tasks', ['cause_id']);
    await queryInterface.addIndex('cause_tasks', ['status_task_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cause_tasks');
    await queryInterface.dropTable('status_tasks');
  },
};
