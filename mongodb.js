const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('library');
    const collection = db.collection('books');

    await collection.insertMany([
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        year: 1937,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        year: 1960,
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        year: 1949,
      },
    ]);
    console.log('Sample data inserted');

    const titles = await collection
      .find({}, { projection: { title: 1, _id: 0 } })
      .toArray();
    console.log('Titles of all books:', titles);

    const tolkienBooks = await collection
      .find({ author: 'J.R.R. Tolkien' })
      .toArray();
    console.log('Books written by J.R.R. Tolkien:', tolkienBooks);

    await collection.updateOne(
      { title: '1984' },
      { $set: { genre: 'Science Fiction' } }
    );
    console.log('Updated genre of "1984" to "Science Fiction"');

    await collection.deleteOne({ title: 'The Hobbit' });
    console.log('"The Hobbit" has been deleted');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
})();
