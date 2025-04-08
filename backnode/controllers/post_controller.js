import { postModel } from "../models/post_model.js";
import { userModel } from "../models/user_model.js";
import { uploadBookToFirebase } from "./firebaseupload_controller.js";

const createPost = async (req, res) => {
  const { title, description } = req.body;
  const user = await userModel.findUserByEmail(req.email);
  const userId = user.id;

  const imagePost = req.files?.images || [];
  const pdf = req.files?.pdf || [];

  try {
    if (imagePost.length === 0 || pdf.length === 0) {
      return res.status(400).json({ message: "Se requieren una imagen y un archivo PDF." });
    }

    const imageUrl = await uploadBookToFirebase(imagePost[0]); 
    const pdfUrl = await uploadBookToFirebase(pdf[0]);

    const newPost = await postModel.addPost(userId, title, description, imageUrl, pdfUrl);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    res.status(500).json({ message: "Error al crear la publicación" });
  }
};

// Editar una publicación
const editPost = async (req, res) => {
  const postId = req.params.id;
  const { title, description } = req.body;
  const imagePost = req.files?.images || [];
  const pdf = req.files?.pdf || [];

  console.log('Received data:', { postId, title, description });

  console.log('Received files:', req.files);

  try {
    // Obtenemos el post existente para acceder a los valores actuales
    const existingPost = await postModel.getPostById(postId);

    // Inicializamos las URLs con las actuales, que solo cambiarán si hay nuevos archivos
    let imageUrls = existingPost.image; // Mantiene la imagen existente
    let pdfUrl = existingPost.pdf_file; // Mantiene el PDF existente

    if (imagePost.length > 0) {
      imageUrls = await uploadBookToFirebase(imagePost[0]);
    }
    if (pdf.length > 0) {
      pdfUrl = await uploadBookToFirebase(pdf[0]);
    }
    const updatedPost = await postModel.editPost(postId, title, description, imageUrls, pdfUrl);
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error al editar la publicación:", error);
    res.status(500).json({ message: "Error al editar la publicación" });
  }
};

// Eliminar una publicación
const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
    const user = await userModel.findUserByEmail(req.email);
    const userId = user.id;

    // Verificar si el usuario es el creador de la publicación
    const post = await postModel.getPostById(postId);
    if (!post || post.user_id !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta publicación." });
    }

    // Eliminar la publicación de la base de datos
    await postModel.deletePost(postId);
    res.status(200).json({ message: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la publicación:", error);
    res.status(500).json({ message: "Error al eliminar la publicación" });
  }
};

// Obtener todas las publicaciones
const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Obtener una publicación por ID
const getPostsByUser = async (req, res) => {
  try {
    // const user = await userModel.findUserByEmail(req.email);
    const userId = req.params.userId;
    const post = await postModel.getPostsByUser(userId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Obtener una publicación por ID
const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postModel.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Dar "me gusta" a una publicación
const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId; // ID del usuario que da el "me gusta"
    const updatedPost = await postModel.likePost(postId, userId);
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Comentar una publicación
const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId, comment } = req.body;
    const newComment = await postModel.commentOnPost(postId, userId, comment);
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPostCountByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // Obtenemos el userId de los parámetros de la solicitud
    const postCount = await postModel.countPostsByUser(userId); // Llamamos a la función del modelo
    
    res.status(200).json({ post_count: postCount }); // Enviamos el conteo de publicaciones como JSON
  } catch (error) {
    console.error('Error al contar las publicaciones:', error);
    res.status(500).json({ error: 'Error al obtener el conteo de publicaciones' });
  }
};

export const postController = {
  createPost,
  editPost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  likePost,
  commentOnPost,
  getPostCountByUser,
};
