const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('mFerrDB', 'mFerr', 'mFerrDB*1', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

async function run() {
  try {
    const [results] = await sequelize.query("SELECT * FROM users WHERE username = 'admin'");
    if (results.length === 0) {
      console.log("No user found with username 'admin'");
      return;
    }
    const user = results[0];
    console.log("User in database:", {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      is_active: user.is_active,
      deleted_at: user.deleted_at,
    });

    const isMatch = await bcrypt.compare('admin123', user.password_hash);
    console.log("Bcrypt comparison match for 'admin123':", isMatch);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

run();
