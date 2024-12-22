const jwt = require("jsonwebtoken");
const secret = "Akhil2003@shiv$";
function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret,
    { expiresIn: 90000 }
  );
}
function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log(error);
    return null;
  }
}
module.exports = {
  setUser,
  getUser,
};
