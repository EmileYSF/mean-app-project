const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => { 
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret_key_that_should_be_soooo_long");
        req.userTokenData = { email: decodedToken.email, userId: decodedToken.id };
        next();
    } catch (error) {
        res.status(401).json({
            message: "You must login first !"
        });
    }

};