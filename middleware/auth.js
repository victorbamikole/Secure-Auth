const jwt = require("jsonwebtoken");

/** auth middleware */
async function Auth(req, res, next) {
  try {
    // access authorize header to validate request
    const token = await req.headers.authorization.split(" ")[1];

    // retrive the user details fo the logged in user
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decodedToken;
    console.log("TOKENUSER", req.user);
    console.log("decodedToken", decodedToken);

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed!" });
  }
}
function localVariables(req, res, next) {
    req.app.locals = {
      OTP: null,
      resetSession: false,
    };
    next();
}

module.exports = { Auth, localVariables };
