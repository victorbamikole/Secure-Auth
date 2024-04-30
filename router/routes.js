const router = require("express").Router();
const authController = require("../controllers/authController");
const mailerController = require("../controllers/mailerController");
const { localVariables, Auth } = require("../middleware/auth");

router.post("/register", authController.createUser);
router.post("/registerMail", mailerController.registerMail);
router.post("/authenticate", authController.verifyUser, (req, res) =>
  res.end()
); // authenticate user
router.post("/login", authController.verifyUser, authController.login); // login in app

/** GET Methods */
router.get("/user/:username", authController.getUser); // user with username
router.get(
  "/generateOTP",
  authController.verifyUser,
  localVariables,
  authController.generateOTP
); // generate random OTP
router.get("/verifyOTP", authController.verifyUser, authController.verifyOTP); // verify generated OTP
router.get("/createResetSession", authController.createResetSession); // reset all the variables

/** PUT Methods */
router.put("/updateuser", Auth, authController.updateUser); // is use to update the user profile
router.put(
  "/resetPassword",
  authController.verifyUser,
  authController.resetPassword
); // use to reset password

module.exports = router;
