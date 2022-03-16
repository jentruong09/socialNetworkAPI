const { User, Thought } = require("../models");

module.exports = {
  // get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .sort({ createdAt: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // get one thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        return Thought.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: thought._id } }, // use $push instead?
          { new: true }
        );
      })
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({
                message: "Thought created, but no user found with that ID",
              })
          : res.json("Created the thought!")
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // delete a thought
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "Thought created but no user with this id!" })
          : res.json({ message: "Thought deleted successfully" })
      )
      .catch((err) => res.status(500).json(err));
  },

  // add reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // remove a reaction
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
