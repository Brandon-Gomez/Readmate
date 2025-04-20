import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {

    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    token = token.split(" ")[1]

    try {

        // Descodificar el token y obtener más información, si está disponible
        const { id, email } = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = id;
        req.email = email;

        // console.log('Datos del token:', { id, email });
        
        next();
        
    } catch (error) {
        return res.status(400).json({ error: "Invalid Token" });
    }

}