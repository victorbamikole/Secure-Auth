const router = require("express").Router();
const authController = require("../controllers/authController");
const mailerController = require("../controllers/mailerController");

router.post("/register", authController.createUser);
router.post("/registerMail", mailerController.registerMail);
router.post("/authenticate", authController.verifyUser); // authenticate user
router.post("/login", authController.verifyUser, authController.login); // login in app

/** GET Methods */
router.get("/user/:username", authController.getUser); // user with username
router.get("/generateOTP", authController.verifyUser,localVariables,authController.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables

/** PUT Methods */
router.route("/updateuser").put(Auth, controller.updateUser); // is use to update the user profile
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); // use to reset password

module.exports = router;
