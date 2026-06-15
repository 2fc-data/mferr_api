'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const commonFields = {
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    };

    const statusFields = {
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      // Statuses/Stages/Outcomes often don't have deleted_at in the SQL provided (Wait, SQL says they do NOT have deleted_at, except courts/areas/users etc.
      // Let's check SQL carefully:
      // statuses, stages, outcomes: NO deleted_at.
    };

    // 1. Areas
    await queryInterface.createTable('areas', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });
    await queryInterface.addIndex('areas', ['name']);
    await queryInterface.addIndex('areas', ['is_active']);

    // 2. Addresses
    await queryInterface.createTable('addresses', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      postcode: { type: Sequelize.STRING(10), allowNull: false },
      city: { type: Sequelize.STRING(100), allowNull: false },
      state: { type: Sequelize.CHAR(2), allowNull: false },
      district: { type: Sequelize.STRING(100) },
      street: { type: Sequelize.STRING(200) },
      number: { type: Sequelize.STRING(20) },
      complement: { type: Sequelize.STRING(100) },
      ...commonFields,
    });
    await queryInterface.addIndex('addresses', ['postcode']);
    await queryInterface.addIndex('addresses', ['city', 'state']);

    // 3. Users
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(150), allowNull: false },
      username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      document: { type: Sequelize.STRING(20), allowNull: false, unique: true, comment: 'CPF/CNPJ' },
      email: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      phone1: { type: Sequelize.STRING(20) },
      phone2: { type: Sequelize.STRING(20) },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      email_verified_at: { type: Sequelize.DATE },
      ...commonFields,
    });
    await queryInterface.addIndex('users', ['username']);
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['document']);
    await queryInterface.addIndex('users', ['is_active']);

    // 4. User Addresses
    await queryInterface.createTable('user_addresses', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      address_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'addresses', key: 'id' }, onDelete: 'CASCADE' },
      address_type: { type: Sequelize.ENUM('residential', 'commercial', 'billing', 'other'), defaultValue: 'residential' },
      is_primary: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: commonFields.created_at,
      updated_at: commonFields.updated_at,
    });
    await queryInterface.addIndex('user_addresses', ['user_id', 'address_id', 'address_type'], { unique: true });
    await queryInterface.addIndex('user_addresses', ['user_id']);
    await queryInterface.addIndex('user_addresses', ['address_id']);

    // 5. Profiles
    await queryInterface.createTable('profiles', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });
    await queryInterface.addIndex('profiles', ['name']);

    // 6. User Profiles
    await queryInterface.createTable('user_profiles', {
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      profile_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'profiles', key: 'id' }, onDelete: 'CASCADE' },
      created_at: commonFields.created_at,
      updated_at: commonFields.updated_at,
    });
    await queryInterface.addConstraint('user_profiles', { fields: ['user_id', 'profile_id'], type: 'primary key' });
    await queryInterface.addIndex('user_profiles', ['user_id']);
    await queryInterface.addIndex('user_profiles', ['profile_id']);

    // 7. Rules
    await queryInterface.createTable('rules', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });
    await queryInterface.addIndex('rules', ['name']);

    // 8. Profile Rules
    await queryInterface.createTable('profile_rules', {
      profile_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'profiles', key: 'id' }, onDelete: 'CASCADE' },
      rule_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'rules', key: 'id' }, onDelete: 'CASCADE' },
      created_at: commonFields.created_at,
    });
    await queryInterface.addConstraint('profile_rules', { fields: ['profile_id', 'rule_id'], type: 'primary key' });
    await queryInterface.addIndex('profile_rules', ['profile_id']);
    await queryInterface.addIndex('profile_rules', ['rule_id']);

    // 9. Courts
    await queryInterface.createTable('courts', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(150), allowNull: false },
      description: { type: Sequelize.TEXT },
      state: { type: Sequelize.CHAR(2), allowNull: false },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });
    await queryInterface.addIndex('courts', ['state']);
    await queryInterface.addIndex('courts', ['name']);

    // 10. Court Divisions
    await queryInterface.createTable('court_divisions', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(150), allowNull: false },
      court_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'courts', key: 'id' }, onDelete: 'RESTRICT' },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });
    await queryInterface.addIndex('court_divisions', ['court_id']);
    await queryInterface.addIndex('court_divisions', ['name']);

    // 11. Status
    await queryInterface.createTable('status', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...statusFields,
    });
    await queryInterface.addIndex('status', ['name']);

    // 12. Stages
    await queryInterface.createTable('stages', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...statusFields,
    });
    await queryInterface.addIndex('stages', ['name']);

    // 13. Outcomes
    await queryInterface.createTable('outcomes', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...statusFields,
    });
    await queryInterface.addIndex('outcomes', ['name']);

    // 14. Causes
    await queryInterface.createTable('causes', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      number: { type: Sequelize.STRING(50), allowNull: false, unique: true, comment: 'Número do processo' },
      description: { type: Sequelize.TEXT },
      court_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'courts', key: 'id' }, onDelete: 'RESTRICT' },
      court_division_id: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'court_divisions', key: 'id' }, onDelete: 'RESTRICT' },
      area_id: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'areas', key: 'id' }, onDelete: 'RESTRICT' },
      current_stage_id: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'stages', key: 'id' }, onDelete: 'RESTRICT' },
      current_status_id: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'status', key: 'id' }, onDelete: 'RESTRICT' },
      outcome_id: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'outcomes', key: 'id' }, onDelete: 'RESTRICT' },
      total_value: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0.00 },
      total_fees: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0.00 },
      customer_amount: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0.00 },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });
    await queryInterface.addIndex('causes', ['number']);
    await queryInterface.addIndex('causes', ['court_id']);
    await queryInterface.addIndex('causes', ['area_id']);
    await queryInterface.addIndex('causes', ['current_status_id']);
    await queryInterface.addIndex('causes', ['current_stage_id']);
    await queryInterface.addIndex('causes', ['is_active']);

    // 15. Cause Users
    await queryInterface.createTable('cause_users', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      cause_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'causes', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'RESTRICT' },
      role_type: { type: Sequelize.ENUM('client', 'lawyer', 'assistant', 'opposing_party', 'other'), allowNull: false },
      party_side: { type: Sequelize.ENUM('plaintiff', 'defendant', 'third_party') },
      is_primary: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: commonFields.created_at,
      updated_at: commonFields.updated_at,
    });
    await queryInterface.addIndex('cause_users', ['cause_id', 'user_id', 'role_type'], { unique: true });
    await queryInterface.addIndex('cause_users', ['cause_id']);
    await queryInterface.addIndex('cause_users', ['user_id']);
    await queryInterface.addIndex('cause_users', ['role_type']);
    await queryInterface.addIndex('cause_users', ['party_side']);
    await queryInterface.addIndex('cause_users', ['is_primary']);

    // 16. Cause Status History
    await queryInterface.createTable('cause_status_history', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      cause_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'causes', key: 'id' }, onDelete: 'CASCADE' },
      status_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'status', key: 'id' }, onDelete: 'RESTRICT' },
      changed_by: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      notes: { type: Sequelize.TEXT },
      changed_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('cause_status_history', ['cause_id']);
    await queryInterface.addIndex('cause_status_history', ['status_id']);
    await queryInterface.addIndex('cause_status_history', ['changed_at']);

    // 17. Cause Stage History
    await queryInterface.createTable('cause_stage_history', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      cause_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'causes', key: 'id' }, onDelete: 'CASCADE' },
      stage_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'stages', key: 'id' }, onDelete: 'RESTRICT' },
      changed_by: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      notes: { type: Sequelize.TEXT },
      changed_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('cause_stage_history', ['cause_id']);
    await queryInterface.addIndex('cause_stage_history', ['stage_id']);
    await queryInterface.addIndex('cause_stage_history', ['changed_at']);

    // 18. Cause Outcome History
    await queryInterface.createTable('cause_outcome_history', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      cause_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'causes', key: 'id' }, onDelete: 'CASCADE' },
      outcome_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'outcomes', key: 'id' }, onDelete: 'RESTRICT' },
      changed_by: { type: Sequelize.INTEGER.UNSIGNED, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      notes: { type: Sequelize.TEXT },
      changed_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('cause_outcome_history', ['cause_id', 'outcome_id', 'changed_at'], { unique: true });
    await queryInterface.addIndex('cause_outcome_history', ['cause_id']);
    await queryInterface.addIndex('cause_outcome_history', ['outcome_id']);
    await queryInterface.addIndex('cause_outcome_history', ['changed_at']);

    // 19. User Sessions
    await queryInterface.createTable('user_sessions', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      device_info: { type: Sequelize.STRING(255) },
      ip_address: { type: Sequelize.STRING(45) },
      user_agent: { type: Sequelize.TEXT },
      login_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      logout_at: { type: Sequelize.DATE },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
    });
    await queryInterface.addIndex('user_sessions', ['user_id']);
    await queryInterface.addIndex('user_sessions', ['is_active']);
    await queryInterface.addIndex('user_sessions', ['login_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_sessions');
    await queryInterface.dropTable('cause_outcome_history');
    await queryInterface.dropTable('cause_stage_history');
    await queryInterface.dropTable('cause_status_history');
    await queryInterface.dropTable('cause_users');
    await queryInterface.dropTable('causes');
    await queryInterface.dropTable('outcomes');
    await queryInterface.dropTable('stages');
    await queryInterface.dropTable('status');
    await queryInterface.dropTable('court_divisions');
    await queryInterface.dropTable('courts');
    await queryInterface.dropTable('profile_rules');
    await queryInterface.dropTable('rules');
    await queryInterface.dropTable('user_profiles');
    await queryInterface.dropTable('profiles');
    await queryInterface.dropTable('user_addresses');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('addresses');
    await queryInterface.dropTable('areas');
  }
};
