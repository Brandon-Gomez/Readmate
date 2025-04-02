/** @format */

import { db } from "../database/connection_db.js";
import bcryptjs from "bcryptjs";

const createUser = async ({ email, password, username, termsAccepted }) => {
  const query = {
    text: `
        INSERT INTO users (email, password, username, terms_accepted)
        VALUES ($1, $2, $3, $4)
        RETURNING email, username, id
        `,
    values: [email, password, username, termsAccepted],
  };

  const { rows } = await db.query(query);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const query = {
    text: `
        SELECT * FROM users
        WHERE EMAIL = $1
        `,
    values: [email],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
};

// Guardar el token de restablecimiento y su expiración
const saveResetToken = async (email, resetToken) => {
  const query = {
    text: `
        UPDATE users
        SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL '1 hour'
        WHERE email = $2
        `,
    values: [resetToken, email],
  };
  await db.query(query);
};

// Limpiar el token de restablecimiento
const clearResetToken = async (email) => {
  const query = {
    text: `
        UPDATE users
        SET reset_token = NULL, reset_token_expiry = NULL
        WHERE email = $1
        `,
    values: [email],
  };

  await db.query(query);
};

// Actualizar la contraseña
const updatePassword = async (email, hashedPassword) => {
  const query = {
    text: `
        UPDATE users
        SET password = $1
        WHERE email = $2
        `,
    values: [hashedPassword, email],
  };

  try {
    const result = await db.query(query);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error updating password:", error);
    return false;
  }
};

const findUserByUsername = async (username) => {
  const result = await db.query(
    `
        SELECT * FROM users WHERE username = $1
        `,
    [username]
  );

  if (result.rows.length > 0) {
    return result.rows[0]; // Devuelve el primer usuario encontrado
  }
  return null;
};

const updateUserByUsername = async (username, data) => {
  try {
    const result = await db.query(
      "UPDATE users SET name = $1, birthdate = $2, gender = $3, description = $4 WHERE username = $5 RETURNING *",
      [data.name, data.birthdate, data.gender, data.description, username]
    );

    // Verificar si se ha actualizado algún registro
    if (result.rowCount === 0) {
      throw new Error("Usuario no encontrado para actualización");
    }

    return result;
  } catch (error) {
    console.error("Error en la actualización del usuario:", error);
    throw error; // Propagar el error para que sea capturado en el controlador
  }
};

const updatePhotoByUsername = async (username, photo) => {
  try {
    const result = await db.query(
      "UPDATE users SET PROFILE_PICTURE = $1 WHERE username = $2 RETURNING *",
      [photo, username]
    );

    // Verificar si se ha actualizado algún registro
    if (result.rowCount === 0) {
      throw new Error("Usuario no encontrado para actualización");
    }

    return result;
  } catch (error) {
    console.error("Error en la actualización del usuario:", error);
    throw error; // Propagar el error para que sea capturado en el controlador
  }
};

const searchUsers = async (query) => {
  try {
    console.log("Consulta SQL para:", query); // Log para ver el query
    const result = await db.query(
      "SELECT id, username, name, email FROM users WHERE username ILIKE $1 OR name ILIKE $1 OR email ILIKE $1",
      [`%${query}%`] // Interpolación para la búsqueda
    );
    console.log("Resultado SQL:", result.rows); // Verifica los resultados SQL
    return result.rows; // Devuelve las filas encontradas
  } catch (err) {
    console.error("Error en el modelo:", err); // Loguea el error
    throw err;
  }
};

const getUserById = async (userId) => {
  const query = `
    SELECT id, username, email, profile_picture
    FROM users
    WHERE id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows[0];
};

const isAdmin = async (userId) => {
  const query = `
    SELECT is_admin = TRUE AS is_admin
    FROM users
    WHERE id = $1;
  `;
  const result = await db.query(query, [userId]);
  return result.rows[0].is_admin;
}

export const userModel = {
  createUser,
  findUserByEmail,
  validatePassword,
  saveResetToken,
  clearResetToken,
  updatePassword,
  //updateUserByEmail,
  findUserByUsername,
  updateUserByUsername,
  searchUsers,
  updatePhotoByUsername,
  getUserById,
  isAdmin,
};
