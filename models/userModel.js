const db = require('../config/db');

exports.findByEmail = async (email) => {
  const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return user;
};

exports.findAllBasic = async () => {
  const [users] = await db.query(`
    SELECT id, name, role
    FROM users
    ORDER BY name
  `);

  return users;
};

exports.existsById = async (id) => {
  const [users] = await db.query('SELECT id FROM users WHERE id = ?', [id]);
  return users.length > 0;
};
