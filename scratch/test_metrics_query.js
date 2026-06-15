const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize('mFerrDB', 'mFerr', 'mFerrDB*1', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log, // Enable logging to see the SQL!
});

async function run() {
  try {
    // Let's define the models to perform a join
    const Cause = sequelize.define('Cause', {
      number: DataTypes.STRING,
      process_date: DataTypes.DATEONLY,
      is_active: DataTypes.BOOLEAN,
      outcome_id: DataTypes.INTEGER,
    }, { tableName: 'causes', timestamps: false });

    const Outcome = sequelize.define('Outcome', {
      name: DataTypes.STRING,
    }, { tableName: 'outcomes', timestamps: false });

    Cause.belongsTo(Outcome, { foreignKey: 'outcome_id', as: 'outcome' });

    console.log("--- Querying active causes in 2026 ---");
    const causes = await Cause.findAll({
      where: {
        is_active: true,
        process_date: {
          [Op.between]: [new Date(2026, 0, 1), new Date(2026, 11, 31, 23, 59, 59)]
        }
      },
      include: [
        { model: Outcome, as: 'outcome' }
      ]
    });

    console.log("Causes count:", causes.length);
    causes.forEach(c => {
      console.log("- Cause:", c.number, "Date:", c.process_date, "Outcome:", c.outcome ? c.outcome.name : null);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

run();
