const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    console.log('Connect to MongoDB');

    const db = client.db('library');
    const collection = db.collection('books');

    await collection.insertMany([
      {
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        genre: 'Psychological Thriller',
        year: 2019,
      },

      {
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        genre: 'Science Fiction',
        year: 2021,
      },

      {
        title: 'Where the Crawdads Sing',
        author: 'Delia Owens',
        genre: 'Literary Fiction',
        year: 2018,
      },

      {
        title: 'Atomic Habits',
        author: 'James Clear',
        genre: 'Self-Help',
        year: 2018,
      },

      {
        title: 'Circe',
        author: 'Madeline Miller',
        genre: 'Mythological Fantasy',
        year: 2018,
      },
    ]);
    console.log('Sample data inserted');

    const titles = await collection
      .find({}, { projection: { title: 1, _id: 0 } })
      .toArray();
    console.log('Title of all books: ', titles);

    const andyBooks = await collection.find({ author: 'Andy Weir' }).toArray();
    console.log('Books written by Andy Weir: ', andyBooks);

    await collection.updateOne(
      { title: 'Circe' },
      { $set: { genre: 'Fantasy' } }
    );
    console.log('Updated genre of Circe to "Fantasy"');

    await collection.deleteOne({ title: 'Where the Crawdads Sing' });
    console.log('"Where the Crawdads Sing" has been deleted');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
})();
