const router = require('express').Router();
const { User, Thought } = require('../../models');

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .populate('thoughts')
      .populate('friends')
      .select('-__v');
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// single user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('thoughts')
      .populate('friends')
      .select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update user
router.put('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      req.body, 
      {new: true, runValidators: true,});

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// delete user
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    res.json({ message: 'User and associated thoughts deleted!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// adding friend to list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// removing friend from list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } }, // Use req.params.friendId
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;