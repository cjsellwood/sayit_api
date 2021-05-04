const jsonwebtoken = require("jsonwebtoken")

module.exports = (user_id) => {
  // Expires in 7 days
  const expiresIn = `${1000 * 60 * 60 * 24 * 7}`;
  const payload = {
    sub: user_id,
    iat: Date.now(),
  };
  const signedToken = jsonwebtoken.sign(payload, process.env.JWT_PRIVATE, {
    expiresIn,
  });
  return {
    token: signedToken,
    expiresIn,
  };
}