import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '5fe9034a9540e743188ac16ec2000b7a868fb8cb772701082ba39437676db4e5';

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
