const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'drizzle/migrations');

const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => fs.statSync(path.join(migrationsDir, file)).isFile())
  .sort();

const latestMigration = files[files.length - 1];
const filePath = path.join(migrationsDir, latestMigration);

let sqlContent = fs.readFileSync(filePath, 'utf-8');

sqlContent = sqlContent.replace(/CREATE TABLE/g, 'CREATE TABLE IF NOT EXISTS');

sqlContent = sqlContent.replace(/CREATE INDEX/g, 'CREATE INDEX IF NOT EXISTS');

fs.writeFileSync(filePath, sqlContent, 'utf-8');

console.log(`Modified migration file: ${latestMigration}`);
