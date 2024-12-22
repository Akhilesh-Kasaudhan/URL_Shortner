const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
  try {
    const userId = req.cookies?.uid;
    if (!userId) return res.redirect("/login");
    const user = getUser(userId);

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("initial server error");
  }
}
async function checkAuth(req, res, next) {
  console.log(req.headers.authorization.split(" ")[1]);

  const userId = req.cookies?.uid;
  if (!userId) return res.redirect("/login");
  const user = await getUser(userId);
  if (!user) return res.redirect("/login");
  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
};
