var express = require('express');
var router = express.Router();
var Comment = require('../model/comments');

router.get('/:id/edit', (req, res, next) => {
  var commentId = req.params.id;
  Comment.findById(commentId)
    .then((comment) => res.render('editCommentForm', { comment }))
    .catch((err) => next(err));
});
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body)
    .then((data) => res.redirect('/article/' + data.articleId))
    .catch((err) => next(err));
});
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndDelete(id)
    .then((data) => res.redirect('/article/' + data.articleId))
    .catch((err) => next(err));
});
router.get('/:id/like', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } })
    .then((data) => res.redirect('/article/' + data.articleId))
    .catch((err) => next(err));
});
router.get('/:id/dislike', (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { likes: -1 } })
    .then((data) => res.redirect('/article/' + data.articleId))
    .catch((err) => next(err));
});

module.exports = router;
