import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export function authenticateToken(req, res, next) {
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    console.log('❌ No token found');
    return res.status(401).json({ message: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('❌ Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
}
