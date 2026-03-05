const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [10, 'Content must be at leat 10 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AuthUser',
        required: [true, 'Author is required']
    },
    tags: {
        type: [String],
        default: []
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true});

//Database Indexing for faster queries
postSchema.index({ author: 1});
postSchema.index({ title: 'text', content: 'text'});
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);