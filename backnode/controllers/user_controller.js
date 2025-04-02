import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { userModel } from "../models/user_model.js";
import { postModel } from "../models/post_model.js";

const registerUser = async (req,res) => {
    try {
        const {username, email, password, termsAccepted} = req.body

        // Verificar si el usuario aceptó los términos
        if (!termsAccepted) {
            return res.status(400).json({ ok: false, msg: 'DEBES ACEPTAR LOS TÉRMINOS Y CONDICIONES' });
        }

        //verificar condiciones de la contraseña
        const isValidPassword = userModel.validatePassword (password);
        if (!isValidPassword) {
            return res.status(400).json({error: 'PASSWORD DOES NOT MEET REQUIREMENTS'
            });
        }

        //verificar si hay campos incompletos
        if (!username || !password || !email) {
            return res.status(400).json({ok:false, msg: 'CAMPOS INCOMPLETOS'});
        }

        //verificar si el correo ya existe
        const existingEmail = await userModel.findUserByEmail (email);
        if ( existingEmail ) {
            return res.status(400).json({ok:false, msg: 'EL CORREO YA ESTÁ REGISTRADO'});
        }

        //verificar si el usuario ya existe
        const existingUsername = await userModel.findUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ ok: false, msg: 'EL NOMBRE DE USUARIO YA ESTÁ REGISTRADO' });
        }

        //encriptar contraseña
        const salt = await bcryptjs.genSalt(7);
        const hashedPassword = await bcryptjs.hash(password, salt);

        //crear usuario
        const newUser = await userModel.createUser ({email, password: hashedPassword, username, termsAccepted  })

        //crear token
        const token = jwt.sign({ username: newUser.username }, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION })

        return res.status(201).json({ok:true, msg: 'USUARIO REGISTRADO',token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ok: false, msg: 'ERROR SERVER REGISTER'})
    }
}

const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body

        // console.log("SOLICITUD", codigo)
        
        //verificar si hay campos incompletos
        if (!email || !password){
            return res.status(400).json({error: 'CAMPOS INCOMPLETOS'});
        }

        //verificar si el usuario existe
        const user = await userModel.findUserByEmail (email);
        if ( !user ) {
            return res.status(400).json({error: 'USER NOT FOUND'});
        }
        
        //verificar que la contraseña es correcta
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch){
            return res.status(401).json({error: 'INVALID CREDENTIALS'});
        }

        const token = jwt.sign({ id: user.id, email: user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION })

        return res.json({ok:true, msg: 'LOGIN CORRECTO', token, username: user.username, is_admin: user.is_admin})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ok: false, msg: 'ERROR SERVER LOGIN'})
    }
}

// const logoutUser = async (req, res) => {
//     try {
//         // En caso de que estés usando una cookie para almacenar el token, puedes borrarla aquí.
//         //res.clearCookie('token'); // Si es que el JWT está en una cookie

//         // Si el token se gestiona en el frontend (en localStorage, por ejemplo), sólo respondemos con un éxito
//         return res.status(200).json({ ok: true, msg: 'Sesión cerrada correctamente' });

//     } catch (error) {
//         console.error("Error en logout:", error);
//         return res.status(500).json({ ok: false, msg: 'Error en el servidor al cerrar la sesión' });
//     }
// };

const profile = async (req, res) => {
    try {
        const { username } = req.params;

        // Buscar el usuario por el username en la URL
        const user = await userModel.findUserByUsername(username);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si req.username existe

        // Comparar con el usuario autenticado
        const isCurrentUser = req.email === user.email;

        // res.json({
        //     user,
        //     isCurrentUser
        // });
        
        res.json({
            user: { ...user, userId: user.id },  // Incluir el userId
            isCurrentUser
        });


    } catch (error) {
        console.error("Error en profile:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Generar el token de restablecimiento de contraseña
const generateResetToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar si el correo existe
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "EMAIL NOT FOUND" });
        }

        // Generar el token de restablecimiento, con expiración de 1 hora
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

        // Guardar el token y la expiración en la base de datos (para poder invalidarlo más tarde)
        await userModel.saveResetToken(email, resetToken);

        return res.status(200).json({
            message: "Token de restablecimiento generado con éxito",
            resetToken, // Enviar el token al frontend para que el usuario lo use
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "ERROR SERVER TOKEN" });
    }
};

// Restablecer la contraseña
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        console.log("Received token:", token); // Verifica si el token es recibido
        console.log("New password:", newPassword); // Verifica la nueva contraseña

        // Verificar si el token es válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
        const user = await userModel.findUserByEmail(decoded.email);
        if (!user) {
            return res.status(400).json({ error: "INVALID OR EXPIRED TOKEN" });
        }

        // Verificar que la nueva contraseña cumpla con los requisitos
        const isValidPassword = userModel.validatePassword(newPassword);
        if (!isValidPassword) {
            return res.status(400).json({ error: "PASSWORD DOES NOT MEET REQUIREMENTS" });
        }

        // Encriptar la nueva contraseña antes de guardarla
        const salt = await bcryptjs.genSalt(7);
        const hashedPassword = await bcryptjs.hash(newPassword, salt); 

        // Actualizar la contraseña del usuario
        const isUpdated = await userModel.updatePassword(user.email, hashedPassword);
        if (!isUpdated) {
            return res.status(500).json({ error: "ERROR UPDATING PASSWORD" });
        }

        // Limpiar el token de restablecimiento
        await userModel.clearResetToken(user.email);

        return res.status(200).json({ message: "PASSWORD UPDATE SUCCESSFULLY" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "ERROR SERVER PASSWORD" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, birthdate, gender, description, edad } = req.body;

        console.log("EDAD:", edad)

        if (edad < 18){
            return res.status(400).json({ msg: 'MENOR DE EDAD' });
        }
        // Verificar que todos los campos necesarios estén presentes
        if (!name || !birthdate || !gender || !description || !edad) {
            return res.status(400).json({ ok: false, msg: 'Faltan datos para actualizar el perfil' });
        }

        // Realizar la actualización
        const updatedUser = await userModel.updateUserByUsername(req.params.username, { name, birthdate, gender, description });

        if (updatedUser.rowCount === 0) {
            // Si no se encuentra el usuario para actualizar
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado para actualizar' });
        }

        // Retornar los datos actualizados
        return res.json({ ok: true, msg: 'Perfil actualizado', user: updatedUser.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error al actualizar el perfil' });
    }
};

const searchUserBy = async (req, res) => {
    const { query } = req.query;  
    console.log('Parámetro recibido:', query); 
  
    try {
      const users = await userModel.searchUsers(query);
      console.log('Usuarios encontrados:', users);  
      res.status(200).json(users);
    } catch (err) {
      console.error('Error en la búsqueda de usuarios:', err);
      res.status(500).json({ error: 'Error en la búsqueda de usuarios' });
    }
  };

  const getUserProfileWithPostCount = async (req, res) => {
    const userId = req.params.userId;
    
    try {
      const userProfile = await userModel.getUserById(userId); // Método que obtiene datos básicos del usuario
      const postCount = await postModel.countPostsByUser(userId); // Método que cuenta las publicaciones del usuario
  
      if (!userProfile) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Incluye el conteo de publicaciones en la respuesta del perfil del usuario
      res.status(200).json({ ...userProfile, postCount });
    } catch (error) {
      console.error('Error fetching user profile with post count:', error);
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  };
  
export const userController = {
    registerUser,
    loginUser,
    // logoutUser,
    profile,
    generateResetToken,
    resetPassword,
    updateProfile,
    searchUserBy,
    getUserProfileWithPostCount,
}