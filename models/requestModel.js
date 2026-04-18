const { randomUUID } = require('crypto');
const db = require('../config/db');

exports.findAllWithUsers = async () => {
  const [requests] = await db.query(`
    SELECT
      requests.id,
      requests.title,
      requests.description,
      requests.status,
      requests.createdAt,
      requests.updatedAt,
      users.name AS createdBy,
      users.email AS userEmail,
      users.role AS userRole
    FROM requests
    JOIN users ON requests.userId = users.id
    ORDER BY requests.createdAt DESC
  `);

  return requests;
};

exports.findById = async (id) => {
  const [[request]] = await db.query(
    'SELECT id, title, description, status, userId FROM requests WHERE id = ?',
    [id]
  );

  return request;
};

exports.create = async ({ title, description, userId }) => {
  const requestId = randomUUID();

  await db.query(
    'INSERT INTO requests (id, title, description, userId) VALUES (?, ?, ?, ?)',
    [requestId, title.trim(), description?.trim() || null, userId]
  );

  return requestId;
};

exports.updateById = async (id, { title, description, status, userId }) => {
  await db.query(
    `
      UPDATE requests
      SET title = ?, description = ?, status = ?, userId = ?
      WHERE id = ?
    `,
    [title.trim(), description?.trim() || null, status, userId, id]
  );
};

exports.deleteById = async (id) => {
  await db.query('DELETE FROM requests WHERE id = ?', [id]);
};
