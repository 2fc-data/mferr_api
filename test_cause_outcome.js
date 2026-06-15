const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('mFerrDB', 'mFerr', 'mFerrDB*1', {
  host: 'localhost',
  dialect: 'mysql',
});
const Cause = sequelize.define('Cause', {}, { tableName: 'causes', paranoid: true });
const Outcome = sequelize.define('Outcome', { name: Sequelize.STRING }, { tableName: 'outcomes' });

Cause.belongsTo(Outcome, { foreignKey: 'outcome_id', as: 'outcome' });

async function run() {
  const c = await Cause.findOne({ 
    include: [{ model: Outcome, as: 'outcome' }], 
    where: { outcome_id: 13 },
    raw: false,
    nest: true
  });
  console.log(c ? c.toJSON().outcome : 'No cause found');
  process.exit(0);
}
run();
