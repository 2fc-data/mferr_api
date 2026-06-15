'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add slug columns
    await queryInterface.addColumn('address_types', 'slug', { type: Sequelize.STRING(50), allowNull: true, unique: true });
    await queryInterface.addColumn('cause_role_types', 'slug', { type: Sequelize.STRING(50), allowNull: true, unique: true });
    await queryInterface.addColumn('party_sides', 'slug', { type: Sequelize.STRING(50), allowNull: true, unique: true });

    // Populate slugs
    await queryInterface.sequelize.query("UPDATE address_types SET slug = 'residential' WHERE name = 'Residencial'");
    await queryInterface.sequelize.query("UPDATE address_types SET slug = 'commercial' WHERE name = 'Comercial'");
    await queryInterface.sequelize.query("UPDATE address_types SET slug = 'billing' WHERE name = 'Cobrança'");
    await queryInterface.sequelize.query("UPDATE address_types SET slug = 'other' WHERE name = 'Outro'");

    await queryInterface.sequelize.query("UPDATE cause_role_types SET slug = 'client' WHERE name = 'Cliente'");
    await queryInterface.sequelize.query("UPDATE cause_role_types SET slug = 'lawyer' WHERE name = 'Advogado'");
    await queryInterface.sequelize.query("UPDATE cause_role_types SET slug = 'assistant' WHERE name = 'Assistente'");
    await queryInterface.sequelize.query("UPDATE cause_role_types SET slug = 'opposing_counsel' WHERE name = 'Parte Contrária'");
    await queryInterface.sequelize.query("UPDATE cause_role_types SET slug = 'other' WHERE name = 'Outro'");

    await queryInterface.sequelize.query("UPDATE party_sides SET slug = 'plaintiff' WHERE name = 'Polo Ativo'");
    await queryInterface.sequelize.query("UPDATE party_sides SET slug = 'defendant' WHERE name = 'Polo Passivo'");
    await queryInterface.sequelize.query("UPDATE party_sides SET slug = 'third_party' WHERE name = 'Terceiro'");

    // Make slug required after populating
    await queryInterface.changeColumn('address_types', 'slug', { type: Sequelize.STRING(50), allowNull: false });
    await queryInterface.changeColumn('cause_role_types', 'slug', { type: Sequelize.STRING(50), allowNull: false });
    await queryInterface.changeColumn('party_sides', 'slug', { type: Sequelize.STRING(50), allowNull: false });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('party_sides', 'slug');
    await queryInterface.removeColumn('cause_role_types', 'slug');
    await queryInterface.removeColumn('address_types', 'slug');
  }
};
