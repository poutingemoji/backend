module.exports = {
  BACKEND_ROOT_URL: false
    ? `http://localhost:3001`
    : "https://pfp-logger-backend.herokuapp.com",
  CLIENT_ROOT_URL: true
    ? `http://localhost:3000`
    : "https://agitated-stonebraker-e7d7da.netlify.app",
};
