// scripts/batch_import_parquet.js

const parquet = require('parquetjs-lite');
const path = require('path');
const prisma = require('../src/db/prismaClient'); // Adjust path to your Prisma client

/**
 * Import a Parquet file into a Prisma model/table
 * @param {string} parquetPath - Path to the .parquet file
 * @param {string} model - 'msmeProfile' | 'listingCatalog' | ... (must match your Prisma model)
 */
async function importParquet(parquetPath, model) {
  const reader = await parquet.ParquetReader.openFile(parquetPath);
  const cursor = reader.getCursor();
  let row;
  const batch = [];
  let count = 0;

  try {
    while ((row = await cursor.next())) {
      batch.push(row);
      if (batch.length >= 1000) { // Bulk insert every 1000 records
        await prisma[model].createMany({ data: batch, skipDuplicates: true });
        count += batch.length;
        batch.length = 0;
        console.log(`${count} rows imported...`);
      }
    }
    if (batch.length > 0) {
      await prisma[model].createMany({ data: batch, skipDuplicates: true });
      count += batch.length;
      console.log(`Final batch: ${batch.length} rows imported.`);
    }
    await reader.close();
    console.log(`Done! Total imported into ${model}: ${count}`);
  } catch (err) {
    console.error(`Error during import: ${err.message}`);
    await reader.close();
    process.exit(1);
  }
}

// Example usage: node scripts/batch_import_parquet.js ./data/msme_profile.parquet msmeProfile
if (require.main === module) {
  const [,, parquetFile, model] = process.argv;
  if (!parquetFile || !model) {
    console.error('Usage: node scripts/batch_import_parquet.js <parquetFile> <PrismaModel>');
    process.exit(1);
  }
  importParquet(parquetFile, model).then(() => process.exit(0));
}

module.exports = importParquet;
