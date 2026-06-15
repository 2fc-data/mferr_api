const mysql = require('mysql2/promise');

async function verify() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'mFerr',
    password: 'mFerrDB*1',
    database: 'mFerrDB'
  });

  try {
    const [rows] = await connection.query(`
      SELECT c.number, c.created_at, cd.name as division, ct.name as court
      FROM causes c
      LEFT JOIN court_divisions cd ON c.court_division_id = cd.id
      LEFT JOIN courts ct ON c.court_id = ct.id
      WHERE c.number = '5107245-30.8573.7.34'
    `);

    console.log('Verification Record (Igor Nascimento):');
    console.log(JSON.stringify(rows[0], null, 2));

    const [count] = await connection.query('SELECT COUNT(*) as total FROM causes');
    console.log(`Total causes: ${count[0].total}`);

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await connection.end();
  }
}

verify();
