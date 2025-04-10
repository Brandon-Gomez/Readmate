import { likeModel } from "../models/like_model.js";
import { userModel } from "../models/user_model.js";

const newLike = async (req, res) => {
    const { postId } = req.body;
    const user = await userModel.findUserByEmail(req.email);
    const userId = user.id; // Asume que el ID del usuario está en `req.user` después del middleware JWT

    try {
        const alreadyLiked = await likeModel.hasUserLiked(postId, userId);
        if (alreadyLiked) {
            return res.status(400).json({ message: 'User has already liked this post' });
        }

        const result = await likeModel.addLike(postId, userId);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding like' });
    }
};

const deleteLike = async (req, res) => {
    const { postId } = req.params;
    const user = await userModel.findUserByEmail(req.email);
    const userId = user.id;

    try {
        const alreadyLiked = await likeModel.hasUserLiked(postId, userId);
        if (!alreadyLiked) {
            return res.status(400).json({ message: 'User has not liked this post' });
        }

        const result = await likeModel.removeLike(postId, userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while removing like' });
    }
};


// Controlador para contar los "likes" de un post
const countLikes = async (req, res) => {
    const { postId } = req.params;

    try {
        const likeCount = await likeModel.countLikes(postId);
        res.status(200).json({ postId, likeCount });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while counting likes' });
    }
};

// Controlador para verificar si el usuario ya ha dado "me gusta" a una publicación
const checkIfLiked = async (req, res) => {
    const { postId } = req.params;
    const user = await userModel.findUserByEmail(req.email);
    const userId = user.id;

    try {
        const isLiked = await likeModel.hasUserLiked(postId, userId);
        res.status(200).json({ isLiked });
    } catch (error) {
        console.error("Error checking if user liked:", error);
        res.status(500).json({ error: 'Error checking if liked' });
    }
};

export const likeController = {
    newLike,
    deleteLike,
    countLikes,
    checkIfLiked
}