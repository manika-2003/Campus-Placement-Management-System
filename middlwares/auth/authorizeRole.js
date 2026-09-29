const jwt = require("jsonwebtoken");
const authorizeRole = (role) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.redirect("/auth/login");
    }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      if(data.role!==role) return res.send('Access Denied')
      req.user = data;
      next();
    } catch (err) {
      return res.redirect("/auth/login");
    }
  };
};
module.exports = authorizeRole;
