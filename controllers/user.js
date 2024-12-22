const User = require("../models/user");
const { setUser } = require("../service/auth");
async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });

  return res.redirect("/login");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password,
  });
  if (!user)
    return res.render("login", {
      error: "Invalid Useremail or Password",
    });

  const token = setUser(user);
  res.cookie("uid", token, {
    httpOnly: true,
    maxAge: 900000, // 15 minutes
  });

  return res.redirect("/");
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};
