import { db } from "../database/connection_db.js";

// Función para agregar un "like" a un post
const addLike = async (postId, userId) => {
    const query = `
        INSERT INTO LIKES (post_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING; -- Evita duplicados
    `;
    try {
        await db.query(query, [postId, userId]);
        return { success: true, message: 'Like added successfully' };
    } catch (error) {
        console.error('Error adding like:', error);
        throw error;
    }
};

 // Función para eliminar un "like" de un post
const removeLike = async (postId, userId) => {
    const query = `
        DELETE FROM LIKES WHERE post_id = $1 AND user_id = $2
    `;
    try {
        await db.query(query, [postId, userId]);
        return { success: true, message: 'Like removed successfully' };
    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
};

 // Función para contar los "likes" de un post
const countLikes = async (postId) => {
    const query = `
        SELECT COUNT(*) FROM LIKES WHERE post_id = $1
    `;
    try {
        const result = await db.query(query, [postId]);
        return parseInt(result.rows[0].count, 10);
    } catch (error) {
        console.error('Error counting likes:', error);
        throw error;
    }
};

// Función para verificar si un usuario ha dado "like" a un post
const hasUserLiked = async (postId, userId) => {
    const query = `
        SELECT 1 FROM LIKES WHERE post_id = $1 AND user_id = $2
    `;
    try {
        const result = await db.query(query, [postId, userId]);
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error checking if user liked:', error);
        throw error;
    }
}

export const likeModel = {
    addLike,
    removeLike,
    countLikes,
    hasUserLiked
  };
