const { Sequelize } = require('sequelize-typescript');
const { User } = require('./dist/database/models/user.model');
const { Address } = require('./dist/database/models/address.model');
const { UserAddress } = require('./dist/database/models/user_address.model');
const { Profile } = require('./dist/database/models/profile.model');
const { Rule } = require('./dist/database/models/rule.model');
const { AddressType } = require('./dist/database/models/address_type.model');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  models: [User, Address, UserAddress, Profile, Rule, AddressType],
  logging: false,
});

async function run() {
  try {
    const user = await User.findByPk(1851, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Profile,
          as: 'profiles',
          attributes: ['id', 'name'],
          include: [{ model: Rule, as: 'rules' }],
        },
        {
          model: Address,
          as: 'addresses',
          through: { attributes: ['address_type_id', 'is_primary'] },
        },
      ],
    });
    console.log(JSON.stringify(user, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
