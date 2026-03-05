const Post = require('../models/Post');

//Create Post
const createPost = async (req, res) => {
    try {
        const post = await Post.create({
            ...req.body,
            author: req.user.id
        });
        res.status(201).json(post);
    }catch(err){
        res.status(400).json({ message: err.message});
    }
};

//Get App all post with autho details
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
        .populate('author', 'name email role')
        .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch(err){
        res.status(500).json({ message: err.message});
    }
};

//Get Single Post
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate('author', 'name email');
        if(!post)
            return res.status(404).json({ message: 'Post not found'});
        res.status(200).json(post);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

//Get post by logged In User
const getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({author: req.user.id})
        .sort({createdAt: -1});
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

//Update Post
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post)
            return res.status(404).json({message: 'Post not found'});

        //Only author can update their post
        if(post.author.toString() !== req.user.id) {
            return res.status(403).json({message: 'Not authorized to update post'});
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id, req.body, {new: true, runValidators: true}
        );
        res.status(200).json(updatedPost);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

//Delete Post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message: 'Post not found'});

        if(post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({message: 'Not authprized to delete'});
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Post deleted successfully'});
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

module.exports = { createPost, getAllPosts, getPostById, getMyPosts, updatePost, deletePost};