const jwt = require("jsonwebtoken");

const setUser = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = req.user;   
        } catch {
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }

    next();
};

module.exports = setUser;
