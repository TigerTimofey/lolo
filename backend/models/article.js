const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: { 
        type: [String],
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pubDate: {  
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
