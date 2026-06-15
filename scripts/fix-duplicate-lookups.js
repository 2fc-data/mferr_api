const mysql = require('mysql2/promise');

async function fixLookups() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'mFerr',
    password: 'mFerrDB*1',
    database: 'mFerrDB'
  });

  const tables = [
    { name: 'courts', causeField: 'court_id' },
    { name: 'areas', causeField: 'area_id' },
    { name: 'status', causeField: 'current_status_id' },
    { name: 'stages', causeField: 'current_stage_id' },
    { name: 'outcomes', causeField: 'outcome_id' },
  ];

  try {
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    for (const table of tables) {
      console.log(`Checking table: ${table.name}`);
      const [records] = await connection.query(`SELECT * FROM ${table.name} ORDER BY id ASC`);
      const recordMap = new Map();
      
      for (const rec of records) {
        const normalizedName = rec.name.trim().toLowerCase();
        if (!recordMap.has(normalizedName)) {
          recordMap.set(normalizedName, { keepId: rec.id, duplicateIds: [] });
        } else {
          recordMap.get(normalizedName).duplicateIds.push(rec.id);
        }
      }
      
      let totalDuplicates = 0;
      for (const [name, data] of recordMap.entries()) {
        if (data.duplicateIds.length > 0) {
          console.log(`  Found duplicates for "${name}": Keeping ID ${data.keepId}, moving causes from IDs ${data.duplicateIds.join(', ')}`);
          
          for (const dupId of data.duplicateIds) {
            await connection.query(`UPDATE causes SET ${table.causeField} = ? WHERE ${table.causeField} = ?`, [data.keepId, dupId]);
          }
          
          const placeholders = data.duplicateIds.map(() => '?').join(',');
          await connection.query(`DELETE FROM ${table.name} WHERE id IN (${placeholders})`, data.duplicateIds);
          totalDuplicates += data.duplicateIds.length;
        }
      }
      
      console.log(`  Cleaned up ${totalDuplicates} duplicates in ${table.name}.`);
      
      try {
        await connection.query(`ALTER TABLE ${table.name} ADD UNIQUE INDEX idx_${table.name}_name (name)`);
        console.log(`  Added unique index on ${table.name}.name`);
      } catch (e) {
        console.log(`  Unique index on ${table.name}.name might already exist or could not be added:`, e.message);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    await connection.end();
  }
}

fixLookups();
