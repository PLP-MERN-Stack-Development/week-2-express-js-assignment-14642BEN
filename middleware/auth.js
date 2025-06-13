const API_KEY = '123456'; // Replace with your real API key or env var

const authenticate = (req, res, next) => {
  const userApiKey = req.headers['x-api-key'];
  if (userApiKey !== API_KEY) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
  next();
};

module.exports = authenticate;
