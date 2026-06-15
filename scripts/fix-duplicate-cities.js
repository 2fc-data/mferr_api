const mysql = require('mysql2/promise');

async function fixCities() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'mFerr',
    password: 'mFerrDB*1',
    database: 'mFerrDB'
  });

  try {
    // Disable foreign key checks so we can update causes mapping
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Find all cities
    const [cities] = await connection.query('SELECT * FROM cities ORDER BY id ASC');
    
    const cityMap = new Map(); // name (trimmed, lowercase) -> { keepId, duplicateIds }
    
    for (const city of cities) {
      const normalizedName = city.name.trim().toLowerCase();
      if (!cityMap.has(normalizedName)) {
        cityMap.set(normalizedName, { keepId: city.id, duplicateIds: [] });
      } else {
        cityMap.get(normalizedName).duplicateIds.push(city.id);
      }
    }
    
    let totalDuplicates = 0;
    
    for (const [name, data] of cityMap.entries()) {
      if (data.duplicateIds.length > 0) {
        console.log(`Found duplicates for "${name}": Keeping ID ${data.keepId}, moving causes from IDs ${data.duplicateIds.join(', ')}`);
        
        // Update causes
        for (const dupId of data.duplicateIds) {
          await connection.query('UPDATE causes SET city_id = ? WHERE city_id = ?', [data.keepId, dupId]);
        }
        
        // Delete duplicates
        const placeholders = data.duplicateIds.map(() => '?').join(',');
        await connection.query(`DELETE FROM cities WHERE id IN (${placeholders})`, data.duplicateIds);
        
        totalDuplicates += data.duplicateIds.length;
      }
    }
    
    console.log(`Cleaned up ${totalDuplicates} duplicate cities.`);
    
    // Also, let's add a unique index to prevent this in the future, if it doesn't exist
    try {
      await connection.query('ALTER TABLE cities ADD UNIQUE INDEX idx_city_name (name)');
      console.log('Added unique index on cities.name');
    } catch (e) {
      console.log('Unique index on cities.name might already exist or could not be added:', e.message);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    await connection.end();
  }
}

fixCities();
