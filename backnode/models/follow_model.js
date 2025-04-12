import { db } from "../database/connection_db.js";

  // Añadir un seguidor
  const addFollow = async (followerId, followedId) => {
    const query = `
      INSERT INTO follows (follower_id, followed_id) 
      VALUES ($1, $2) 
      RETURNING *;
    `;
    const values = [followerId, followedId];
    const result = await db.query(query, values);
    return result.rows[0];
  };

  // Eliminar un seguidor
  const removeFollow = async (followerId, followedId) => {
    const query = `
      DELETE FROM follows 
      WHERE follower_id = $1 AND followed_id = $2 
      RETURNING *;
    `;
    const values = [followerId, followedId];
    const result = await db.query(query, values);
    return result.rows[0];
  };

  // Obtener la lista de seguidores
  const getFollowers = async (userId) => {
    const query = `
    SELECT u.id, u.name, u.profile_picture 
    FROM follows f
    JOIN users u ON u.id = f.follower_id
    WHERE f.followed_id = $1;
  `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  };

  // Obtener la lista de seguidos
  const getFollowing = async (userId)  => {
    const query = `
      SELECT u.id, u.name, u.profile_picture
      FROM follows f
      JOIN users u ON u.id = f.followed_id
      WHERE f.follower_id = $1;
    `;
    const values = [userId];
    const result = await db.query(query, values);
    return result.rows;
  };

  // Obtener la cantidad de seguidores de un usuario
const getFollowerCount = async (userId) => {
  const query = `
    SELECT COUNT(*) AS follower_count 
    FROM follows 
    WHERE followed_id = $1;
  `;
  const values = [userId];
  const result = await db.query(query, values);
  return result.rows[0].follower_count;
};

// Obtener la cantidad de seguidos de un usuario
const getFollowingCount = async (userId) => {
  const query = `
    SELECT COUNT(*) AS following_count 
    FROM follows 
    WHERE follower_id = $1;
  `;
  const values = [userId];
  const result = await db.query(query, values);
  return result.rows[0].following_count;
};

// Verificar si un usuario sigue a otro
const isFollowing = async (followerId, followedId) => {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM follows
      WHERE follower_id = $1 AND followed_id = $2
    ) AS is_following;
  `;
  const values = [followerId, followedId];
  // console.log (values);
  const result = await db.query(query, values);
  // console.log (result);
  return result.rows[0].is_following; // Devuelve true o false directamente
};


export const FollowModel = {
    addFollow,
    removeFollow,
    getFollowers,
    getFollowing,
    getFollowerCount,
    getFollowingCount,
    isFollowing
}