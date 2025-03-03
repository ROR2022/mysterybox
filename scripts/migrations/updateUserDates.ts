const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function updateUserDates() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const users = await db.collection('users').find({
      $or: [
        { createdAt: { $exists: false } },
        { updatedAt: { $exists: false } }
      ]
    }).toArray();

    console.log(`Found ${users.length} users without timestamps`);

    let updatedCount = 0;

    for (const user of users) {
      const timestamp = ObjectId.createFromHexString(user._id.toString()).getTimestamp();
      
      await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: {
            createdAt: timestamp,
            updatedAt: timestamp
          }
        }
      );

      updatedCount++;
      console.log(`Updated user ${user.email || user._id} (${updatedCount}/${users.length})`);
    }

    console.log(`Migration completed. Updated ${updatedCount} users.`);
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Ejecutar la migración
updateUserDates()
  .catch(console.error)
  .finally(() => process.exit()); 