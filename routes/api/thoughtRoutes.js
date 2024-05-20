const router = require('express').Router();
const { User, Thought } = require('../../models');

// get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().select('-__v');
    res.json(thoughts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get single thought
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId)
      .select('-__v')
      .lean();

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// create thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);

    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: thought._id },
    });

    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update thought
router.put('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// remove thought
router.delete('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    await User.findOneAndUpdate(
      { username: thought.username },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );

    res.json({ message: 'Thought successfully deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


// add thought reaction
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// remove thought reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    res.json(thought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;