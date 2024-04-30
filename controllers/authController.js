const User = require("../models/User");

module.exports = {
  createUser: async (req, res) => {
    const user = req.body;
    console.log("USERNOW", req.body);
    res.json("register route");
    // try {
    //   await admin.auth().getUserByEmail(user.email);
    //   res.status(400).json({ message: "Email already registered" });
    // } catch (error) {
    //   if (error.code === "auth/user-not-found") {
    //     try {
    //       const userResponse = await admin.auth().createUser({
    //         email: user.email,
    //         password: user.password,
    //         emailVerified: false,
    //         disabled: false,
    //       });
    //       const newUser = new User({
    //         userName: user.userName,
    //         email: user.email,
    //         password: CryptoJS.AES.encrypt(
    //           user.password,
    //           process.env.SECERET
    //         ).toString(),
    //         uid: userResponse.uid,
    //         userType: "Client",
    //       });

    //       await newUser.save();
    //       res.status(201).json({ message: true });
    //     } catch (error) {
    //       res.status(501).json({ message: false, error: error.message });
    //     }
    //   }
    // }
  },
  verifyUser: async (req, res) => {},
  login: async (req, res) => {},
  getUser: async (req, res) => {},
};
