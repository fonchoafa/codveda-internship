const Post = require('../../models/Post');

const postResolvers = {
    Query: {
        // Get all posts
        getPosts: async () => {
            const posts = await Post.find()
                .populate('author')
                .sort({ createdAt: -1 });
            return posts.map(p => ({ ...p._doc, id: p._id }));
        },

        // Get single post
        getPostById: async (_, { id }) => {
            const post = await Post.findById(id).populate('author');
            if(!post) throw new Error('Post not found');
            return { ...post._doc, id: post._id };
        },

        // Get my posts
        getMyPosts: async (_, __, context) => {
            if(!context.user) throw new Error('Not authorized');
            const posts = await Post.find({ author: context.user.id })
                .sort({ createdAt: -1 });
            return posts.map(p => ({ ...p._doc, id: p._id }));
        }
    },

    Mutation: {
        // Create post
        createPost: async (_, args, context) => {
            if(!context.user) throw new Error('Not authorized');
            const post = await Post.create({
                ...args,
                author: context.user.id
            });
            await post.populate('author');
            return { ...post._doc, id: post._id };
        },

        // Update post
        updatePost: async (_, { id, ...args }, context) => {
            if(!context.user) throw new Error('Not authorized');
            const post = await Post.findById(id);
            if(!post) throw new Error('Post not found');
            if(post.author.toString() !== context.user.id) {
                throw new Error('Not authorized to update this post');
            }
            const updated = await Post.findByIdAndUpdate(
                id, args, { new: true, runValidators: true }
            ).populate('author');
            return { ...updated._doc, id: updated._id };
        },

        // Delete post
        deletePost: async (_, { id }, context) => {
            if(!context.user) throw new Error('Not authorized');
            const post = await Post.findById(id);
            if(!post) throw new Error('Post not found');
            if(post.author.toString() !== context.user.id &&
               context.user.role !== 'admin') {
                throw new Error('Not authorized to delete this post');
            }
            await Post.findByIdAndDelete(id);
            return 'Post deleted successfully';
        }
    }
};

module.exports = postResolvers;