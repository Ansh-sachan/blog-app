var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
    comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
