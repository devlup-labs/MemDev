import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const migrationPath = path.join(
  __dirname,
  '../migrations/001_create_memories.sql'
)

async function migrate() {
  try {
    console.log('Running migration...')

    const sql = await fs.readFile(migrationPath, 'utf8')

    await pool.query(sql)

    console.log('Migration completed successfully.')
  } catch (error) {
    console.error('Migration failed:')
    console.error(error)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

migrate()