const connection = require('../config/connection');
const { User, Thought } = require('../models');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  const collections = ['users', 'thoughts', 'reactions'];
  for (const collection of collections) {
    const collectionExists = await connection.db.listCollections({ name: collection }).toArray();
    if (collectionExists.length) {
      await connection.dropCollection(collection);
    }
  }

  const users = [
    { username: "nbruggeman92", email: "nbruggeman92@gmail.com" },
    { username: "geraltrivia", email: "geralt92@gmail.com" },
    { username: "tedlasso", email: "tedlasso92@gmail.com" },
    { username: "roykent", email: "roykent92@gmail.com" },
    { username: "jamietartt", email: "jamietartt92@gmail.com" },
  ];

  const userData = await User.insertMany(users);

  const thoughts = [
    {
      thoughtText: "Hmmmm...",
      username: userData[0].username,
      reactions: [
        { reactionBody: "WTF", username: userData[1].username },
        { reactionBody: "YES", username: userData[2].username }
      ]
    },
    {
      thoughtText: "Sure I guess",
      username: userData[1].username,
      reactions: [
        { reactionBody: "Whatever bro", username: userData[3].username },
        { reactionBody: "K", username: userData[4].username }
      ]
    },
    {
      thoughtText: "GAHHHH",
      username: userData[2].username,
      reactions: [
        { reactionBody: "Fine.", username: userData[0].username },
        { reactionBody: "Brain hurts...", username: userData[3].username }
      ]
    },
    {
      thoughtText: "I'm hungry",
      username: userData[3].username,
      reactions: [
        { reactionBody: "Nom nom", username: userData[1].username },
        { reactionBody: "Hahahaha", username: userData[4].username }
      ]
    },
    {
      thoughtText: "Let's gooo",
      username: userData[4].username,
      reactions: [
        { reactionBody: "Mmhmm", username: userData[0].username },
        { reactionBody: "I'm the best", username: userData[2].username }
      ]
    },
  ];
  
  const thoughtData = await Thought.insertMany(thoughts);

  await User.findOneAndUpdate({_id: userData[0]._id}, {$addToSet: {thoughts: thoughtData[0]._id}})
  await User.findOneAndUpdate({_id: userData[1]._id}, {$addToSet: {thoughts: thoughtData[1]._id}})
  await User.findOneAndUpdate({_id: userData[2]._id}, {$addToSet: {thoughts: thoughtData[2]._id}})
  await User.findOneAndUpdate({_id: userData[3]._id}, {$addToSet: {thoughts: thoughtData[3]._id}})
  await User.findOneAndUpdate({_id: userData[4]._id}, {$addToSet: {thoughts: thoughtData[4]._id}})

  console.table(userData);
  console.table(thoughtData);
  console.info('Success!');
  process.exit(0);
});