const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

function parseDate(dateStr) {
  if (!dateStr || dateStr === "") return null;
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
}

async function seed() {
  console.log('Starting seed process...');

  // Read SPA data
  const spaDataPath = path.resolve(__dirname, '../../lo_spa/src/data/DATA_CLIENTS.ts');
  const content = fs.readFileSync(spaDataPath, 'utf8');

  // Extract the array using a simple regex/eval hack for this one-off seeder
  const arrayStart = content.indexOf('[');
  const arrayEnd = content.lastIndexOf(']') + 1;
  const arrayText = content.substring(arrayStart, arrayEnd);

  let data;
  try {
    data = eval(arrayText);
  } catch (e) {
    console.error('Error parsing DATA_CLIENTS.ts:', e);
    process.exit(1);
  }

  console.log(`Loaded ${data.length} records from SPA data.`);

  // Database connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'mFerr',
    password: 'mFerrDB*1',
    database: 'mFerrDB'
  });

  try {
    // Disable FK checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2. Collect unique lookup values
    const uniqueCourts = [...new Set(data.map(d => d.tribunal))];
    const uniqueAreas = [...new Set(data.map(d => d.area_atuacao))];
    const uniqueStatuses = [...new Set(data.map(d => d.status_processo))];
    const uniqueStages = [...new Set(data.map(d => d.estagio_atual))];
    const uniqueOutcomes = [...new Set(data.map(d => d.desfecho))];
    const uniqueCities = [...new Set(data.map(d => d.cliente_cidade))];
    
    // Unique Divisions linked to Courts
    const divisions = [];
    data.forEach(d => {
      if (d.vara && !divisions.find(div => div.name === d.vara && div.court === d.tribunal)) {
        divisions.push({ name: d.vara, court: d.tribunal });
      }
    });

    console.log('Seeding lookup tables...');

    // Upsert lookups
    for (const name of uniqueCourts) {
      await connection.query('INSERT IGNORE INTO courts (name, created_at, updated_at) VALUES (?, NOW(), NOW())', [name]);
    }
    for (const name of uniqueAreas) {
      await connection.query('INSERT IGNORE INTO areas (name, created_at, updated_at) VALUES (?, NOW(), NOW())', [name]);
    }
    for (const name of uniqueStatuses) {
      await connection.query('INSERT IGNORE INTO status (name, created_at, updated_at) VALUES (?, NOW(), NOW())', [name]);
    }
    for (const name of uniqueStages) {
      await connection.query('INSERT IGNORE INTO stages (name, created_at, updated_at) VALUES (?, NOW(), NOW())', [name]);
    }
    for (const name of uniqueOutcomes) {
      await connection.query('INSERT IGNORE INTO outcomes (name, created_at, updated_at) VALUES (?, NOW(), NOW())', [name]);
    }
    for (const name of uniqueCities) {
      await connection.query('INSERT IGNORE INTO cities (name, uf, created_at, updated_at) VALUES (?, ?, NOW(), NOW())', [name, 'SP']);
    }

    // Seed Divisions
    for (const div of divisions) {
      await connection.query('INSERT IGNORE INTO divisions (name, created_at, updated_at) VALUES (?, NOW(), NOW())', [div.name]);
    }

    console.log('Seeding causes...');

    // 4. Seed causes
    for (const record of data) {
      const dbDate = parseDate(record.data_entrada) || '2024-01-01';
      
      // Get IDs
      const [court] = await connection.query('SELECT id FROM courts WHERE name = ?', [record.tribunal]);
      const [area] = await connection.query('SELECT id FROM areas WHERE name = ?', [record.area_atuacao]);
      const [status] = await connection.query('SELECT id FROM status WHERE name = ?', [record.status_processo]);
      const [stage] = await connection.query('SELECT id FROM stages WHERE name = ?', [record.estagio_atual]);
      const [outcome] = await connection.query('SELECT id FROM outcomes WHERE name = ?', [record.desfecho]);
      const [city] = await connection.query('SELECT id FROM cities WHERE name = ?', [record.cliente_cidade]);
      const [division] = await connection.query('SELECT id FROM divisions WHERE name = ?', [record.vara]);

      await connection.query(`
                INSERT INTO causes (
                    number, court_id, division_id, area_id, current_status_id, current_stage_id, 
                    outcome_id, city_id, total_value, total_fees, customer_amount, 
                    closed_at, subject, litigation_type,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    court_id = VALUES(court_id),
                    division_id = VALUES(division_id),
                    area_id = VALUES(area_id),
                    current_status_id = VALUES(current_status_id),
                    current_stage_id = VALUES(current_stage_id),
                    outcome_id = VALUES(outcome_id),
                    city_id = VALUES(city_id),
                    total_value = VALUES(total_value),
                    total_fees = VALUES(total_fees),
                    customer_amount = VALUES(customer_amount),
                    closed_at = VALUES(closed_at),
                    subject = VALUES(subject),
                    litigation_type = VALUES(litigation_type),
                    created_at = VALUES(created_at),
                    updated_at = VALUES(updated_at)
            `, [
        record.numero_processo,
        court[0]?.id || null,
        division[0]?.id || null,
        area[0]?.id || null,
        status[0]?.id || null,
        stage[0]?.id || null,
        outcome[0]?.id || null,
        city[0]?.id || null,
        parseFloat(record.valor_processo) || 0,
        parseFloat(record.valor_honorario) || 0,
        parseFloat(record.valor_cliente) || 0,
        parseDate(record.data_desfecho) || null,
        record.area_atuacao || 'Geral',
        Math.random() > 0.5 ? 'PF' : 'Empresa',
        dbDate,
        dbDate
      ]);
    }

    console.log('Seeding associated users (clients)...');
    // 5. Seed associated users (clients)
    const uniqueClients = [...new Set(data.map(d => d.cliente_nome))];
    for (const name of uniqueClients) {
      const record = data.find(d => d.cliente_nome === name);
      const username = name.toLowerCase().replace(/\s+/g, '.');
      const email = record.cliente_email || `${username}@example.com`;
      const createdAt = parseDate(record.data_entrada) || '2024-01-01';

      await connection.query(`
                INSERT IGNORE INTO users (name, username, email, document, password_hash, created_at, updated_at) 
                VALUES (?, ?, ?, ?, 'MOCKED_HASH', ?, ?)
             `, [name, username, email, record.cliente_cpf || username, createdAt, createdAt]);
    }

    // 6. Link users to causes
    for (const record of data) {
      const [user] = await connection.query('SELECT id FROM users WHERE name = ?', [record.cliente_nome]);
      const [cause] = await connection.query('SELECT id FROM causes WHERE number = ?', [record.numero_processo]);
      const createdAt = parseDate(record.data_entrada) || '2024-01-01';

      if (user[0] && cause[0]) {
        await connection.query(`
                    INSERT IGNORE INTO cause_users (cause_id, user_id, role_type, created_at, updated_at)
                    VALUES (?, ?, 'client', ?, ?)
                 `, [cause[0].id, user[0].id, createdAt, createdAt]);
      }
    }

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Seed process completed successfully.');

  } catch (error) {
    console.error('Error during seeding:', error);
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
  } finally {
    await connection.end();
  }
}

seed();
