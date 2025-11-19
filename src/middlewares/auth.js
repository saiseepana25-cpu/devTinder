const adminAuth = (req, res, next) => {
  console.log("admin check");
  const token = "xyz";
  const isAuthorizedAdmin = token == "xyz";
  if (!isAuthorizedAdmin) {
    res.status(401).send("unauthorized admin");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("admin check");
  const token = "xyz";
  const isAuthorizedUser = token == "xysz";
  if (!isAuthorizedUser) {
    res.status(401).send("unauthorized user");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
