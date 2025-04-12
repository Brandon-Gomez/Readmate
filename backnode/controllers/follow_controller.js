import { FollowModel } from "../models/follow_model.js";
import { userModel } from "../models/user_model.js";

  // Seguir a un usuario
const followUser = async(req, res) => {
    const user = await userModel.findUserByEmail(req.email);
    const follower_id = user.id;
    const { followed_id } = req.body;

    if (follower_id === followed_id) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo." });
    }

    try {
      const result = await FollowModel.addFollow(follower_id, followed_id);
      res.status(201).json({ message: "Usuario seguido con éxito.", result });
    } catch (error) {
      res.status(500).json({ message: "Error al seguir al usuario.", error });
    }
};

  // Dejar de seguir a un usuario
const unfollowUser = async(req, res) => {
    const user = await userModel.findUserByEmail(req.email);
    const follower_id = user.id;
    const { followed_id } = req.body;

    try {
      const result = await FollowModel.removeFollow(follower_id, followed_id);
      res.status(200).json({ message: "Dejaste de seguir al usuario.", result });
    } catch (error) {
      res.status(500).json({ message: "Error al dejar de seguir al usuario.", error });
    }
};

  // Obtener seguidores de un usuario
  const getFollowers = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const followers = await FollowModel.getFollowers(userId);
      res.status(200).json(followers);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los seguidores.", error });
    }
  };

  // Obtener seguidos de un usuario
const getFollowing = async(req, res) => {
    const { userId } = req.params;

    try {
      const following = await FollowModel.getFollowing(userId);
      res.status(200).json(following);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los seguidos.", error });
    }
};

// Obtener la cantidad de seguidores de un usuario
const getFollowerCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const followerCount = await FollowModel.getFollowerCount(userId);
    res.status(200).json({ followerCount });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la cantidad de seguidores.", error });
  }
};

// Obtener la cantidad de seguidos de un usuario
const getFollowingCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const followingCount = await FollowModel.getFollowingCount(userId);
    res.status(200).json({ followingCount });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la cantidad de seguidos.", error });
  }
};

// Verificar si un usuario sigue a otro
const checkIfFollowing = async (req, res) => {
  const user = await userModel.findUserByEmail(req.email);
  const follower_id = user.id;
  const followed_id = req.params.userId;
  // console.log(followed_id)

  try {
    const isFollowing = await FollowModel.isFollowing(follower_id, followed_id);
    res.status(200).json({ isFollowing });
  } catch (error) {
    res.status(500).json({ message: "Error al verificar si sigue al usuario.", error });
  }
};

export const followController = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowerCount,
    getFollowingCount,
    checkIfFollowing
}