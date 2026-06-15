const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mFerrDB', 'mFerr', 'mFerrDB*1', {
  host: 'localhost',
  dialect: 'mysql',
});
const Cause = sequelize.define('Cause', {}, { tableName: 'causes', paranoid: true });
async function run() {
  const c = await Cause.findOne({ raw: true });
  console.log(Object.keys(c));
  process.exit(0);
}
run();
