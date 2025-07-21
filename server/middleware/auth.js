import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({
      success: false,
      message: "No token provided or malformed Authorization header",
    });
  }

  const token = authHeader.split(" ")[1]; 

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default auth;
