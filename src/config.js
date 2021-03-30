module.exports = {
  BACKEND_ROOT_URL: false
    ? `http://localhost:3001`
    : "https://pfp-logger-backend.herokuapp.com",
  CLIENT_ROOT_URL: false
    ? `http://localhost:3000`
    : "https://pfp-logger.netlify.app",
};
