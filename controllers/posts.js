import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const post = req.body;

    // Creating the new post using the data from the request body
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        // Save the new post to the database
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updatePost = async (req,res)=>{
    const {id: _id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatePost = await PostMessage.findByIdAndUpdate(_id, {...post,_id}, {new: true});

    res.json(updatePost);

}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(404).send('No post with that id');

    try {
        await PostMessage.findByIdAndDelete(id); // Use findByIdAndDelete instead of findByIdAndRemove
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error("Error deleting post:", error.message); // Log the error for debugging
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res)=>{
    const { id } = req.params;

    if(!req.userId) return res.json({message: "User not Authenticated"})

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id)=> id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId);
    }else{
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
}
