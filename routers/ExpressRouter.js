const express = require('express');
const router = express.Router();

const db = require('../data/db');

router.post('/', (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
  }
  db.insert(req.body)
    .then((post) => {
      console.log(post);
      res.status(201).json({ CREATED_POST: post });
    })
    .catch((error) => status(500).json({ error: 'There was an error while saving the post to the database' }));
});

router.post('/:id/comments', (req, res) => {
  if (!req.body.text) {
    res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
  } else {
    db.findById(req.params.id)
      .then((post) => {
        if (post.length < 1) {
          res.status(404).json({ message: 'The post with the specified ID does not exist.' });
        } else {
          db.insertComment(req.body)
            .then((commentId) => {
              console.log(commentId);

              db.findCommentById(commentId.id).then((comment) => res.status(201).json({ CREATED: comment }));
            })
            .catch((err) => console.log(err.message));
        }
      })
      .catch((err) => console.log(err.message));
  }
});

router.get('/', (req, res) => {
  db.find()
    .then((posts) => res.status(200).json(posts))
    .catch((error) => console.log(error.message));
});

router.get('/:id', (req, res) => {
  db.findById(req.params.id)
    .then((post) => {
      if (post.length === 0) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else if (post) {
        res.status(200).json(post);
      }
    })
    .catch((error) => res.status(500).json({ error: 'The post information could not be retrieved.' }));
});

router.get('/:id/comments', (req, res) => {
  db.findPostComments(req.params.id)
    .then((comments) => res.status(200).json(comments))
    .catch((error) => console.log(error.message));
});

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
    .then((removed) => {
      if (removed === 1) {
        res.status(200).json({ POST_DELETED_WITH_ID: req.params.id, NUMBER_OF_ITEMS_REMOVED: removed });
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be modified.' }));
});

router.put('/:id', (req, res) => {
  const body = req.body;
  db.findById(req.params.id)
    .then((id) => {
      if (id.length < 1) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else if (!body.title || !body.contents) {
        console.log(body);
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' });
      } else {
        db.update(req.params.id, req.body).then((updated) => res.status(201).json({ PUTTED: updated }));
      }
    })
    .catch((err) => res.status(500).json({ error: 'The post information could not be modified.' }));
});

module.exports = router;
