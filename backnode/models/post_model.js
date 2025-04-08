import { db } from "../database/connection_db.js";

// Crear una nueva publicación
const addPost = async (userId, title, description, imageUrl, pdfUrl) => {
  const query = `
        INSERT INTO posts (user_id, title, description, image, pdf_file)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
  const values = [userId, title, description, imageUrl, pdfUrl];
  const result = await db.query(query, values);
  return result.rows[0];
};

// Editar una publicación
const editPost = async (postId, title, description, imageUrl, pdfUrl) => {
  const query = `
    UPDATE posts
    SET title = $1, description = $2, image = $3, pdf_file = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *;
  `;
  const values = [title, description, imageUrl, pdfUrl, postId];
  const result = await db.query(query, values);
  return result;
};

// Eliminar una publicación
const deletePost = async (postId) => {
  const query = `
    DELETE FROM posts
    WHERE id = $1;
  `;
  await db.query(query, [postId]);
};

// Obtener todas las publicaciones
const getAllPosts = async () => {
  const query = `
        SELECT posts.*, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        ORDER BY posts.created_at DESC;
    `;
  const result = await db.query(query);
  return result.rows;
};

const getPostsByUser = async (userId) => {
  const query = `
    SELECT posts.*, users.username
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.user_id = $1
    ORDER BY posts.created_at DESC;
  `;
  const result = await db.query(query, [userId]);
  return result.rows;
};

// Obtener una publicación por ID
const getPostById = async (postId) => {
  const query = `
        SELECT posts.*, users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = $1;
    `;
  const result = await db.query(query, [postId]);
  return result.rows[0];
};

const countPostsByUser = async (userId) => {
  const query = `
    SELECT COUNT(*) AS post_count
    FROM posts
    WHERE user_id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows[0].post_count; // Retorna el conteo de publicaciones
};

// Dar "me gusta" a una publicación
const likePost = async (postId, userId) => {
  const query = `
        INSERT INTO likes (post_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (post_id, user_id) DO NOTHING;
    `;
  await db.query(query, [postId, userId]);

  // Actualizar conteo de "me gusta"
  const updateQuery = `
        UPDATE posts
        SET likes_count = likes_count + 1
        WHERE id = $1
        RETURNING *;
    `;
  const result = await db.query(updateQuery, [postId]);
  return result.rows[0];
};

// Comentar una publicación
const commentOnPost = async (postId, userId, comment) => {
  const query = `
        INSERT INTO comments (post_id, user_id, comment)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  const result = await db.query(query, [postId, userId, comment]);
  return result.rows[0];
};

export const postModel = {
  addPost,
  editPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  likePost,
  commentOnPost,
  countPostsByUser,
};
