var express = require('express');
var router = express.Router();
var Article = require('../model/article');
var Comment = require('../model/comments');
var auth = require('../middlewares/auth');

/* GET users listing. */
// all articles
router.get('/', function (req, res, next) {
  Article.find({})
    .then((data) => res.render('articles', { list: data }))
    .catch((err) => next(err));
});
// new article
router.get('/new', auth.isUserLogged, (req, res, next) => {
  res.render('form');
});

router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(' ');
  req.body.author = req.user.id;
  Article.create(req.body)
    .then((data) => res.redirect('/articles'))
    .catch((err) => next(err));
});
// single article
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  // Article.findById(id)
  //   .then((data) => res.render('singleArticle', { article: data }))
  //   .catch((err) => next(err));
  Article.findById(id)
    .populate('comment')
    .populate('author', 'name email')
    .exec()
    .then((article) => res.render('singleArticle', { article }))
    .catch((err) => next(err));
});

router.use(auth.isUserLogged);

// edit article
router.get('/:id/edit', (req, res, next) => {
  let id = req.params.id;
  Article.findById(id)
    .then((data) => res.render('editForm', { article: data }))
    .catch((err) => next(err));
});
router.post('/:id', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body)
    .then((data) => res.redirect(`/articles/${id}`))
    .catch((err) => next(err));
});
// delete article
router.get('/:id/delete', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id)
    .then((data) => res.redirect('/articles'))
    .catch((err) => next(err));
});
// like article
router.get('/:id/like', (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } })
    .then((data) => res.redirect('/articles/' + id))
    .catch((err) => next(err));
});
//  create Comments
router.post('/:id/comment', (req, res, next) => {
  var id = req.params.id;
  // creating comment
  req.body.articleId = id;
  Comment.create(req.body)
    .then((info) => {
      Article.findByIdAndUpdate(id, { $push: { comment: info._id } })
        .then((data) => res.redirect('/articles/' + id))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

module.exports = router;
