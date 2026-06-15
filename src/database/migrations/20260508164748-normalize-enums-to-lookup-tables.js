'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const commonFields = {
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    };

    // 1. Create Lookup Tables
    await queryInterface.createTable('address_types', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });

    await queryInterface.createTable('cause_role_types', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });

    await queryInterface.createTable('party_sides', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      ...commonFields,
    });

    // 2. Seed Initial Values
    await queryInterface.bulkInsert('address_types', [
      { name: 'Residencial', created_at: new Date(), updated_at: new Date() },
      { name: 'Comercial', created_at: new Date(), updated_at: new Date() },
      { name: 'Cobrança', created_at: new Date(), updated_at: new Date() },
      { name: 'Outro', created_at: new Date(), updated_at: new Date() },
    ]);

    await queryInterface.bulkInsert('cause_role_types', [
      { name: 'Cliente', created_at: new Date(), updated_at: new Date() },
      { name: 'Advogado', created_at: new Date(), updated_at: new Date() },
      { name: 'Assistente', created_at: new Date(), updated_at: new Date() },
      { name: 'Parte Contrária', created_at: new Date(), updated_at: new Date() },
      { name: 'Outro', created_at: new Date(), updated_at: new Date() },
    ]);

    await queryInterface.bulkInsert('party_sides', [
      { name: 'Polo Ativo', created_at: new Date(), updated_at: new Date() },
      { name: 'Polo Passivo', created_at: new Date(), updated_at: new Date() },
      { name: 'Terceiro', created_at: new Date(), updated_at: new Date() },
    ]);

    // 3. Add FK columns to junction tables
    await queryInterface.addColumn('user_addresses', 'address_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'address_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('cause_users', 'role_type_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'cause_role_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('cause_users', 'party_side_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: { model: 'party_sides', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // 4. Data Migration Logic
    // We'll use raw SQL to update based on previous ENUM strings
    
    // Address types mapping
    await queryInterface.sequelize.query(`
      UPDATE user_addresses ua
      JOIN address_types at ON 
        (ua.address_type = 'residential' AND at.name = 'Residencial') OR
        (ua.address_type = 'commercial' AND at.name = 'Comercial') OR
        (ua.address_type = 'billing' AND at.name = 'Cobrança') OR
        (ua.address_type = 'other' AND at.name = 'Outro')
      SET ua.address_type_id = at.id
    `);

    // Cause roles mapping
    await queryInterface.sequelize.query(`
      UPDATE cause_users cu
      JOIN cause_role_types crt ON 
        (cu.role_type = 'client' AND crt.name = 'Cliente') OR
        (cu.role_type = 'lawyer' AND crt.name = 'Advogado') OR
        (cu.role_type = 'assistant' AND crt.name = 'Assistente') OR
        (cu.role_type = 'opposing_party' AND crt.name = 'Parte Contrária') OR
        (cu.role_type = 'other' AND crt.name = 'Outro')
      SET cu.role_type_id = crt.id
    `);

    // Party sides mapping
    await queryInterface.sequelize.query(`
      UPDATE cause_users cu
      JOIN party_sides ps ON 
        (cu.party_side = 'plaintiff' AND ps.name = 'Polo Ativo') OR
        (cu.party_side = 'defendant' AND ps.name = 'Polo Passivo') OR
        (cu.party_side = 'third_party' AND ps.name = 'Terceiro')
      SET cu.party_side_id = ps.id
    `);

    // 5. Remove old ENUM columns
    await queryInterface.removeColumn('user_addresses', 'address_type');
    await queryInterface.removeColumn('cause_users', 'role_type');
    await queryInterface.removeColumn('cause_users', 'party_side');
  },

  async down(queryInterface, Sequelize) {
    // Note: Reversing this perfectly is hard because we lost the ENUM strings.
    // For safety in dev, we just drop the new columns and tables.
    await queryInterface.removeColumn('cause_users', 'party_side_id');
    await queryInterface.removeColumn('cause_users', 'role_type_id');
    await queryInterface.removeColumn('user_addresses', 'address_type_id');
    
    await queryInterface.dropTable('party_sides');
    await queryInterface.dropTable('cause_role_types');
    await queryInterface.dropTable('address_types');

    // Re-adding old columns would require re-running initial migrations or manually defining them.
  }
};
