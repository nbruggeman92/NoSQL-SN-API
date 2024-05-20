const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  // Drop existing collections if they exist
  const collections = ['users', 'thoughts', 'reactions'];
  for (const collection of collections) {
    const collectionExists = await connection.db.listCollections({ name: collection }).toArray();
    if (collectionExists.length) {
      await connection.dropCollection(collection);
    }
  }

  const users = [
    { username: "annabobanna", email: "usernumber1@gmail.com" },
    { username: "winnerwinner", email: "usernumber2@gmail.com" },
    { username: "antisocial", email: "usernumber3@gmail.com" },
    { username: "mynameisjeff", email: "usernumber4@gmail.com" },
    { username: "burgerfan", email: "usernumber5@gmail.com" },
  ];

  const userData = await User.insertMany(users);

  const thoughts = [
    {
      thoughtText: "I thought, therefore I... wait what",
      username: userData[0].username,
      reactions: [
        { reactionBody: "Interesting", username: userData[1].username },
        { reactionBody: "Confusing", username: userData[2].username }
      ]
    },
    {
      thoughtText: "IDK man",
      username: userData[1].username,
      reactions: [
        { reactionBody: "Same", username: userData[3].username },
        { reactionBody: "Totally", username: userData[4].username }
      ]
    },
    {
      thoughtText: "How can you expect me to use ANOTHER social account?",
      username: userData[2].username,
      reactions: [
        { reactionBody: "True", username: userData[0].username },
        { reactionBody: "So many", username: userData[3].username }
      ]
    },
    {
      thoughtText: "My name is Jeff",
      username: userData[3].username,
      reactions: [
        { reactionBody: "Hi Jeff", username: userData[1].username },
        { reactionBody: "LOL", username: userData[4].username }
      ]
    },
    {
      thoughtText: "But why?",
      username: userData[4].username,
      reactions: [
        { reactionBody: "Good question", username: userData[0].username },
        { reactionBody: "No clue", username: userData[2].username }
      ]
    },
  ];
  
  const thoughtData = await Thought.insertMany(thoughts);

  await User.findOneAndUpdate({_id: userData[0]._id}, {$addToSet: {thoughts: thoughtData[0]._id}})
  await User.findOneAndUpdate({_id: userData[1]._id}, {$addToSet: {thoughts: thoughtData[1]._id}})
  await User.findOneAndUpdate({_id: userData[2]._id}, {$addToSet: {thoughts: thoughtData[2]._id}})
  await User.findOneAndUpdate({_id: userData[3]._id}, {$addToSet: {thoughts: thoughtData[3]._id}})
  await User.findOneAndUpdate({_id: userData[4]._id}, {$addToSet: {thoughts: thoughtData[4]._id}})

  // Log out the seed data to indicate what should appear in the database
  console.table(userData);
  console.table(thoughtData);
  console.info('Seeding complete! 🌱');
  process.exit(0);
});